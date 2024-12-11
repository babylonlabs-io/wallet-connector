import { Network, type BTCConfig, type WalletMetadata } from "@/core/types";

import type { BTCProvider } from "../BTCProvider";

import logo from "./logo.svg";
import { OneKeyProvider } from "./provider";

const metadata: WalletMetadata<BTCProvider, BTCConfig> = {
  id: "onekey",
  name: "OneKey",
  icon: logo,
  docs: "https://onekey.so/download",
  wallet: "$onekey",
  createProvider: (wallet, config) => new OneKeyProvider(wallet, config),
  networks: [Network.MAINNET, Network.SIGNET],
};

export default metadata;
