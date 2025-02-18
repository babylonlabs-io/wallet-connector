import { IBBNProvider, Network, type BBNConfig, type WalletMetadata } from "@/core/types";

import logo from "./logo.svg";
import { CosmostationProvider, WALLET_PROVIDER_NAME } from "./provider";

const metadata: WalletMetadata<IBBNProvider, BBNConfig> = {
  id: "cosmostation",
  name: WALLET_PROVIDER_NAME,
  icon: logo,
  docs: "https://www.cosmostation.io/",
  wallet: "cosmostation",
  createProvider: (wallet, config) => new CosmostationProvider(wallet, config),
  networks: [Network.MAINNET, Network.SIGNET],
};

export default metadata;
