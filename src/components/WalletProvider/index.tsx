import { type PropsWithChildren } from "react";

import { ChainConfigArr, ChainProvider } from "@/context/Chain.context";

import { WalletDialog } from "./components/WalletDialog";

interface WalletProviderProps {
  context?: any;
  config: Readonly<ChainConfigArr>;
  onError?: (e: Error) => void;
}

export function WalletProvider({
  children,
  config,
  context = window,
  onError,
}: PropsWithChildren<WalletProviderProps>) {
  return (
    <ChainProvider context={context} config={config} onError={onError}>
      {children}
      <WalletDialog config={config} onError={onError} />
    </ChainProvider>
  );
}
