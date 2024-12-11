import type { BTCConfig, ChainMetadata } from "@/core/types";

import { BTCProvider } from "./BTCProvider";
import icon from "./bitcoin.png";
import injectable from "./injectable";
import okx from "./okx";
import onekey from "./onekey";
import bitget from "./bitget";

import type { ChainMetadata, BTCConfig } from "@/core/types";


const metadata: ChainMetadata<"BTC", BTCProvider, BTCConfig> = {
  chain: "BTC",
  name: "Bitcoin",
  icon,
  wallets: [injectable, okx, onekey, bitget],
};

export default metadata;
