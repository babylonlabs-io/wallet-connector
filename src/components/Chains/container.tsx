import { useCallback, useMemo } from "react";

import { useWidgetState } from "@/hooks/useWidgetState";
import { Chains } from "./index";

import type { IChain } from "@/core/types";
import { useWalletConnect } from "@/hooks/useWalletConnect";

interface ContainerProps {
  className?: string;
  onClose?: () => void;
}

export default function ChainsContainer(props: ContainerProps) {
  const { chains, selectedWallets, displayWallets } = useWidgetState();
  const { connected } = useWalletConnect();

  const chainArr = useMemo(() => Object.values(chains), [chains]);

  const handleSelectChain = useCallback(
    (chain: IChain) => {
      displayWallets?.(chain.id);
    },
    [displayWallets],
  );

  return (
    <Chains
      disabled={!connected}
      chains={chainArr}
      selectedWallets={selectedWallets}
      onSelectChain={handleSelectChain}
      {...props}
    />
  );
}
