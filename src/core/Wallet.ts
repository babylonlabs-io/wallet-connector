import { IWallet, Network, IProvider, type NetworkConfig, type WalletMetadata, Account } from "@/core/types";

interface Options<P extends IProvider> {
  id: string;
  name: string;
  icon: string;
  docs: string;
  networks: Network[];
  origin: any;
  provider: P | null;
}

const defaultWalletGetter = (key: string) => (context: any) => context[key];

export class Wallet<P extends IProvider> implements IWallet {
  readonly id: string;
  readonly origin: any;
  readonly name: string;
  readonly icon: string;
  readonly docs: string;
  readonly networkds: Network[];
  readonly provider: P | null = null;
  account: Account | null = null;

  static create = async <P extends IProvider>(metadata: WalletMetadata<P>, context: any, config: NetworkConfig) => {
    const {
      id,
      wallet: walletGetter,
      name: nameGetter,
      icon: iconGetter,
      docs = "",
      networks = [],
      createProvider,
    } = metadata;

    const options: Options<P> = {
      id,
      name: "",
      icon: "",
      origin: null,
      provider: null,
      docs,
      networks,
    };

    if (walletGetter) {
      const getWallet = typeof walletGetter === "string" ? defaultWalletGetter(walletGetter) : walletGetter;

      options.origin = getWallet(context, config) ?? null;
      options.provider = options.origin ? createProvider(options.origin, config) : null;
    } else {
      options.origin = null;
      options.provider = createProvider(null, config);
    }

    if (typeof nameGetter === "string") {
      options.name = nameGetter ?? "";
    } else {
      options.name = options.origin ? await nameGetter(options.origin, config) : "";
    }

    if (typeof iconGetter === "string") {
      options.icon = iconGetter ?? "";
    } else {
      options.icon = options.origin ? await iconGetter(options.origin, config) : "";
    }

    return new Wallet(options);
  };

  constructor({ id, origin, name, icon, docs, networks, provider }: Options<P>) {
    this.id = id;
    this.origin = origin;
    this.name = name;
    this.icon = icon;
    this.docs = docs;
    this.networkds = networks;
    this.provider = provider;
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
      networks: this.networkds,
      provider: this.provider,
    });
  }
}
