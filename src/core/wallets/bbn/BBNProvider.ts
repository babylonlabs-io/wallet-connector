import type { SigningStargateClient, SigningStargateClientOptions } from "@cosmjs/stargate";

import { IBBNProvider } from "@/core/types";

export abstract class BBNProvider implements IBBNProvider {
  /**
   * Connects to the wallet and returns the instance of the wallet provider.
   * @returns A promise that resolves to an instance of the wrapper wallet provider.
   * @throws An error if the wallet is not installed or if connection fails.
   */
  abstract connectWallet(): Promise<void>;

  /**
   * Gets the address of the connected wallet.
   * @returns A promise that resolves to the address of the connected wallet.
   */
  abstract getAddress(): Promise<string>;

  /**
   * Gets the public key of the connected wallet.
   * @returns A promise that resolves to the public key of the connected wallet.
   */
  abstract getPublicKeyHex(): Promise<string>;

  /**
   * Gets the signing stargate client.
   * @returns A promise that resolves to the signing stargate client.
   */
  abstract getSigningStargateClient(options?: SigningStargateClientOptions): Promise<SigningStargateClient>;
  /**
   * Gets the balance of the connected wallet.
   * @param searchDenom - The denomination to search for in the wallet's balance.
   * @returns A promise that resolves to the balance of the connected wallet.
   */
  abstract getBalance(searchDenom: string): Promise<bigint>;
}
