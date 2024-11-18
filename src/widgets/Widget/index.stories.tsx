import type { Meta, StoryObj } from "@storybook/react";

import { Widget } from "./index";

const meta: Meta<typeof Widget> = {
  component: Widget,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
