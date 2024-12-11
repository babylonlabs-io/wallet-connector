import type { BTCConfig, ChainMetadata } from "@/core/types";

import { BTCProvider } from "./BTCProvider";
import icon from "./bitcoin.png";
import bitget from "./bitget";
import injectable from "./injectable";
import okx from "./okx";
import cactus from "./cactus";
import onekey from "./onekey";


const metadata: ChainMetadata<"BTC", BTCProvider, BTCConfig> = {
  chain: "BTC",
  name: "Bitcoin",
  icon,
  wallets: [injectable, okx, onekey, bitget, cactus],
};

export default metadata;
