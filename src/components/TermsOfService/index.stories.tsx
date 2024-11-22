import type { Meta, StoryObj } from "@storybook/react";

import { TermsOfService } from "./index";

const meta: Meta<typeof TermsOfService> = {
  component: TermsOfService,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onClose: console.log,
    className: "b-h-[600px]",
  },
};
