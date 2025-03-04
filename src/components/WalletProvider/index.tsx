import { type PropsWithChildren } from "react";

import { ChainConfigArr, ChainProvider } from "@/context/Chain.context";
import { type LifeCycleHooksProps, LifeCycleHooksProvider } from "@/context/LifecycleHooks.context";
import { createAccountStorage } from "@/core/storage";

import { WalletDialog } from "./components/WalletDialog";
import { ONE_HOUR } from "./constants";

const storage = createAccountStorage(ONE_HOUR);

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
      <ChainProvider storage={storage} context={context} config={config} onError={onError}>
        {children}
        <WalletDialog storage={storage} config={config} onError={onError} />
      </ChainProvider>
    </LifeCycleHooksProvider>
  );
}
