import type { BTCConfig, ChainMetadata } from "@/core/types";

import { BTCProvider } from "./BTCProvider";
import icon from "./bitcoin.png";
import injectable from "./injectable";
import okx from "./okx";

const metadata: ChainMetadata<"BTC", BTCProvider, BTCConfig> = {
  chain: "BTC",
  name: "Bitcoin",
  icon,
  wallets: [injectable, okx],
};

export default metadata;
