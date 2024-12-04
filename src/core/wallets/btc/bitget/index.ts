import { Network, type BTCConfig, type WalletMetadata } from "@/core/types";

import type { BTCProvider } from "../BTCProvider";

import logo from "./logo.svg";
import { BitgetProvider } from "./provider";

const metadata: WalletMetadata<BTCProvider, BTCConfig> = {
  id: "bitget",
  name: "Bitget",
  icon: logo,
  docs: "https://web3.bitget.com",
  wallet: "bitkeep",
  createProvider: (wallet, config) => new BitgetProvider(wallet, config),
  networks: [Network.MAINNET, Network.SIGNET],
};

export default metadata;
