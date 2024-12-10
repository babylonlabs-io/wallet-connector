import { BTCProvider } from "./BTCProvider";
import icon from "./bitcoin.png";

import injectable from "./injectable";
import okx from "./okx";
import cactus from "./cactus";

import type { ChainMetadata, BTCConfig } from "@/core/types";

const metadata: ChainMetadata<"BTC", BTCProvider, BTCConfig> = {
  chain: "BTC",
  name: "Bitcoin",
  icon,
  wallets: [injectable, okx, cactus],
};

export default metadata;
