import { useCallback } from "react";
import { Dialog } from "@babylonlabs-io/bbn-core-ui";

import { useWidgetState } from "@/hooks/useWidgetState";
import { useChainProviders } from "@/context/Chain.context";
import { useInscriptionProvider } from "@/context/Inscriptions.context";
import type { IChain, IWallet } from "@/core/types";

import { Screen } from "./Screen";

interface WalletDialogProps {
  onError?: (e: Error) => void;
}

export function WalletDialog({ onError }: WalletDialogProps) {
  const { visible, screen, close, selectWallet, displayLoader, displayChains, displayInscriptions } = useWidgetState();
  const { showAgain, toggleShowAgain, toggleLockInscriptions } = useInscriptionProvider();
  const connectors = useChainProviders();

  const handleSelectWallet = useCallback(
    async (chain: IChain, wallet: IWallet) => {
      try {
        displayLoader?.();

        const connector = connectors[chain.id as keyof typeof connectors];
        const connectedWallet = await connector?.connect(wallet.id);

        if (connectedWallet) {
          selectWallet?.(chain.id, connectedWallet);
        }

        if (showAgain) {
          displayInscriptions?.();
        } else {
          displayChains?.();
        }
      } catch (e: any) {
        onError?.(e);
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

  return (
    <Dialog open={visible}>
      <Screen
        current={screen}
        className="b-size-[600px]"
        onClose={close}
        onSelectWallet={handleSelectWallet}
        onAccepTermsOfService={displayChains}
        onToggleInscriptions={handleToggleInscriptions}
      />
    </Dialog>
  );
}
