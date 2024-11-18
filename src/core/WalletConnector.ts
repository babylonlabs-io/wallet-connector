import { Wallet } from "@/core/Wallet";
import type { NetworkConfig, IProvider, IChain, ConnectMetadata } from "@/core/types";

export class WalletConnector<P extends IProvider> implements IChain {
  connectedWallet: Wallet<P> | null = null;

  static async create<P extends IProvider>(
    metadata: ConnectMetadata<P>,
    config: NetworkConfig,
    context: any,
  ): Promise<WalletConnector<P>> {
    const wallets: Wallet<P>[] = [];

    for (const walletMetadata of metadata.wallets) {
      wallets.push(await Wallet.create(walletMetadata, context, config));
    }

    return new WalletConnector(metadata.chain, metadata.icon, wallets);
  }

  constructor(
    public readonly chain: string,
    public readonly icon: string,
    public readonly wallets: Wallet<P>[],
  ) {}

  async connect(name: string) {
    const wallet = this.wallets.find((wallet) => wallet.name.toLowerCase() === name.toLowerCase());

    this.connectedWallet = (await wallet?.connect()) ?? null;

    return this.connectedWallet;
  }
}
