import { createContext, PropsWithChildren, useContext, useMemo } from "react";

export interface LifeCycleHooksProps {
  verifyBTCAddress?: (address: string) => Promise<boolean>;
  acceptTermsOfService?: () => Promise<void>;
}

const Context = createContext<LifeCycleHooksProps>({});

export function LifeCycleHooksProvider({ children, value }: PropsWithChildren<{ value?: LifeCycleHooksProps }>) {
  const context = useMemo(() => {
    return value ?? {};
  }, [value]);

  return <Context.Provider value={context}>{children}</Context.Provider>;
}

export const useLifeCycleHooks = () => useContext(Context);
