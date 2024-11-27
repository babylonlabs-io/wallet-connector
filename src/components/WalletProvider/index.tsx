import { type PropsWithChildren, JSX } from "react";

import { StateProvider } from "@/state/state";
import { ChainConfigArr, ChainProvider } from "@/context/Chain.context";
import { InscriptionProvider } from "@/context/Inscriptions.context";

import { WalletDialog } from "./components/WalletDialog";

interface WalletProviderProps {
  context?: any;
  config: Readonly<ChainConfigArr>;
  walletWidgets?: Record<string, JSX.Element | undefined>;
  onError?: (e: Error) => void;
}

export function WalletProvider({
  children,
  config,
  context = window,
  walletWidgets,
  onError,
}: PropsWithChildren<WalletProviderProps>) {
  return (
    <StateProvider>
      <ChainProvider context={context} config={config} onError={onError}>
        <InscriptionProvider context={context}>
          {children}
          <WalletDialog widgets={walletWidgets} onError={onError} />
        </InscriptionProvider>
      </ChainProvider>
    </StateProvider>
  );
}
