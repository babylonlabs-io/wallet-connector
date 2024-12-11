import { Window as KeplrWindow } from "@keplr-wallet/types";
import { OfflineAminoSigner, OfflineDirectSigner } from "@keplr-wallet/types/src/cosmjs";
import { Buffer } from "buffer";

import { BBNConfig, WalletInfo } from "@/core/types";
import { BBNProvider } from "@/core/wallets/bbn/BBNProvider";

import logo from "./logo.svg";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Window extends KeplrWindow {}
}

export class KeplrProvider extends BBNProvider {
  private walletInfo: WalletInfo | undefined;
  private chainId: string | undefined;
  private rpc: string | undefined;

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

  async connectWallet(): Promise<void> {
    if (!this.chainId) throw new Error("Chain ID is not initialized");
    if (!this.rpc) throw new Error("RPC URL is not initialized");

    await this.keplr?.enable(this.chainId);
    const key = await this.keplr?.getKey(this.chainId);

    if (!key) throw new Error("Failed to get Keplr key");

    const { bech32Address, pubKey } = key;

    if (bech32Address && pubKey) {
      this.walletInfo = {
        publicKeyHex: Buffer.from(key.pubKey).toString("hex"),
        address: bech32Address,
      };
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

  async getWalletProviderName(): Promise<string> {
    return "Keplr";
  }

  async getWalletProviderIcon(): Promise<string> {
    return logo;
  }

  async getOfflineSigner(): Promise<OfflineAminoSigner & OfflineDirectSigner> {
    if (!this.keplr) throw new Error("Keplr extension not found");
    if (!this.chainId) throw new Error("Chain ID is not initialized");

    try {
      return this.keplr.getOfflineSigner(this.chainId);
    } catch {
      throw new Error("Failed to get offline signer");
    }
  }
}
