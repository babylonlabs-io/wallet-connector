import { useCallback, useMemo } from "react";
import { useWidgetState } from "./useWidgetState";

export function useWalletConnect() {
  const { confirmed, chains: chainMap, selectedWallets, open: openModal, close, reset } = useWidgetState();

  const open = useCallback(() => {
    reset?.();
    openModal?.();
  }, [openModal, reset]);

  const disconnect = useCallback(() => {
    reset?.();
  }, [close]);

  const selected = useMemo(() => {
    const chains = Object.values(chainMap).filter(Boolean);
    const result = chains.map((chain) => selectedWallets[chain.id]);

    return result.every(Boolean);
  }, [chainMap, selectedWallets]);

  return {
    selected,
    connected: selected && confirmed,
    open,
    disconnect,
  };
}
