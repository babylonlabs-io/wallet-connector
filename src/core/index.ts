import { type WalletOptions, Wallet } from "./Wallet";
import { WalletConnector } from "./WalletConnector";
import { ChainMetadata, ExternalWalletProps, IProvider, Network, WalletMetadata } from "./types";

const defaultWalletGetter = (key: string) => (context: any) => context[key];

export const createWallet = async <P extends IProvider, C>(metadata: WalletMetadata<P, C>, context: any, config: C) => {
  const {
    id,
    wallet: walletGetter,
    name: nameGetter,
    icon: iconGetter,
    docs = "",
    networks = [],
    createProvider,
    label,
  } = metadata;

  const options: WalletOptions<P> = {
    id,
    name: "",
    icon: "",
    origin: null,
    provider: null,
    docs,
    networks,
    label,
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

export const createExternalWallet = <P extends IProvider>({ id, name, icon, provider }: ExternalWalletProps<P>) =>
  new Wallet({
    id,
    origin: null,
    name,
    icon,
    docs: "",
    networks: [Network.MAINNET, Network.SIGNET],
    provider,
  });

export const createWalletConnector = async <N extends string, P extends IProvider, C>(
  metadata: ChainMetadata<N, P, C>,
  context: any,
  config: C,
): Promise<WalletConnector<N, P, C>> => {
  const wallets: Wallet<P>[] = [];

  for (const walletMetadata of metadata.wallets) {
    wallets.push(await createWallet(walletMetadata, context, config));
  }

  return new WalletConnector(metadata.chain, metadata.name, metadata.icon, wallets, config);
};
