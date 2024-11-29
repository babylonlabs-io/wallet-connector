import { type JSX, useCallback } from "react";
import { Dialog } from "@babylonlabs-io/bbn-core-ui";

import { useWidgetState } from "@/hooks/useWidgetState";
import { useChainProviders } from "@/context/Chain.context";
import { useInscriptionProvider } from "@/context/Inscriptions.context";
import type { IChain, IWallet } from "@/core/types";

import { Screen } from "./Screen";

interface WalletDialogProps {
  onError?: (e: Error) => void;
  widgets?: Record<string, JSX.Element | undefined>;
}

const ANIMATION_DELAY = 1000;

export function WalletDialog({ widgets, onError }: WalletDialogProps) {
  const {
    visible,
    screen,
    close,
    reset = () => {},
    confirm,
    selectWallet,
    displayLoader,
    displayChains,
    displayInscriptions,
  } = useWidgetState();
  const { showAgain, toggleShowAgain, toggleLockInscriptions } = useInscriptionProvider();
  const connectors = useChainProviders();

  const handleSelectWallet = useCallback(
    async (chain: IChain, wallet: IWallet) => {
      try {
        displayLoader?.(`Connecting ${wallet.name}`);

        const connector = connectors[chain.id as keyof typeof connectors];
        const connectedWallet = await connector?.connect(wallet.id);

        if (connectedWallet) {
          selectWallet?.(chain.id, connectedWallet);
        }

        if (showAgain && chain.id === "BTC") {
          displayInscriptions?.();
        } else {
          displayChains?.();
        }
      } catch (e: any) {
        onError?.(e);
        displayChains?.();
      }
    },
    [displayLoader, selectWallet, displayInscriptions, connectors, showAgain],
  );

  const handleToggleInscriptions = useCallback(
    (lockInscriptions: boolean, showAgain: boolean) => {
      toggleShowAgain?.(showAgain);
      toggleLockInscriptions?.(lockInscriptions);
      displayChains?.();
    },
    [toggleShowAgain, toggleLockInscriptions, displayChains],
  );

  const handleClose = useCallback(() => {
    close?.();
    setTimeout(reset, ANIMATION_DELAY);
  }, [close, reset]);

  const handleConfirm = useCallback(() => {
    confirm?.();
    close?.();
  }, [confirm]);

  return (
    <Dialog open={visible} onClose={handleClose}>
      <Screen
        current={screen}
        widgets={widgets}
        className="b-size-[600px]"
        onClose={handleClose}
        onConfirm={handleConfirm}
        onSelectWallet={handleSelectWallet}
        onAccepTermsOfService={displayChains}
        onToggleInscriptions={handleToggleInscriptions}
      />
    </Dialog>
  );
}
