import { useCallback, useEffect } from "react";

import { useChainProviders } from "@/context/Chain.context";
import { useInscriptionProvider } from "@/context/Inscriptions.context";
import { IChain, IWallet } from "@/core/types";
import { validateAddressWithPK } from "@/core/utils/wallet";

import { useWidgetState } from "./useWidgetState";

export function useWalletConnectors(onError?: (e: Error) => void) {
  const connectors = useChainProviders();
  const { selectWallet, removeWallet, displayLoader, displayChains, displayInscriptions, displayError } =
    useWidgetState();
  const { showAgain } = useInscriptionProvider();

  // Connecting event
  useEffect(() => {
    const connectorArr = Object.values(connectors);

    const unsubscribeArr = connectorArr.filter(Boolean).map((connector) =>
      connector.on("connecting", (message: string) => {
        displayLoader?.(message);
      }),
    );

    return () => unsubscribeArr.forEach((unsubscribe) => unsubscribe());
  }, [displayLoader, connectors]);

  // Connect Event
  useEffect(() => {
    const connectorArr = Object.values(connectors);

    const handlers: Record<string, (connector: any) => (connectedWallet: IWallet) => void> = {
      BTC: (connector) => (connectedWallet) => {
        if (connectedWallet) {
          selectWallet?.("BTC", connectedWallet);
        }

        const goToNextScreen = () => void (showAgain ? displayInscriptions?.() : displayChains?.());

        if (
          validateAddressWithPK(
            connectedWallet.account?.address ?? "",
            connectedWallet.account?.publicKeyHex ?? "",
            connector.config.network,
          )
        ) {
          goToNextScreen();
        } else {
          displayError?.({
            title: "Public Key Mismatch",
            description:
              "The Bitcoin address and Public Key for this wallet do not match. Please contact your wallet provider for support.",
            onSubmit: goToNextScreen,
            onCancel: () => {
              removeWallet?.(connector.id);
              displayChains?.();
            },
          });
        }
      },
      BBN: (connector) => (connectedWallet) => {
        if (connectedWallet) {
          selectWallet?.(connector.id, connectedWallet);
        }

        displayChains?.();
      },
    };

    const unsubscribeArr = connectorArr
      .filter(Boolean)
      .map((connector) => connector.on("connect", handlers[connector.id]?.(connector)));

    return () => unsubscribeArr.forEach((unsubscribe) => unsubscribe());
  }, [selectWallet, removeWallet, displayInscriptions, displayChains, connectors, showAgain]);

  // Disconnect Event
  useEffect(() => {
    const connectorArr = Object.values(connectors);

    const unsubscribeArr = connectorArr.filter(Boolean).map((connector) =>
      connector.on("disconnect", (connectedWallet: IWallet) => {
        if (connectedWallet) {
          removeWallet?.(connector.id);
          displayChains?.();
        }
      }),
    );

    return () => unsubscribeArr.forEach((unsubscribe) => unsubscribe());
  }, [removeWallet, displayChains, connectors]);

  // Error Event
  useEffect(() => {
    const connectorArr = Object.values(connectors);

    const unsubscribeArr = connectorArr.filter(Boolean).map((connector) =>
      connector.on("error", (error: Error) => {
        onError?.(error);
        displayChains?.();
      }),
    );

    return () => unsubscribeArr.forEach((unsubscribe) => unsubscribe());
  }, [onError, displayChains, connectors]);

  const connect = useCallback(
    async (chain: IChain, wallet: IWallet) => {
      const connector = connectors[chain.id as keyof typeof connectors];
      await connector?.connect(wallet.id);
    },
    [displayLoader, displayInscriptions, connectors, showAgain],
  );

  const disconnect = useCallback(
    async (chainId: string) => {
      const connector = connectors[chainId as keyof typeof connectors];
      await connector?.disconnect();
    },
    [displayLoader, displayChains, connectors],
  );

  return { connect, disconnect };
}
