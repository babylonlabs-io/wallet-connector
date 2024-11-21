import type { Meta, StoryObj } from "@storybook/react";

import { Text } from "@/index";
import { Wallets } from "./index";
import { WalletButton } from "@/widgets/WalletButton";

const meta: Meta<typeof Wallets> = {
  component: Wallets,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const wallets = [
  {
    id: "injectable",
    name: "Binance (Browser)",
    installed: true,
    icon: "/images/wallets/binance.png",
    docs: "",
    provider: null,
    account: null,
  },
  {
    id: "okx",
    name: "OKX",
    installed: true,
    icon: "/images/wallets/okx.png",
    docs: "",
    provider: null,
    account: null,
  },
  {
    id: "keystone",
    name: "Keysone",
    installed: true,
    icon: "/images/wallets/keystone.svg",
    docs: "",
    provider: null,
    account: null,
  },
];

export const Default: Story = {
  args: {
    className: "h-[600px]",
    chain: { id: "BTC", name: "Bitcoin", icon: "/images/chains/bitcoin.png", wallets },
    append: (
      <div className="sticky inset-x-0 bottom-0 bg-[#ffffff] pt-10">
        <Text className="mb-4">More wallets with Tomo Connect</Text>
        <WalletButton logo="/images/wallets/tomo.png" name="Tomo Connect" />
      </div>
    ),
  },
};
