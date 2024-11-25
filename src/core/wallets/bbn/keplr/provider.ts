import { Window as KeplrWindow } from "@keplr-wallet/types";
import { Buffer } from "buffer";

import { WalletInfo } from "@/core/types";
import { BBNProvider } from "@/core/wallets/bbn/BBNProvider";

import { OfflineAminoSigner, OfflineDirectSigner } from "@keplr-wallet/types/src/cosmjs";
import { SigningStargateClient, SigningStargateClientOptions } from "@cosmjs/stargate";

const DEFAULT_RPC = "https://cosmoshub.validator.network:443";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Window extends KeplrWindow {}
}

export class KeplrProvider extends BBNProvider {
  private walletInfo: WalletInfo | undefined;
  private chainId = "devnet-6";
  private offlineSigner?: OfflineAminoSigner & OfflineDirectSigner;
  private stargateClient?: Promise<SigningStargateClient>;

  constructor(private keplr: Window["keplr"]) {
    super();
    if (!keplr) {
      throw new Error("Keplr extension not found");
    }
  }

  async connectWallet(): Promise<this> {
    await this.keplr?.enable(this.chainId);
    const key = await this.keplr?.getKey(this.chainId);

    if (!key) {
      throw new Error("Failed to get Keplr key");
    }

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
    const rpcUrl = DEFAULT_RPC;
    if (!this.offlineSigner) {
      throw new Error("Offline signer is not initialized");
    }
    return await SigningStargateClient.connectWithSigner(rpcUrl, this.offlineSigner, options);
  }

  async getBalance(searchDenom: string) {
    const signingStargateClient = await this.getSigningStargateClient();
    return BigInt((await signingStargateClient.getBalance(await this.getAddress(), searchDenom)).amount);
  }
}
