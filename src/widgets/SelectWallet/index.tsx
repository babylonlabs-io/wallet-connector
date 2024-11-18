import { twMerge } from "tailwind-merge";

import { Text, Button, DialogBody, DialogFooter, DialogHeader } from "@/index";
import { WalletButton } from "@/widgets/WalletButton";

export interface Props {
  className?: string;
  onClose?: () => void;
  append?: JSX.Element;
}

export function SelectWallet({ className, append, onClose }: Props) {
  return (
    <div className={twMerge("flex flex-1 flex-col", className)}>
      <DialogHeader className="mb-10" title="Select Wallet" onClose={onClose}>
        <Text>Connect a Bitcoin Wallet</Text>
      </DialogHeader>

      <DialogBody>
        <div className="grid grid-cols-2 gap-6">
          <WalletButton name="Binance Web3 Wallet" logo="/images/wallets/binance.png" label="Installed" />
          <WalletButton name="Binance Web3 Wallet" logo="/images/wallets/binance.png" label="Injected" />
          <WalletButton name="Binance Web3 Wallet" logo="/images/wallets/binance.png" label="Injected" />
          <WalletButton name="Binance Web3 Wallet" logo="/images/wallets/binance.png" label="Injected" />
          <WalletButton name="Binance Web3 Wallet" logo="/images/wallets/binance.png" />
        </div>

        {append}
      </DialogBody>

      <DialogFooter className="mt-auto pt-10">
        <Button variant="outlined" fluid>
          Back
        </Button>
      </DialogFooter>
    </div>
  );
}
