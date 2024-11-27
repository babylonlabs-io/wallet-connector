import { BBNProvider } from "./BBNProvider";
import icon from "./babylon.jpeg";

import { BBNConfig, ChainMetadata } from "@/core/types";

const metadata: ChainMetadata<"BBN", BBNProvider, BBNConfig> = {
  chain: "BBN",
  name: "Babylon Chain",
  icon,
  wallets: [],
};

export default metadata;
