import { OfflineAminoSigner, OfflineDirectSigner } from "@keplr-wallet/types/src/cosmjs";
import { Buffer } from "buffer";

import { BBNConfig, IBBNProvider, WalletInfo } from "@/core/types";

import logo from "./logo.svg";

export const WALLET_PROVIDER_NAME = "Cosmostation";

export class CosmostationProvider implements IBBNProvider {
  private walletInfo: WalletInfo | undefined;
  private chainId: string | undefined;
  private rpc: string | undefined;
  private chainData: BBNConfig["chainData"];

  constructor(
    private wallet: any,
    config: BBNConfig,
  ) {
    if (!wallet || !wallet.providers.keplr) {
      throw new Error("Cosmostation extension not found");
    }
    this.chainId = config.chainId;
    this.rpc = config.rpc;
    this.chainData = config.chainData;
  }

  async connectWallet(): Promise<void> {
    if (!this.chainId) throw new Error("Chain ID is not initialized");
    if (!this.rpc) throw new Error("RPC URL is not initialized");
    if (!this.wallet.providers.keplr) throw new Error("Cosmostation extension not found");

    try {
      await this.wallet.providers.keplr.enable(this.chainId);
    } catch (error: Error | any) {
      if (error?.message.includes(this.chainId)) {
        try {
          // User has no BBN chain in their wallet
          await this.wallet.providers.keplr.experimentalSuggestChain(this.chainData);
          await this.wallet.providers.keplr.enable(this.chainId);
        } catch {
          throw new Error("Failed to add BBN chain");
        }
      } else {
        if (error?.message.includes("rejected")) {
          throw new Error("Cosmostation wallet connection request rejected");
        } else if (error?.message.includes("context invalidated")) {
          throw new Error("Cosmostation extension context invalidated");
        } else {
          throw new Error(error?.message || "Failed to connect to Cosmostation");
        }
      }
    }
    const key = await this.wallet.providers.keplr.getKey(this.chainId);

    if (!key) throw new Error("Failed to get Cosmostation key");

    const { bech32Address, pubKey } = key;

    if (bech32Address && pubKey) {
      this.walletInfo = {
        publicKeyHex: Buffer.from(key.pubKey).toString("hex"),
        address: bech32Address,
      };
    } else {
      throw new Error("Could not connect to Cosmostation");
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
    return WALLET_PROVIDER_NAME;
  }

  async getWalletProviderIcon(): Promise<string> {
    return logo;
  }

  async getOfflineSigner(): Promise<OfflineAminoSigner & OfflineDirectSigner> {
    if (!this.wallet.providers.keplr) throw new Error("Cosmostation extension not found");
    if (!this.chainId) throw new Error("Chain ID is not initialized");

    try {
      return this.wallet.providers.keplr.getOfflineSigner(this.chainId);
    } catch {
      throw new Error("Failed to get offline signer");
    }
  }
}
