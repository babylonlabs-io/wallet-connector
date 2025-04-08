import { ExternalWallets } from "@/components/ExternalWallets";
import { ChainConfigArr } from "@/context/Chain.context";
import { Network } from "@/core/types";

import { BBN_TESTNET_RPC_URL, bbnTestnet } from "./tesnet";

export const ONE_HOUR = 60 * 60 * 1000;

export const config: ChainConfigArr = [
  {
    chain: "BTC",
    connectors: [
      {
        id: "tomo-connect",
        widget: () => <ExternalWallets chainName="bitcoin" />,
      },
    ],
    config: {
      coinName: "Mainnet BTC",
      coinSymbol: "BTC",
      networkName: "BTC",
      mempoolApiUrl: "https://mempool.space/",
      network: Network.MAINNET,
    },
  },
  {
    chain: "BBN",
    connectors: [
      {
        id: "tomo-connect",
        widget: () => <ExternalWallets chainName="cosmos" />,
      },
    ],
    config: {
      networkName: bbnTestnet.currencies[0].coinDenom,
      networkFullName: bbnTestnet.chainName,
      coinSymbol: bbnTestnet.currencies[0].coinDenom,
      chainId: bbnTestnet.chainId,
      rpc: BBN_TESTNET_RPC_URL,
      chainData: bbnTestnet,
    },
  },
];
