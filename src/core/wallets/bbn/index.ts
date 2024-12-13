import { BBNConfig, ChainMetadata } from "@/core/types";

import { BBNProvider } from "./BBNProvider";
import icon from "./babylon.jpeg";
import injectable from "./injectable";
import keplr from "./keplr";

const metadata: ChainMetadata<"BBN", BBNProvider, BBNConfig> = {
  chain: "BBN",
  name: "Babylon Chain",
  icon,
  wallets: [injectable, keplr],
};

export default metadata;
