import { memo } from "react";
import { twMerge } from "tailwind-merge";
import { Button, DialogBody, DialogFooter, DialogHeader, Text } from "@babylonlabs-io/bbn-core-ui";

import ConnectedWallet from "@/components/ConnectedWallet/container";
import { ChainButton } from "@/components/ChainButton";
import type { IChain, IWallet } from "@/core/types";

interface ChainsProps {
  disabled?: boolean;
  chains: IChain[];
  className?: string;
  selectedWallets?: Record<string, IWallet | undefined>;
  onClose?: () => void;
  onConfirm?: () => void;
  onSelectChain?: (chain: IChain) => void;
}

export const Chains = memo(
  ({ disabled = false, chains, selectedWallets = {}, className, onClose, onConfirm, onSelectChain }: ChainsProps) => (
    <div className={twMerge("b-flex b-flex-1 b-flex-col", className)}>
      <DialogHeader className="b-mb-10" title="Connect Wallets" onClose={onClose}>
        <Text>Connect to both Bitcoin and Babylon Chain Wallets</Text>
      </DialogHeader>

      <DialogBody className="b-flex b-flex-col b-gap-6">
        {chains.map((chain) => {
          const selectedWallet = selectedWallets[chain.id];

          return (
            <ChainButton
              key={chain.id}
              disabled={Boolean(selectedWallet)}
              title={`Select ${chain.name} Wallet`}
              logo={chain.icon}
              alt={chain.name}
              onClick={() => void onSelectChain?.(chain)}
            >
              {selectedWallet && (
                <ConnectedWallet
                  chainId={chain.id}
                  logo={selectedWallet.icon}
                  name={selectedWallet.name}
                  address={selectedWallet.account?.address ?? ""}
                />
              )}
            </ChainButton>
          );
        })}
      </DialogBody>

      <DialogFooter className="b-mt-auto b-flex b-gap-4 b-pt-10">
        <Button variant="outlined" fluid onClick={onClose}>
          Cancel
        </Button>

        <Button disabled={disabled} fluid onClick={onConfirm}>
          Done
        </Button>
      </DialogFooter>
    </div>
  ),
);
