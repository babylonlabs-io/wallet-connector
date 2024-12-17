import { BBNConfig, ChainMetadata, IBBNProvider } from "@/core/types";

import icon from "./babylon.jpeg";
import injectable from "./injectable";
import keplr from "./keplr";

const metadata: ChainMetadata<"BBN", IBBNProvider, BBNConfig> = {
  chain: "BBN",
  name: "Babylon Chain",
  icon,
  wallets: [injectable, keplr],
};

export default metadata;
