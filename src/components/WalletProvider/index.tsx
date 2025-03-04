import { type PropsWithChildren } from "react";

import { ChainConfigArr, ChainProvider } from "@/context/Chain.context";
import { type LifeCycleHooksProps, LifeCycleHooksProvider } from "@/context/LifecycleHooks.context";

import { WalletDialog } from "./components/WalletDialog";

interface WalletProviderProps {
  lifecycleHooks?: LifeCycleHooksProps;
  context?: any;
  config: Readonly<ChainConfigArr>;
  onError?: (e: Error) => void;
}

export function WalletProvider({
  lifecycleHooks,
  children,
  config,
  context = window,
  onError,
}: PropsWithChildren<WalletProviderProps>) {
  return (
    <LifeCycleHooksProvider value={lifecycleHooks}>
      <ChainProvider context={context} config={config} onError={onError}>
        {children}
        <WalletDialog config={config} onError={onError} />
      </ChainProvider>
    </LifeCycleHooksProvider>
  );
}
