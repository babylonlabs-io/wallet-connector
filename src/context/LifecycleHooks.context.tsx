import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";

export interface LifeCycleHooksProps {
  verifyBTCAddress?: (address: string) => Promise<boolean>;
  acceptTermsOfService?: (address: string, publicKeyHex: string) => Promise<void>;
}

interface LifeCycleHooksContextProps extends LifeCycleHooksProps {
  hasAcceptedTerms: boolean;
  acceptTerms: () => void;
  clearTerms: () => void;
}

const Context = createContext<LifeCycleHooksContextProps>({
  hasAcceptedTerms: false,
  acceptTerms: () => {},
  clearTerms: () => {},
});

export function LifeCycleHooksProvider({ children, value }: PropsWithChildren<{ value?: LifeCycleHooksProps }>) {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(false);

  const context = useMemo(() => {
    const acceptTerms = (): void => {
      setHasAcceptedTerms(true);
    };

    const clearTerms = (): void => {
      setHasAcceptedTerms(false);
    };

    return {
      ...value,
      hasAcceptedTerms,
      acceptTerms,
      clearTerms,
    };
  }, [value, hasAcceptedTerms]);

  return <Context.Provider value={context}>{children}</Context.Provider>;
}

export const useLifeCycleHooks = () => useContext(Context);
