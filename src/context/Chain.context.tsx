import { createContext, PropsWithChildren, useEffect, useState, useCallback, useContext } from "react";
import { useAppState } from "@/state/state";
import { WalletConnector } from "@/core/WalletConnector";
import type { NetworkConfig } from "@/core/types";

import metadata from "@/core/wallets";
import { BTCProvider } from "@/core/wallets/btc/BTCProvider";
import { BBNProvider } from "@/core/wallets/bbn/BBNProvider";

interface ProviderProps {
  context: any;
  config: NetworkConfig;
}

export interface Connectors {
  BTC: WalletConnector<"BTC", BTCProvider> | null;
  BBN: WalletConnector<"BBN", BBNProvider> | null;
}

export type SupportedChains = keyof Connectors;

const defaultState: Connectors = {
  BTC: null,
  BBN: null,
};

const Context = createContext<Connectors>(defaultState);

export function ChainProvider({ children, context, config }: PropsWithChildren<ProviderProps>) {
  const [connectors, setConnectors] = useState(defaultState);
  const { addChain, displayLoading, displayTermsOfService } = useAppState();

  const init = useCallback(async () => {
    displayLoading?.();

    const metadataArr = Object.values(metadata);
    const connectorArr = await Promise.all(metadataArr.map((data) => WalletConnector.create(data, context, config)));

    return connectorArr.reduce((acc, connector) => ({ ...acc, [connector.id]: connector }), {} as Connectors);
  }, []);

  useEffect(() => {
    if (!displayLoading || !addChain || !setConnectors || !displayTermsOfService) return;

    displayLoading();

    init().then((connectors) => {
      setConnectors(connectors);

      Object.values(connectors).forEach((connector) => {
        addChain(connector);
      });

      displayTermsOfService();
    });
  }, [displayLoading, addChain, setConnectors, init, displayTermsOfService]);

  return <Context.Provider value={connectors}>{children}</Context.Provider>;
}

export const useChainProviders = () => {
  return useContext(Context);
};
