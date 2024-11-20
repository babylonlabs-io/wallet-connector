import { IProvider } from "@/core/types";

export abstract class BBNProvider implements IProvider {
  async connectWallet() {
    return this;
  }

  abstract getAddress(): Promise<string>;

  abstract getPublicKeyHex(): Promise<string>;
}
