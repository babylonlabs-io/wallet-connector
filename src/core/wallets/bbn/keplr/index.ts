import { Network, type BBNConfig, type WalletMetadata } from "@/core/types";

import type { BBNProvider } from "../BBNProvider";

import logo from "./logo.svg";
import { KeplrProvider } from "./provider";

const metadata: WalletMetadata<BBNProvider, BBNConfig> = {
  id: "keplr",
  name: "Keplr",
  icon: logo,
  docs: "https://www.keplr.app/",
  wallet: "keplr",
  createProvider: (wallet, config) => new KeplrProvider(wallet, config),
  networks: [Network.MAINNET, Network.SIGNET],
};

export default metadata;
