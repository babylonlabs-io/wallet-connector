import type { Meta, StoryObj } from "@storybook/react";

import { SelectChain } from "./index";

const meta: Meta<typeof SelectChain> = {
  component: SelectChain,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onClose: console.log,
    className: "h-[600px]",
  },
};
