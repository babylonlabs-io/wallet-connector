import { createContext, PropsWithChildren, useEffect, useState, useCallback, useContext, useMemo } from "react";

import { createWalletConnector } from "@/core";
import metadata from "@/core/wallets";
import { WalletConnector } from "@/core/WalletConnector";
import type { BBNConfig, IProvider, BTCConfig, ExternalConnector, IBTCProvider, IBBNProvider } from "@/core/types";

import { StateProvider } from "./State.context";
import { InscriptionProvider } from "./Inscriptions.context";

interface ChainConfig<K extends string = string, P extends IProvider = IProvider, C = any> {
  chain: K;
  name?: string;
  icon?: string;
  config: C;
  connectors?: ExternalConnector<P>[];
}

export type ChainConfigArr = (
  | ChainConfig<"BTC", IBTCProvider, BTCConfig>
  | ChainConfig<"BBN", IBBNProvider, BBNConfig>
)[];

interface ProviderProps {
  context: any;
  config: Readonly<ChainConfigArr>;
  onError?: (e: Error) => void;
}

export interface Connectors {
  BTC: WalletConnector<"BTC", IBTCProvider> | null;
  BBN: WalletConnector<"BBN", IBBNProvider> | null;
}

const defaultState: Connectors = {
  BTC: null,
  BBN: null,
};

export const Context = createContext<Connectors>(defaultState);

export function ChainProvider({ children, context, config, onError }: PropsWithChildren<ProviderProps>) {
  const [connectors, setConnectors] = useState(defaultState);

  const init = useCallback(async () => {
    const connectorPromises = config
      .filter((c) => metadata[c.chain])
      .map(({ chain, config }) => createWalletConnector<string, IProvider, any>(metadata[chain], context, config));
    const connectorArr = await Promise.all(connectorPromises);

    return connectorArr.reduce((acc, connector) => ({ ...acc, [connector.id]: connector }), {} as Connectors);
  }, []);

  useEffect(() => {
    init()
      .then((connectors) => {
        setConnectors(connectors);
      })
      .catch(onError);
  }, [setConnectors, init, onError]);

  const supportedChains = useMemo(() => Object.values(connectors).filter(Boolean), [connectors]);

  return (
    <InscriptionProvider context={context}>
      <StateProvider chains={supportedChains}>
        <Context.Provider value={connectors}>{children}</Context.Provider>
      </StateProvider>
    </InscriptionProvider>
  );
}

export const useChainProviders = () => {
  return useContext(Context);
};
