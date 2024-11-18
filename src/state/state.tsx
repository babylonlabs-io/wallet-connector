import { type PropsWithChildren, createContext, useCallback, useMemo, useState } from "react";

import { type State } from "./state.d";
import { IChain, IWallet } from "@/core/types";

const defaultState: State = {
  visible: true,
  loading: true,
  step: "selectChain",
  chains: {},
  selectedWallets: {},
  visibleWallets: "",
};

const StateContext = createContext<State>(defaultState);

export function StateProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<State>(defaultState);

  const open = useCallback(() => {
    setState((state) => ({ ...state, visible: true }));
  }, []);

  const close = useCallback(() => {
    setState((state) => ({ ...state, visible: false }));
  }, []);

  const displayTermsOfService = useCallback(() => {
    setState((state) => ({ ...state, step: "acceptTermsOfService" }));
  }, []);

  const displayChains = useCallback(() => {
    setState((state) => ({ ...state, step: "selectChain", visibleWallets: "" }));
  }, []);

  const displayWallets = useCallback((chain: string) => {
    setState((state) => ({ ...state, step: "selectWallet", visibleWallets: chain }));
  }, []);

  const selectWallet = useCallback((chain: string, wallet: IWallet) => {
    setState((state) => ({
      ...state,
      step: "lockInscriptions",
      visibleWallets: "",
      selectedWallets: { ...state.selectedWallets, [chain]: wallet },
    }));
  }, []);

  const addChain = useCallback((chainInfo: IChain) => {
    setState((state) => ({ ...state, chains: { ...state.chains, [chainInfo.chain]: chainInfo } }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState((state) => ({ ...state, loading }));
  }, []);

  const context = useMemo(
    () => ({
      ...state,
      displayTermsOfService,
      displayChains,
      displayWallets,
      selectWallet,
      addChain,
      setLoading,
      open,
      close,
    }),
    [state],
  );

  return <StateContext.Provider value={context}>{children}</StateContext.Provider>;
}
