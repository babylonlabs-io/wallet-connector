import { BTCProvider } from "./BTCProvider";
import icon from "./bitcoin.png";

import injectable from "./injectable";
import okx from "./okx";
import bitget from "./bitget";

import type { ChainMetadata, BTCConfig } from "@/core/types";

const metadata: ChainMetadata<"BTC", BTCProvider, BTCConfig> = {
  chain: "BTC",
  name: "Bitcoin",
  icon,
  wallets: [injectable, okx, bitget],
};

export default metadata;
