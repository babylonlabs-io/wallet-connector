import { type PropsWithChildren, createContext, useContext, useMemo, useState } from "react";

import { Actions, type State } from "./state.d";
import { IChain, IWallet } from "@/core/types";

const defaultState: State = {
  visible: false,
  screen: { type: "TERMS_OF_SERVICE" },
  chains: {},
  selectedWallets: {},
};

const StateContext = createContext<State & Actions>(defaultState);

export function StateProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<State>(defaultState);

  // useEffect(() => {
  //   console.log(state);
  // }, [state]);

  const actions: Actions = useMemo(
    () => ({
      open: () => {
        setState(({ chains }) => ({ ...defaultState, chains, visible: true }));
      },

      close: () => {
        setState((state) => ({ ...state, visible: false }));
      },

      displayLoading: () => {
        setState((state) => ({ ...state, screen: { type: "LOADING" } }));
      },

      displayTermsOfService: () => {
        setState((state) => ({ ...state, screen: { type: "TERMS_OF_SERVICE" } }));
      },

      displayChains: () => {
        setState((state) => ({ ...state, screen: { type: "CHAINS" } }));
      },

      displayWallets: (chain: string) => {
        setState((state) => ({ ...state, screen: { type: "WALLETS", params: { chain } } }));
      },

      displayInscriptions: () => {
        setState((state) => ({ ...state, screen: { type: "INSCRIPTIONS" } }));
      },

      selectWallet: (chain: string, wallet: IWallet) => {
        setState((state) => ({
          ...state,
          selectedWallets: { ...state.selectedWallets, [chain]: wallet },
        }));
      },

      removeWallet: (chain: string) => {
        setState((state) => ({
          ...state,
          selectedWallets: { ...state.selectedWallets, [chain]: null },
        }));
      },

      addChain: (chain: IChain) => {
        setState((state) => ({ ...state, chains: { ...state.chains, [chain.id]: chain } }));
      },
    }),
    [],
  );

  const context = useMemo(
    () => ({
      ...state,
      ...actions,
    }),
    [state, actions],
  );

  return <StateContext.Provider value={context}>{children}</StateContext.Provider>;
}

export const useAppState = () => useContext(StateContext);
