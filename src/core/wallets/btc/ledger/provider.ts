import Transport from "@ledgerhq/hw-transport";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { Transaction } from "@scure/btc-signer";
import { Buffer } from "buffer";
import AppClient, {
  computeLeafHash,
  DefaultWalletPolicy,
  signMessage,
  signPsbt,
  slashingPathPolicy,
  stakingTxPolicy,
  tryParsePsbt,
  unbondingPathPolicy,
  WalletPolicy,
} from "ledger-bitcoin-babylon";

import type { BTCConfig, InscriptionIdentifier, SignPsbtOptions } from "@/core/types";
import { IBTCProvider, Network } from "@/core/types";
import { ContractType, getContractType } from "@/core/utils/getContractType";
import { getPublicKeyFromXpub, toNetwork } from "@/core/utils/wallet";

import logo from "./logo.svg";

type LedgerWalletInfo = {
  app: AppClient;
  policy: DefaultWalletPolicy;
  mfp: string | undefined;
  extendedPublicKey: string | undefined;
  address: string | undefined;
  path: string | undefined;
  publicKeyHex: string | undefined;
};

export const WALLET_PROVIDER_NAME = "Ledger";

export class LedgerProvider implements IBTCProvider {
  private ledgerWalletInfo: LedgerWalletInfo | undefined;
  private config: BTCConfig;

  constructor(_wallet: any, config: BTCConfig) {
    this.config = config;
  }

  private createTransportWebUSB = async () => {
    return await TransportWebUSB.create();
  };

  private createTransportWebHID = async () => {
    return await TransportWebHID.create();
  };

  connectWallet = async (): Promise<void> => {
    const transport = await this.createTransportWebUSB().catch(async (usbError) => {
      // If WebUSB fails, try WebHID
      return await this.createTransportWebHID().catch((hidError) => {
        throw new Error(
          `Could not connect to Ledger device: ${usbError.message || usbError}, ${hidError.message || hidError}`,
        );
      });
    });

    const app = new AppClient(transport);

    // Get the master key fingerprint
    const fpr = await app.getMasterFingerprint();

    const networkDerivationIndex = this.config.network === Network.MAINNET ? 0 : 1;
    const taprootPath = `m/86'/${networkDerivationIndex}'/0'`;

    // Get and display on the screen the first taproot address
    const firstTaprootAccountPubkey = await app.getExtendedPubkey(taprootPath);
    if (!firstTaprootAccountPubkey) throw new Error("Could not retrieve the extended public key");

    const firstTaprootAccountPolicy = new DefaultWalletPolicy(
      "tr(@0/**)",
      `[${fpr}/86'/${networkDerivationIndex}'/0']${firstTaprootAccountPubkey}`,
    );
    if (!firstTaprootAccountPolicy) throw new Error("Could not retrieve the policy");

    const firstTaprootAccountAddress = await app.getWalletAddress(
      firstTaprootAccountPolicy,
      null,
      0, // 0 - normal, 1 - change
      0, // address index
      true, // show address on the wallet's screen
    );

    const currentNetwork = await this.getNetwork();
    const publicKeyBuffer = getPublicKeyFromXpub(firstTaprootAccountPubkey, "M/0/0", toNetwork(currentNetwork));

    this.ledgerWalletInfo = {
      app,
      policy: firstTaprootAccountPolicy,
      mfp: fpr,
      extendedPublicKey: firstTaprootAccountPubkey,
      path: taprootPath,
      address: firstTaprootAccountAddress,
      publicKeyHex: publicKeyBuffer.toString("hex"),
    };
  };

  getAddress = async (): Promise<string> => {
    if (!this.ledgerWalletInfo?.address) throw new Error("Could not retrieve the address");

    return this.ledgerWalletInfo.address;
  };

  getPublicKeyHex = async (): Promise<string> => {
    if (!this.ledgerWalletInfo?.publicKeyHex) throw new Error("Could not retrieve the BTC public key");

    return this.ledgerWalletInfo.publicKeyHex;
  };

