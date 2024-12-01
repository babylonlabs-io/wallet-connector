import type { Meta, StoryObj } from "@storybook/react";
import { Button, ScrollLocker } from "@babylonlabs-io/bbn-core-ui";

import { useWidgetState } from "@/hooks/useWidgetState";

import { WalletProvider } from "./index";
import { config } from "./constants";

const meta: Meta<typeof WalletProvider> = {
  component: WalletProvider,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onError: console.log,
  },
  decorators: [
    (Story) => (
      <ScrollLocker>
        <WalletProvider context={window.parent} config={config} onError={console.log}>
          <Story />
        </WalletProvider>
      </ScrollLocker>
    ),
  ],
  render: () => {
    const { open } = useWidgetState();

    return <Button onClick={open}>Connect Wallet</Button>;
  },
};
