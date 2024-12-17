import { IBTCProvider, Network, type BTCConfig, type WalletMetadata } from "@/core/types";

import logo from "./logo.svg";
import { CactusLinkProvider, WALLET_PROVIDER_NAME } from "./provider";

const metadata: WalletMetadata<IBTCProvider, BTCConfig> = {
  id: "cactus",
  name: WALLET_PROVIDER_NAME,
  icon: logo,
  docs: "https://chromewebstore.google.com/detail/cactus-link/chiilpgkfmcopocdffapngjcbggdehmj",
  wallet: "cactuslink",
  createProvider: (wallet, config) => new CactusLinkProvider(wallet, config),
  networks: [Network.MAINNET, Network.SIGNET],
};

export default metadata;
