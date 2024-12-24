import { Text } from "@babylonlabs-io/bbn-core-ui";
import type { Meta, StoryObj } from "@storybook/react";

import { WalletButton } from "@/components/WalletButton";
import { IWallet } from "@/core/types";

import { Wallets } from "./index";

const meta: Meta<typeof Wallets> = {
  component: Wallets,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const wallets: IWallet[] = [
  {
    id: "injectable",
    name: "Binance (Browser)",
    installed: true,
    icon: "/images/wallets/binance.png",
    docs: "",
    provider: null,
    account: null,
    label: "Injected",
  },
  {
    id: "okx",
    name: "OKX",
    installed: true,
    icon: "/images/wallets/okx.png",
    docs: "",
    provider: null,
    account: null,
    label: "Installed",
  },
  {
    id: "keystone",
    name: "Keysone",
    installed: true,
    icon: "/images/wallets/keystone.svg",
    docs: "",
    provider: null,
    account: null,
    label: "Hardware wallet",
  },
  {
    id: "keystone",
    name: "Keysone",
    installed: true,
    icon: "/images/wallets/keystone.svg",
    docs: "",
    provider: null,
    account: null,
    label: "Hardware wallet",
  },
  {
    id: "tomo",
    name: "Tomo wallet",
    installed: false,
    icon: "/images/wallets/tomo.png",
    docs: "https://docs.tomo.inc/",
    provider: null,
    account: null,
    label: "",
  },
];

export const Default: Story = {
  args: {
    className: "b-h-[600px]",
    chain: { id: "BTC", name: "Bitcoin", icon: "/images/chains/bitcoin.png", config: {}, wallets },
    append: (
      <div className="b-sticky b-inset-x-0 b-bottom-0 b-bg-[#ffffff] b-pt-10">
        <Text className="b-mb-4">More wallets with Tomo Connect</Text>
        <WalletButton logo="/images/wallets/tomo.png" name="Tomo Connect" />
      </div>
    ),
  },
};
