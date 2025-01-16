import { Text } from "@babylonlabs-io/bbn-core-ui";

import { WalletButton } from "@/components/WalletButton";
import { ChainConfigArr } from "@/context/Chain.context";
import { Network } from "@/core/types";

import { BBN_TESTNET_RPC_URL, bbnTestnet } from "./tesnet";

export const config: ChainConfigArr = [
  {
    chain: "BTC",
    connectors: [
      {
        id: "tomo-connect",
        widget: () => (
          <div className="b-sticky b-inset-x-0 b-bottom-0 b-bg-[#ffffff] b-pt-10">
            <Text className="b-mb-4">More wallets with Tomo Connect</Text>
            <WalletButton logo="/images/wallets/tomo.png" name="Tomo Connect" onClick={() => alert("Hello Tomo!")} />
          </div>
        ),
      },
    ],
    config: {
      coinName: "Signet BTC",
      coinSymbol: "sBTC",
      networkName: "BTC signet",
      mempoolApiUrl: "https://mempool.space/signet",
      network: Network.SIGNET,
    },
  },
  {
    chain: "BBN",
    connectors: [
      {
        id: "tomo-connect",
        widget: () => (
          <div className="b-sticky b-inset-x-0 b-bottom-0 b-bg-[#ffffff] b-pt-10">
            <Text className="b-mb-4">More wallets with Tomo Connect</Text>
            <WalletButton logo="/images/wallets/tomo.png" name="Tomo Connect" onClick={() => alert("Hello Tomo!")} />
          </div>
        ),
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
