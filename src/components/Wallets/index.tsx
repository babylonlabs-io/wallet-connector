import { Button, DialogBody, DialogFooter, DialogHeader, Text } from "@babylonlabs-io/bbn-core-ui";
import { memo, useMemo } from "react";
import { twMerge } from "tailwind-merge";

import { WalletButton } from "@/components/WalletButton";
import type { IChain, IWallet } from "@/core/types";

export interface WalletsProps {
  chain: IChain;
  className?: string;
  append?: JSX.Element;
  onClose?: () => void;
  onSelectWallet?: (chain: IChain, wallet: IWallet) => void;
  onBack?: () => void;
}

export const Wallets = memo(({ chain, className, append, onClose, onBack, onSelectWallet }: WalletsProps) => {
  const injectableWallet = useMemo(
    () => chain.wallets.find((wallet) => wallet.id === "injectable" && wallet.installed),
    [chain],
  );
  const wallets = useMemo(() => chain.wallets.filter((wallet) => wallet.id !== "injectable"), [chain]);
  const countOfVisibleWallets = useMemo(
    () => chain.wallets.filter((wallet) => wallet.id !== "injectable" || wallet.installed).length,
    [chain],
  );

  return (
    <div className={twMerge("b-flex b-flex-1 b-flex-col", className)}>
      <DialogHeader className="b-mb-10" title="Select Wallet" onClose={onClose}>
        <Text>Connect a {chain.name} Wallet</Text>
      </DialogHeader>

      <DialogBody>
        <div className={twMerge("b-grid b-gap-6", countOfVisibleWallets > 1 ? "b-grid-cols-2" : "b-grid-cols-1")}>
          {injectableWallet && (
            <WalletButton
              name={injectableWallet.name}
              logo={injectableWallet.icon}
              label={injectableWallet.label}
              onClick={() => onSelectWallet?.(chain, injectableWallet)}
            />
          )}

          {wallets.map((wallet) => (
            <WalletButton
              key={wallet.id}
              name={wallet.name}
              logo={wallet.icon}
              label={wallet.label}
              onClick={() => onSelectWallet?.(chain, wallet)}
            />
          ))}
        </div>

        {append}
      </DialogBody>

      <DialogFooter className="b-mt-auto b-pt-10">
        <Button variant="outlined" fluid onClick={onBack}>
          Back
        </Button>
      </DialogFooter>
    </div>
  );
});
