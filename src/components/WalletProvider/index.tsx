import { type PropsWithChildren } from "react";

import { ChainConfigArr, ChainProvider } from "@/context/Chain.context";
import { type LifeCycleHooksProps, LifeCycleHooksProvider } from "@/context/LifecycleHooks.context";
import { TomoConnectionProvider } from "@/context/TomoProvider";
import { createAccountStorage } from "@/core/storage";
import { TomoBBNConnector } from "@/widgets/tomo/BBNConnector";
import { TomoBTCConnector } from "@/widgets/tomo/BTCConnector";

import { WalletDialog } from "./components/WalletDialog";
import { ONE_HOUR } from "./constants";

const storage = createAccountStorage(ONE_HOUR);
interface WalletProviderProps {
  persistent?: boolean;
  theme?: string;
  lifecycleHooks?: LifeCycleHooksProps;
  context?: any;
  config: Readonly<ChainConfigArr>;
  onError?: (e: Error) => void;
}

export function WalletProvider({
  persistent = false,
  theme,
  lifecycleHooks,
  children,
  config,
  context = window,
  onError,
}: PropsWithChildren<WalletProviderProps>) {
  return (
    <TomoConnectionProvider theme={theme} config={config}>
      <LifeCycleHooksProvider value={lifecycleHooks}>
        <ChainProvider persistent={persistent} storage={storage} context={context} config={config} onError={onError}>
          {children}
          <TomoBTCConnector storage={storage} />
          <TomoBBNConnector storage={storage} />
          <WalletDialog persistent={persistent} storage={storage} config={config} onError={onError} />
        </ChainProvider>
      </LifeCycleHooksProvider>
    </TomoConnectionProvider>
  );
}
