import type { Meta, StoryObj } from "@storybook/react";

import { Text } from "@/index";
import { SelectWallet } from "./index";
import { WalletButton } from "@/widgets/WalletButton";

const meta: Meta<typeof SelectWallet> = {
  component: SelectWallet,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "h-[600px]",
    append: (
      <div className="sticky inset-x-0 bottom-0 bg-[#ffffff] pt-10">
        <Text className="mb-4">More wallets with Tomo Connect</Text>
        <WalletButton logo="/images/wallets/tomo.png" name="Tomo Connect" />
      </div>
    ),
  },
};
