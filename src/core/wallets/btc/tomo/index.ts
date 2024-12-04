import { Network, type BTCConfig, type WalletMetadata } from "@/core/types";

import type { BTCProvider } from "../BTCProvider";

import logo from "./logo.svg";
import { TomoProvider } from "./provider";

const metadata: WalletMetadata<BTCProvider, BTCConfig> = {
  id: "tomo",
  name: "Tomo",
  icon: logo,
  docs: "https://tomo.inc",
  wallet: "tomo_btc",
  createProvider: (wallet, config) => new TomoProvider(wallet, config),
  networks: [Network.MAINNET, Network.SIGNET],
};

export default metadata;