  signPsbt = async (psbtHex: string, options?: SignPsbtOptions): Promise<string> => {
    if (!this.ledgerWalletInfo?.address || !this.ledgerWalletInfo?.publicKeyHex) {
      throw new Error("Ledger is not connected");
    }
    if (!psbtHex) throw new Error("psbt hex is required");
    const psbtBase64 = Buffer.from(psbtHex, "hex").toString("base64");
    const transport = this.ledgerWalletInfo.app.transport;

    // Get the appropriate policy based on transaction type
    const policy = await this.getPolicyForTransaction(psbtBase64, options);

    const deviceTransaction = await signPsbt({ transport, psbt: psbtBase64, policy: policy! });
    const tx = Transaction.fromPSBT(deviceTransaction.toPSBT(), {
      allowUnknownInputs: true,
      allowUnknownOutputs: true,
    });
    tx.finalize();
    const signedPsbtHex = Buffer.from(tx.toPSBT()).toString("hex");

    return signedPsbtHex;
  };

  signPsbts = async (psbtsHexes: string[], options?: SignPsbtOptions[]): Promise<string[]> => {
    if (!this.ledgerWalletInfo?.address || !this.ledgerWalletInfo?.publicKeyHex || !this.ledgerWalletInfo?.policy) {
      throw new Error("Ledger is not connected");
    }
    if (!psbtsHexes && !Array.isArray(psbtsHexes)) throw new Error("psbts hexes are required");

    const result = [];

    // Sign each psbt with corresponding options
    for (let i = 0; i < psbtsHexes.length; i++) {
      const psbt = psbtsHexes[i];
      const optionsForPsbt = options ? options[i] : undefined;
      if (!psbt) throw new Error(`psbt hex at index ${i} is required`);
      if (typeof psbt !== "string") throw new Error(`psbt hex at index ${i} must be a string`);
      const signedPsbtHex = await this.signPsbt(psbt, optionsForPsbt);
      result.push(signedPsbtHex);
    }

    return result;
  };

  private async getPolicyForTransaction(psbtBase64: string, options?: SignPsbtOptions): Promise<WalletPolicy | void> {
    const transport = this.ledgerWalletInfo!.app.transport;
    if (!transport || !(transport instanceof Transport)) {
      throw new Error("Transport is required to determine the transaction type");
    }

    const isTestnet = this.config.network !== Network.MAINNET;

    const contract = getContractType(options);

    if (!contract || !options) {
      // If no contract is specified, try to use the default policy
      return tryParsePsbt(transport, psbtBase64, isTestnet);
    }

    const derivationPath = this.ledgerWalletInfo!.path;
    if (!derivationPath) {
      throw new Error("Derivation path is required to determine the transaction type");
    }

    switch (contract) {
      case ContractType.STAKING:
        return this.getStakingPolicy(options, derivationPath, transport, isTestnet);
      case ContractType.UNBONDING:
        return this.getUnbondingPolicy(options, derivationPath, transport, isTestnet, psbtBase64);
      case ContractType.UNBONDING_SLASHING:
        return this.getUnbondingSlashingPolicy(options, derivationPath, transport, isTestnet, psbtBase64);
      default:
        return tryParsePsbt(transport, psbtBase64, isTestnet);
    }
  }

  getStakingPolicy = (
    options: SignPsbtOptions,
    derivationPath: string,
    transport: Transport,
    isTestnet: boolean,
  ): Promise<WalletPolicy> => {
    const params = options.contracts?.[0]?.params;
    if (!params) {
      throw new Error("Staking contract parameters are required");
    }

    if (!Array.isArray(params.covenantPks)) {
      throw new Error("Covenant public keys must be an array");
    }

    const covenantPksSorted = params.covenantPks
      .map((pk) => Buffer.from(pk.toString(), "hex"))
      .sort(Buffer.compare)
      .map((pk) => pk.toString("hex"));

    const timelockBlocks = params.stakingDuration;
    if (!timelockBlocks || typeof timelockBlocks !== "number") {
      throw new Error("Staking duration must be a number");
    }

    const finalityProviders = params.finalityProviders;
    if (!Array.isArray(finalityProviders) || finalityProviders.length === 0) {
      throw new Error("Finality provider public keys must be a non-empty array");
    }

    const finalityProviderPk = finalityProviders[0];
    if (typeof finalityProviderPk !== "string") {
      throw new Error("Finality provider public key must be a string");
    }

    const covenantThreshold = params.covenantThreshold;
    if (typeof covenantThreshold !== "number") {
      throw new Error("Covenant threshold must be a number");
    }

    return stakingTxPolicy({
      policyName: "Staking transaction",
      transport,
      params: {
        finalityProviderPk,
        covenantThreshold,
        covenantPks: covenantPksSorted,
        timelockBlocks,
      },
      derivationPath,
      isTestnet,
    });
  };

