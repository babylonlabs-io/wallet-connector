import type { IChain, IWalllet } from "@/core/types";

type Screen<T extends string = string> = {
  type: T;
  params?: Record<string, string | number>;
};

type Screens =
  | Screen<"LOADING">
  | Screen<"TERMS_OF_SERVICE">
  | Screen<"CHAINS">
  | Screen<"WALLETS">
  | Screen<"INSCRIPTIONS">;

export interface State {
  visible: boolean;
  screen: Screens;
  selectedWallets: Record<string, IWalllet>;
  chains: Record<string, IChain>;
}

export interface Actions {
  open?: () => void;
  close?: () => void;
  displayLoading?: () => void;
  displayChains?: () => void;
  displayWallets?: (chain: string) => void;
  displayInscriptions?: () => void;
  displayTermsOfService?: () => void;
  selectWallet?: (chain: string, wallet: IWalllet) => void;
  removeWallet?: (chain: string) => void;
  addChain?: (chain: IChain) => void;
}
