import { Network, type BBNConfig, type WalletMetadata } from "@/core/types";

import { BBNProvider } from "../BBNProvider";

const metadata: WalletMetadata<BBNProvider, BBNConfig> = {
  id: "injectable",
  name: (wallet) => wallet.getWalletProviderName?.(),
  icon: (wallet) => wallet.getWalletProviderIcon?.(),
  docs: "",
  wallet: "bbnwallet",
  createProvider: (wallet) => wallet,
  networks: [Network.MAINNET, Network.SIGNET],
  label: "Injectable",
};

export default metadata;