  getUnbondingPolicy = (
    options: SignPsbtOptions,
    derivationPath: string,
    transport: Transport,
    isTestnet: boolean,
    psbtBase64: string,
  ): Promise<WalletPolicy> => {
    const params = options.contracts?.[1]?.params;
    if (!params) {
      throw new Error("Staking contract parameters are required");
    }

    if (!Array.isArray(params.covenantPks)) {
      throw new Error("Covenant public keys must be an array");
    }

    const covenantPksSorted = params.covenantPks
      .map((pk) => Buffer.from(pk.toString(), "hex"))
      .sort(Buffer.compare)
      .map((pk) => pk.toString("hex"));

    const timelockBlocks = params.unbondingTimeBlocks;
    if (!timelockBlocks || typeof timelockBlocks !== "number") {
      throw new Error("Staking duration must be a number");
    }

    const finalityProviders = params.finalityProviders;
    if (!Array.isArray(finalityProviders) || finalityProviders.length === 0) {
      throw new Error("Finality provider public keys must be a non-empty array");
    }

    const finalityProviderPk = finalityProviders[0];
    if (typeof finalityProviderPk !== "string") {
      throw new Error("Finality provider public key must be a string");
    }

    const covenantThreshold = params.covenantThreshold;
    if (typeof covenantThreshold !== "number") {
      throw new Error("Covenant threshold must be a number");
    }

    const leafHash = computeLeafHash(psbtBase64);
    if (!leafHash) {
      throw new Error("Could not compute leaf hash");
    }

    return unbondingPathPolicy({
      policyName: "Unbonding",
      transport,
      params: {
        finalityProviderPk,
        covenantThreshold,
        covenantPks: covenantPksSorted,
        leafHash,
        timelockBlocks,
      },
      derivationPath,
      isTestnet,
    });
  };

  getUnbondingSlashingPolicy = (
    options: SignPsbtOptions,
    derivationPath: string,
    transport: Transport,
    isTestnet: boolean,
    psbtBase64: string,
  ): Promise<WalletPolicy> => {
    const params = options.contracts?.[0]?.params;
    if (!params) {
      throw new Error("Staking contract parameters are required");
    }

    if (!Array.isArray(params.covenantPks)) {
      throw new Error("Covenant public keys must be an array");
    }

    const covenantPksSorted = params.covenantPks
      .map((pk) => Buffer.from(pk.toString(), "hex"))
      .sort(Buffer.compare)
      .map((pk) => pk.toString("hex"));

    const finalityProviders = params.finalityProviders;
    if (!Array.isArray(finalityProviders) || finalityProviders.length === 0) {
      throw new Error("Finality provider public keys must be a non-empty array");
    }

    const finalityProviderPk = finalityProviders[0];
    if (typeof finalityProviderPk !== "string") {
      throw new Error("Finality provider public key must be a string");
    }

    const covenantThreshold = params.covenantThreshold;
    if (typeof covenantThreshold !== "number") {
      throw new Error("Covenant threshold must be a number");
    }

    const leafHash = computeLeafHash(psbtBase64);
    if (!leafHash) {
      throw new Error("Could not compute leaf hash");
    }

    return slashingPathPolicy({
      policyName: "Consent to unbonding slashing",
      transport,
      params: {
        finalityProviderPk,
        covenantThreshold,
        covenantPks: covenantPksSorted,
        leafHash,
      },
      derivationPath,
      isTestnet,
    });
  };

  getNetwork = async (): Promise<Network> => {
    return this.config.network;
  };

  signMessage = async (message: string, type: "bip322-simple" | "ecdsa"): Promise<string> => {
    if (!this.ledgerWalletInfo?.app.transport || !this.ledgerWalletInfo?.path) {
      throw new Error("Ledger is not connected");
    }
    const isTestnet = this.config.network !== Network.MAINNET;

    const signedMessage = await signMessage({
      transport: this.ledgerWalletInfo?.app.transport,
      message,
      type,
      isTestnet,
      derivationPath: this.ledgerWalletInfo.path,
    });

    return signedMessage.signature;
  };

  getInscriptions = async (): Promise<InscriptionIdentifier[]> => {
    throw new Error("Method not implemented.");
  };

  // Not implemented because of the hardware wallet nature
  on = (): void => {};
  off = (): void => {};

  getWalletProviderName = async (): Promise<string> => {
    return WALLET_PROVIDER_NAME;
  };

  getWalletProviderIcon = async (): Promise<string> => {
    return logo;
  };
}
