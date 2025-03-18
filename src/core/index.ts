import { type WalletOptions, Wallet } from "./Wallet";
import { WalletConnector } from "./WalletConnector";
import { ExternalWalletProps, IProvider, Network, WalletConnectorProps, WalletProps } from "./types";

const defaultWalletGetter = (key: string) => (context: any) => context[key];

export const createWallet = async <P extends IProvider, C>({ metadata, context, config }: WalletProps<P, C>) => {
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

export const createWalletConnector = async <N extends string, P extends IProvider, C>({
  persistent,
  metadata,
  context,
  config,
  accountStorage,
}: WalletConnectorProps<N, P, C>): Promise<WalletConnector<N, P, C>> => {
  let injectableWallet: Wallet<P> | null = null;
  const wallets: Wallet<P>[] = [];
  const connectedWalletId = persistent ? accountStorage.get(metadata.chain) : undefined;
  const injectableMetadata = metadata.wallets.find((metadata) => metadata.id === "injectable");

  if (injectableMetadata) {
    injectableWallet = await createWallet({
      metadata: injectableMetadata,
      context,
      config,
    });

    wallets.push(injectableWallet);
  }

  for (const walletMetadata of metadata.wallets) {
    const wallet = await createWallet({
      metadata: walletMetadata,
      context,
      config,
    });

    if (wallet.name.toLowerCase() === injectableWallet?.name.toLowerCase()) {
      continue;
    }

    wallets.push(wallet);
  }

  const connector = new WalletConnector(metadata.chain, metadata.name, metadata.icon, wallets, config);

  if (connectedWalletId && wallets.some((wallet) => wallet.id === connectedWalletId)) {
    await connector.connect(connectedWalletId);
  }

  return connector;
};
