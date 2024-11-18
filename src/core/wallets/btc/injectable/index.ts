import { Network, type WalletMetadata } from "@/core/types";
import { BTCProvider } from "../BTCProvider";

const metadata: WalletMetadata<BTCProvider> = {
  id: "injectable",
  name: (wallet) => wallet.getWalletProviderName?.(),
  icon: (wallet) => wallet.getWalletProviderIcon?.(),
  docs: "",
  wallet: "btcwallet",
  createProvider: (wallet) => wallet,
  networks: [Network.MAINNET, Network.SIGNET],
};

export default metadata;
