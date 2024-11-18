import { BTCProvider } from "./BTCProvider";

import injectable from "./injectable";
import okx from "./okx";

import { ConnectMetadata } from "@/core/types";

const metadata: ConnectMetadata<BTCProvider> = {
  chain: "BTC",
  icon: "test",
  wallets: [injectable, okx],
};

export default metadata;
