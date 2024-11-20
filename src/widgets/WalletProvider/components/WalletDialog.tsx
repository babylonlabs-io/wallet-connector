import { useCallback } from "react";

import { Dialog } from "@/index";
import { useAppState } from "@/state/state";
import { useChainProviders } from "@/context/Chain.context";
import { useInscriptionProvider } from "@/context/Inscriptions.context";
import type { IChain, IWallet } from "@/core/types";

import { Screen } from "./Screen";

export function WalletDialog() {
  const { visible, screen, close, selectWallet, displayLoading, displayChains, displayInscriptions } = useAppState();
  const { showAgain, toggleShowAgain, toggleLockInscriptions } = useInscriptionProvider();
  const connectors = useChainProviders();

  const handleSelectWallet = useCallback(
    async (chain: IChain, wallet: IWallet) => {
      displayLoading?.();

      const connector = connectors[chain.id];
      const connectedWallet = await connector?.connect(wallet.id);

      if (connectedWallet) {
        selectWallet?.(chain.id, connectedWallet);
      }

      if (showAgain) {
        displayInscriptions?.();
      } else {
        displayChains?.();
      }
    },
    [displayLoading, selectWallet, displayInscriptions, connectors, showAgain],
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
        className="size-[600px]"
        onClose={close}
        onSelectWallet={handleSelectWallet}
        onAccepTermsOfService={displayChains}
        onToggleInscriptions={handleToggleInscriptions}
      />
    </Dialog>
  );
}
