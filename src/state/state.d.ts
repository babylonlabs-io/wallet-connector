import type { IChain, IWalllet } from "@/core/types";

type Step = "loading" | "acceptTermsOfService" | "selectChain" | "selectWallet" | "lockInscriptions";

export interface State {
  visible: boolean;
  loading: boolean;
  step: Step;
  selectedWallets: Record<string, IWalllet>;
  visibleWallets: string;
  chains: Record<string, IChain>;
  displayTermsOfService?: () => void;
  displayChains?: () => void;
  displayWallets?: (chain: string) => void;
  selectWallet?: (chain: string, wallet: IWalllet) => void;
  addChain?: (chain: IChain) => void;
  setLoading?: (value: boolean) => void;
  open?: () => void;
  close?: () => void;
}
