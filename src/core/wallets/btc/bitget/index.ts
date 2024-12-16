import { IBTCProvider, Network, type BTCConfig, type WalletMetadata } from "@/core/types";

import logo from "./logo.svg";
import { BitgetProvider, WALLET_PROVIDER_NAME } from "./provider";

const metadata: WalletMetadata<IBTCProvider, BTCConfig> = {
  id: "bitget",
  name: WALLET_PROVIDER_NAME,
  icon: logo,
  docs: "https://web3.bitget.com",
  wallet: "bitkeep",
  createProvider: (wallet, config) => new BitgetProvider(wallet, config),
  networks: [Network.MAINNET, Network.SIGNET],
};

export default metadata;
