import { SigningStep } from "@babylonlabs-io/btc-staking-ts";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { Transaction } from "@scure/btc-signer";
import { Buffer } from "buffer";
import AppClient, {
  computeLeafHash,
  DefaultWalletPolicy,
  signMessage,
  signPsbt,
  stakingTxPolicy,
  tryParsePsbt,
  unbondingPathPolicy,
} from "ledger-bitcoin-babylon";

import type { BTCConfig, BTCSignOptions, InscriptionIdentifier } from "@/core/types";
import { IBTCProvider, Network } from "@/core/types";
import { toNetwork } from "@/core/utils/wallet";
import { generateP2TRAddressFromXpub } from "@/utils/wallet";

import logo from "./logo.svg";

type LedgerWalletInfo = {
  app: AppClient;
  policy: DefaultWalletPolicy;
  mfp: string | undefined;
  extendedPublicKey: string | undefined;
  address: string | undefined;
  path: string | undefined;
  publicKeyHex: string | undefined;
  scriptPubKeyHex: string | undefined;
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

    const currentNetwork = await this.getNetwork();

    const firstTaprootAccountAddress = await app.getWalletAddress(
      firstTaprootAccountPolicy,
      null,
      0, // 0 - normal, 1 - change
      0, // address index
      true, // show address on the wallet's screen
    );

    // Additional information for the wallet
    const { publicKeyHex, scriptPubKeyHex } = generateP2TRAddressFromXpub(
      firstTaprootAccountPubkey,
      "M/0/0",
      toNetwork(currentNetwork),
    );

    this.ledgerWalletInfo = {
      app,
      policy: firstTaprootAccountPolicy,
      mfp: fpr,
      extendedPublicKey: firstTaprootAccountPubkey,
      path: taprootPath,
      address: firstTaprootAccountAddress,
      publicKeyHex,
      scriptPubKeyHex,
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

  private async getPolicyForTransaction(psbtBase64: string, options?: BTCSignOptions): Promise<any> {
    const transport = this.ledgerWalletInfo!.app.transport;

    // If no specific transaction type is specified, use default policy detection
    if (!options?.type) {
      return tryParsePsbt(transport, psbtBase64, true);
    }

    // Extract and validate common options for special transaction types
    const { finalityProviderPk, covenantPks, timelockBlocks, covenantThreshold } = options;

    if (!finalityProviderPk || !covenantPks || !timelockBlocks || !covenantThreshold) {
      throw new Error("Missing staking options");
    }

    // Covenant keys should be sorted for policy generation (common operation)
    const covenantPksSorted = covenantPks
      .map((pk) => Buffer.from(pk, "hex"))
      .sort(Buffer.compare)
      .map((pk) => pk.toString("hex"));

    // Common parameters for policies
    const commonParams = {
      timelockBlocks,
      finalityProviderPk,
      covenantThreshold,
      covenantPks: covenantPksSorted,
    };
    console.log("commonParams", commonParams);

    const derivationPath = this.ledgerWalletInfo!.path;
    const isTestnet = this.config.network !== Network.MAINNET;

    if (options.type === SigningStep.STAKING) {
      return stakingTxPolicy({
        policyName: "Staking transaction",
        transport,
        params: commonParams,
        derivationPath,
        isTestnet,
      });
    } else if (options.type === SigningStep.UNBONDING) {
      const leafHash = computeLeafHash(psbtBase64);
      return unbondingPathPolicy({
        policyName: "Unbonding",
        transport,
        params: {
          ...commonParams,
          leafHash,
        },
        derivationPath,
        isTestnet,
      });
    } else {
      return tryParsePsbt(transport, psbtBase64, true);
    }
  }

  signPsbt = async (psbtHex: string, options?: BTCSignOptions): Promise<string> => {
    console.log("options", options);
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

  signPsbts = async (psbtsHexes: string[], options?: BTCSignOptions): Promise<string[]> => {
    if (!this.ledgerWalletInfo?.address || !this.ledgerWalletInfo?.publicKeyHex || !this.ledgerWalletInfo?.policy) {
      throw new Error("Ledger is not connected");
    }
    if (!psbtsHexes && !Array.isArray(psbtsHexes)) throw new Error("psbts hexes are required");

    const result = [];
    for (const psbt of psbtsHexes) {
      const signedPsbtHex = await this.signPsbt(psbt, options);
      result.push(signedPsbtHex);
    }
    return result;
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
