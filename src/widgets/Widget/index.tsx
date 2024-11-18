import { Network } from "@/core/types";
import { WalletConnector } from "@/core/WalletConnector";
import btc from "@/core/wallets/btc";
import { useEffect } from "react";

export function Widget() {
  useEffect(() => {
    WalletConnector.create(
      btc,
      {
        coinName: "Signet BTC",
        coinSymbol: "sBTC",
        networkName: "BTC signet",
        mempoolApiUrl: "https://mempool.space/signet",
        network: Network.SIGNET,
      },
      window.parent,
    )
      .then((connector) => {
        return connector.connect("okx");
      })
      .then(console.log);
  }, []);
  return <button>Button</button>;
}
