import type { IChain, IWallet } from "@/core/types";

export type Screen<T extends string = string> = {
  type: T;
  params?: Record<string, string | number>;
};

export type Screens =
  | Screen<"LOADER">
  | Screen<"TERMS_OF_SERVICE">
  | Screen<"CHAINS">
  | Screen<"WALLETS">
  | Screen<"INSCRIPTIONS">;

export interface State {
  confirmed: boolean;
  visible: boolean;
  screen: Screens;
  selectedWallets: Record<string, IWallet | undefined>;
  chains: Record<string, IChain>;
}

export interface Actions {
  open?: () => void;
  close?: () => void;
  displayLoader?: (message?: string) => void;
  displayChains?: () => void;
  displayWallets?: (chain: string) => void;
  displayInscriptions?: () => void;
  displayTermsOfService?: () => void;
  selectWallet?: (chain: string, wallet: IWallet) => void;
  removeWallet?: (chain: string) => void;
  addChain?: (chain: IChain) => void;
  confirm?: () => void;
  reset?: () => void;
}
