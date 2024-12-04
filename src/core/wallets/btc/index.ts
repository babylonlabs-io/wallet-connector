import type { BTCConfig, ChainMetadata } from "@/core/types";

import { BTCProvider } from "./BTCProvider";
import icon from "./bitcoin.png";
import bitget from "./bitget";
import cactus from "./cactuslink";
import injectable from "./injectable";
import okx from "./okx";
import onekey from "./onekey";
import tomo from "./tomo";

const metadata: ChainMetadata<"BTC", BTCProvider, BTCConfig> = {
  chain: "BTC",
  name: "Bitcoin",
  icon,
  wallets: [injectable, okx, onekey, bitget, cactus, tomo],
};

export default metadata;
