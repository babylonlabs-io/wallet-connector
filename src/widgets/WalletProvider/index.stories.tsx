import type { Meta, StoryObj } from "@storybook/react";

import { WalletProvider } from "./index";

import { Button } from "@/components/Button";
import { ScrollLocker } from "@/context/Dialog.context";
import { useAppState } from "@/state/state";
import { Network } from "@/core/types";

const meta: Meta<typeof WalletProvider> = {
  component: WalletProvider,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const networkConfig = {
  coinName: "Signet BTC",
  coinSymbol: "sBTC",
  networkName: "BTC signet",
  mempoolApiUrl: "https://mempool.space/signet",
  network: Network.SIGNET,
};

export const Default: Story = {
  decorators: [
    (Story) => (
      <ScrollLocker>
        <WalletProvider context={window.parent} config={networkConfig}>
          <Story />
        </WalletProvider>
      </ScrollLocker>
    ),
  ],
  render: () => {
    const { open } = useAppState();

    return <Button onClick={open}>Connect Wallet</Button>;
  },
};
