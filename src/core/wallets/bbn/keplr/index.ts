import { Network, type WalletMetadata } from "@/core/types";

import logo from "./logo.svg";
import type { BBNProvider } from "../BBNProvider";
import { KeplrProvider } from "./provider";

const metadata: WalletMetadata<BBNProvider> = {
  id: "keplr",
  name: "Keplr",
  icon: logo,
  docs: "https://www.keplr.app/",
  wallet: "keplr",
  createProvider: (wallet) => new KeplrProvider(wallet),
  networks: [Network.MAINNET, Network.SIGNET],
};

export default metadata;
