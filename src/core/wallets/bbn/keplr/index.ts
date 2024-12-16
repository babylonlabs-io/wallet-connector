import { IBBNProvider, Network, type BBNConfig, type WalletMetadata } from "@/core/types";

import logo from "./logo.svg";
import { KeplrProvider } from "./provider";

const metadata: WalletMetadata<IBBNProvider, BBNConfig> = {
  id: "keplr",
  name: "Keplr",
  icon: logo,
  docs: "https://www.keplr.app/",
  wallet: "keplr",
  createProvider: (wallet, config) => new KeplrProvider(wallet, config),
  networks: [Network.MAINNET, Network.SIGNET],
};

export default metadata;
