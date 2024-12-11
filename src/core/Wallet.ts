import type { Account, IProvider, IWallet, Network } from "@/core/types";

export interface WalletOptions<P extends IProvider> {
  id: string;
  name: string;
  icon: string;
  docs: string;
  networks: Network[];
  origin: any;
  provider: P | null;
  hardware?: boolean;
}

export class Wallet<P extends IProvider> implements IWallet {
  readonly id: string;
  readonly origin: any;
  readonly name: string;
  readonly icon: string;
  readonly docs: string;
  readonly networks: Network[];
  readonly provider: P | null = null;
  readonly hardware?: boolean;
  account: Account | null = null;

  constructor({ id, origin, name, icon, docs, networks, provider, hardware }: WalletOptions<P>) {
    this.id = id;
    this.origin = origin;
    this.name = name;
    this.icon = icon;
    this.docs = docs;
    this.networks = networks;
    this.provider = provider;
    this.hardware = hardware;
  }

  get installed() {
    return Boolean(this.provider);
  }

  async connect() {
    if (!this.provider) {
      throw Error("Provider not found");
    }

    await this.provider.connectWallet();
    const [address, publicKeyHex] = await Promise.all([this.provider.getAddress(), this.provider.getPublicKeyHex()]);

    this.account = { address, publicKeyHex };

    return this;
  }

  clone() {
    return new Wallet({
      id: this.id,
      origin: this.origin,
      name: this.name,
      icon: this.icon,
      docs: this.docs,
      networks: this.networks,
      provider: this.provider,
    });
  }
}
