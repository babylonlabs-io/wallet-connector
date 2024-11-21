import { BBNProvider } from "./BBNProvider";
import icon from "./babylon.jpeg";

import { ChainMetadata } from "@/core/types";

const metadata: ChainMetadata<"BBN", BBNProvider> = {
  chain: "BBN",
  name: "Babylon Chain",
  icon,
  wallets: [],
};

export default metadata;
