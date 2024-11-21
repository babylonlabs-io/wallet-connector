import { createContext, PropsWithChildren, useEffect, useState, useCallback, useContext } from "react";

import { useAppState } from "@/state/state";

import { createWalletConnector } from "@/core";
import metadata from "@/core/wallets";
import { WalletConnector } from "@/core/WalletConnector";
import { BTCProvider } from "@/core/wallets/btc/BTCProvider";
import { BBNProvider } from "@/core/wallets/bbn/BBNProvider";
import type { NetworkConfig } from "@/core/types";

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
  const { addChain, displayLoader, displayTermsOfService } = useAppState();

  const init = useCallback(async () => {
    displayLoader?.();

    const metadataArr = Object.values(metadata);
    const connectorArr = await Promise.all(metadataArr.map((data) => createWalletConnector(data, context, config)));

    return connectorArr.reduce((acc, connector) => ({ ...acc, [connector.id]: connector }), {} as Connectors);
  }, []);

  useEffect(() => {
    if (!displayLoader || !addChain || !setConnectors || !displayTermsOfService) return;

    displayLoader();

    init().then((connectors) => {
      setConnectors(connectors);

      Object.values(connectors).forEach((connector) => {
        addChain(connector);
      });

      displayTermsOfService();
    });
  }, [displayLoader, addChain, setConnectors, init, displayTermsOfService]);

  return <Context.Provider value={connectors}>{children}</Context.Provider>;
}

export const useChainProviders = () => {
  return useContext(Context);
};
