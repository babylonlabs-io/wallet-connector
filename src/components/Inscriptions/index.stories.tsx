import type { Meta, StoryObj } from "@storybook/react";

import { Inscriptions } from "./index";

const meta: Meta<typeof Inscriptions> = {
  component: Inscriptions,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "b-h-[600px]",
  },
};
