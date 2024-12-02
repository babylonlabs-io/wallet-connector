import "./index.css";

export { WalletProvider } from "@/components/WalletProvider";
export { WalletButton } from "@/components/WalletButton";

export { useChainConnector } from "@/hooks/useChainConnector";
export { useWidgetState } from "@/hooks/useWidgetState";
export { useWalletConnect } from "@/hooks/useWalletConnect";

export { useInscriptionProvider } from "@/context/Inscriptions.context";
export * from "@/context/State.context";
export { type ChainConfigArr } from "@/context/Chain.context";

export * from "@/core/wallets/btc/BTCProvider";
export * from "@/core/wallets/bbn/BBNProvider";
export * from "@/core/types";
export { createExternalWallet } from "@/core";
