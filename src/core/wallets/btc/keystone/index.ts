import { Network, type BTCConfig, type WalletMetadata } from "@/core/types";

import type { BTCProvider } from "../BTCProvider";

import logo from "./logo.svg";
import { KeystoneProvider } from "./provider";

const metadata: WalletMetadata<BTCProvider, BTCConfig> = {
  id: "keystone",
  name: "Keystone",
  icon: logo,
  docs: "https://www.keyst.one/btc-only",
  createProvider: (wallet, config) => new KeystoneProvider(wallet, config),
  networks: [Network.MAINNET, Network.SIGNET],
  label: "Hardware wallet",
};

export default metadata;
