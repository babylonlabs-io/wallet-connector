import { Window as KeplrWindow } from "@keplr-wallet/types";
import { Buffer } from "buffer";

import { BBNConfig, WalletInfo } from "@/core/types";
import { BBNProvider } from "@/core/wallets/bbn/BBNProvider";

import { OfflineAminoSigner, OfflineDirectSigner } from "@keplr-wallet/types/src/cosmjs";
import { SigningStargateClient, SigningStargateClientOptions } from "@cosmjs/stargate";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Window extends KeplrWindow {}
}

export class KeplrProvider extends BBNProvider {
  private walletInfo: WalletInfo | undefined;
  private chainId: string | undefined;
  private rpc: string | undefined;
  private offlineSigner?: OfflineAminoSigner & OfflineDirectSigner;
  private stargateClient?: Promise<SigningStargateClient>;

  constructor(
    private keplr: Window["keplr"],
    config: BBNConfig,
  ) {
    super();
    if (!keplr) {
      throw new Error("Keplr extension not found");
    }
    this.chainId = config.chainId;
    this.rpc = config.rpc;
  }

  async connectWallet(): Promise<this> {
    if (!this.chainId) throw new Error("Chain ID is not initialized");
    if (!this.rpc) throw new Error("RPC URL is not initialized");

    await this.keplr?.enable(this.chainId);
    const key = await this.keplr?.getKey(this.chainId);

    if (!key) throw new Error("Failed to get Keplr key");

    this.offlineSigner = this.keplr?.getOfflineSigner(this.chainId);

    const { bech32Address, pubKey } = key;

    if (bech32Address && pubKey) {
      this.walletInfo = {
        publicKeyHex: Buffer.from(key.pubKey).toString("hex"),
        address: bech32Address,
      };
      return this;
    } else {
      throw new Error("Could not connect to Keplr");
    }
  }

  async getAddress(): Promise<string> {
    if (!this.walletInfo) throw new Error("Wallet not connected");
    return this.walletInfo.address;
  }

  async getPublicKeyHex(): Promise<string> {
    if (!this.walletInfo) throw new Error("Wallet not connected");
    return this.walletInfo.publicKeyHex;
  }

  async getSigningStargateClient(options?: SigningStargateClientOptions) {
    if (!this.stargateClient) {
      this.stargateClient = this.createSigningStargateClient(options);
    }
    return await this.stargateClient;
  }

  async createSigningStargateClient(options?: SigningStargateClientOptions) {
    if (!this.rpc) throw new Error("RPC URL is not initialized");
    if (!this.offlineSigner) throw new Error("Offline signer is not initialized");
    return await SigningStargateClient.connectWithSigner(this.rpc, this.offlineSigner, options);
  }

  async getBalance(searchDenom: string) {
    const signingStargateClient = await this.getSigningStargateClient();
    return BigInt((await signingStargateClient.getBalance(await this.getAddress(), searchDenom)).amount);
  }
}
