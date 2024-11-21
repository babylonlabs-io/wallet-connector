import { Wallet } from "@/core/Wallet";
import type { NetworkConfig, IProvider, IChain, ChainMetadata } from "@/core/types";

export class WalletConnector<N extends string, P extends IProvider> implements IChain {
  private _connectedWallet: Wallet<P> | null = null;

  static async create<N extends string, P extends IProvider>(
    metadata: ChainMetadata<N, P>,
    context: any,
    config: NetworkConfig,
  ): Promise<WalletConnector<N, P>> {
    const wallets: Wallet<P>[] = [];

    for (const walletMetadata of metadata.wallets) {
      wallets.push(await Wallet.create(walletMetadata, context, config));
    }

    return new WalletConnector(metadata.chain, metadata.name, metadata.icon, wallets);
  }

  constructor(
    public readonly id: N,
    public readonly name: string,
    public readonly icon: string,
    public readonly wallets: Wallet<P>[],
  ) {}

  get connectedWallet() {
    return this._connectedWallet;
  }

  async connect(walletId: string) {
    const wallet = this.wallets.find((wallet) => wallet.id === walletId);

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    this._connectedWallet = await wallet.connect();

    return this.connectedWallet;
  }

  disconnect() {
    this._connectedWallet = null;
  }

  clone() {
    return new WalletConnector(this.id, this.name, this.icon, this.wallets);
  }
}
