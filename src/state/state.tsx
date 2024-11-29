import { type PropsWithChildren, createContext, useMemo, useState } from "react";

import { IChain, IWallet } from "@/core/types";
import { Actions, type State } from "./types";

const defaultState: State = {
  confirmed: false,
  visible: false,
  screen: { type: "TERMS_OF_SERVICE" },
  chains: {},
  selectedWallets: {},
};

export const StateContext = createContext<State & Actions>(defaultState);

export function StateProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<State>(defaultState);

  const actions: Actions = useMemo(
    () => ({
      open: () => {
        setState((state) => ({ ...state, visible: true }));
      },

      close: () => {
        setState((state) => ({ ...state, visible: false }));
      },

      reset: () => {
        setState(({ chains }) => ({ ...defaultState, chains }));
      },

      displayLoader: (message = "") => {
        setState((state) => ({ ...state, screen: { type: "LOADER", params: { message } } }));
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
          selectedWallets: { ...state.selectedWallets, [chain]: undefined },
        }));
      },

      addChain: (chain: IChain) => {
        setState((state) => ({ ...state, chains: { ...state.chains, [chain.id]: chain } }));
      },

      confirm: () => {
        setState((state) => ({ ...state, confirmed: true }));
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
