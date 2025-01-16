import { BBNConfig, ChainMetadata, IBBNProvider } from "@/core/types";

import icon from "./babylon.jpeg";
import injectable from "./injectable";
import keplr from "./keplr";
import leap from "./leap";
import okx from "./okx";

const metadata: ChainMetadata<"BBN", IBBNProvider, BBNConfig> = {
  chain: "BBN",
  name: "Babylon Chain",
  icon,
  wallets: [injectable, keplr, leap, okx],
};

export default metadata;
