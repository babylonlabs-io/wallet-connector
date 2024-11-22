import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { Button, DialogBody, DialogFooter, DialogHeader, Text } from "@babylonlabs-io/bbn-core-ui";

import ConnectedWallet from "@/components/ConnectedWallet";
import { ChainButton } from "@/components/ChainButton";
import { withAppState } from "@/hocs/withAppState";
import type { IChain, IWallet } from "@/core/types";

interface ChainsProps {
  chains: IChain[];
  className?: string;
  selectedWallets?: Record<string, IWallet | undefined>;
  onClose?: () => void;
  onSelectChain?: (chain: IChain) => void;
}

export function Chains({ chains, selectedWallets = {}, className, onClose, onSelectChain }: ChainsProps) {
  const countOfSelectedWallets = useMemo(
    () => Object.values(selectedWallets).filter(Boolean).length,
    [selectedWallets],
  );
  const activeChains = useMemo(() => chains.filter((chain) => chain.wallets.length > 0), [chains]);

  return (
    <div className={twMerge("b-flex b-flex-1 b-flex-col", className)}>
      <DialogHeader className="b-mb-10" title="Connect Wallets" onClose={onClose}>
        <Text>Connect to both Bitcoin and Babylon Chain Wallets</Text>
      </DialogHeader>

      <DialogBody className="b-flex b-flex-col b-gap-6">
        {activeChains.map((chain) => {
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

        <Button disabled={countOfSelectedWallets < activeChains.length} fluid onClick={onClose}>
          Done
        </Button>
      </DialogFooter>
    </div>
  );
}

interface OuterProps {
  className?: string;
  onClose?: () => void;
}

export default withAppState<OuterProps, ChainsProps, ChainsProps>((state) => ({
  chains: Object.values(state.chains),
  selectedWallets: state.selectedWallets,
  onSelectChain: (chain: IChain) => {
    state.displayWallets?.(chain.id);
  },
}))(Chains);
