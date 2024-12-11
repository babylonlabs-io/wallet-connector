import { BBNConfig, ChainMetadata } from "@/core/types";

import { BBNProvider } from "./BBNProvider";
import icon from "./babylon.jpeg";
import keplr from "./keplr";

const metadata: ChainMetadata<"BBN", BBNProvider, BBNConfig> = {
  chain: "BBN",
  name: "Babylon Chain",
  icon,
  wallets: [keplr],
};

export default metadata;
