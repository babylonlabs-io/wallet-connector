import { Text } from "@babylonlabs-io/bbn-core-ui";
import { ChainInfo } from "@keplr-wallet/types";

import { WalletButton } from "@/components/WalletButton";
import { ChainConfigArr } from "@/context/Chain.context";
import { Network } from "@/core/types";

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
      chainId: "devnet-9",
      rpc: "https://rpc-dapp.devnet.babylonlabs.io",
      chainData: {
        chainId: "devnet-9",
        chainName: "Babylon Devnet 9",
        chainSymbolImageUrl:
          "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/bbn-dev/chain.png",
        rpc: "https://rpc-dapp.devnet.babylonlabs.io",
        rest: "https://lcd-dapp.devnet.babylonlabs.io",
        nodeProvider: {
          name: "Babylonlabs",
          email: "contact@babylonlabs.io",
          website: "https://babylonlabs.io/",
        },
        bip44: {
          coinType: 118,
        },
        bech32Config: {
          bech32PrefixAccAddr: "bbn",
          bech32PrefixAccPub: "bbnpub",
          bech32PrefixValAddr: "bbnvaloper",
          bech32PrefixValPub: "bbnvaloperpub",
          bech32PrefixConsAddr: "bbnvalcons",
          bech32PrefixConsPub: "bbnvalconspub",
        },
        currencies: [
          {
            coinDenom: "BBN",
            coinMinimalDenom: "ubbn",
            coinDecimals: 6,
            coinImageUrl:
              "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/bbn-dev/chain.png",
          },
        ],
        feeCurrencies: [
          {
            coinDenom: "BBN",
            coinMinimalDenom: "ubbn",
            coinDecimals: 6,
            coinImageUrl:
              "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/bbn-dev/chain.png",
            gasPriceStep: {
              low: 0.007,
              average: 0.007,
              high: 0.01,
            },
          },
        ],
        stakeCurrency: {
          coinDenom: "BBN",
          coinMinimalDenom: "ubbn",
          coinDecimals: 6,
          coinImageUrl:
            "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/bbn-dev/chain.png",
        },
        features: ["cosmwasm"],
      } as ChainInfo,
    },
  },
];
