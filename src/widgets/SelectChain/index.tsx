import { twMerge } from "tailwind-merge";

import { Button, DialogBody, DialogFooter, DialogHeader, Text } from "@/index";
import { ChainButton } from "@/widgets/ChainButton";
import { ConnectedWallet } from "@/widgets/ConnectedWallet";

interface WalletConnectProps {
  className?: string;
  onClose?: () => void;
}

export function SelectChain({ className, onClose }: WalletConnectProps) {
  return (
    <div className={twMerge("flex flex-1 flex-col", className)}>
      <DialogHeader className="mb-10" title="Connect Wallets" onClose={onClose}>
        <Text>Connect to both Bitcoin and Babylon Chain Wallets</Text>
      </DialogHeader>

      <DialogBody className="flex flex-col gap-6">
        <ChainButton disabled title="Select Bitcoin Wallet" logo="/images/chains/bitcoin.png" alt="Bitcoin">
          <ConnectedWallet logo="/images/wallets/okx.png" name="OKX" address="bc1pnT..e4Vtc" />
        </ChainButton>

        <ChainButton title="Select Babylon Chain Wallet" logo="/images/chains/babylon.jpeg" alt="Babylon" />
      </DialogBody>

      <DialogFooter className="mt-auto flex gap-4 pt-10">
        <Button variant="outlined" fluid>
          Cancel
        </Button>
        <Button fluid>Done</Button>
      </DialogFooter>
    </div>
  );
}
