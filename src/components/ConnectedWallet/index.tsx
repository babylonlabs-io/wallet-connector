import { twMerge } from "tailwind-merge";
import { Avatar, Text } from "@babylonlabs-io/bbn-core-ui";
import { memo } from "react";

interface ConnectedWalletProps {
  className?: string;
  chainId: string;
  logo: string;
  name: string;
  address: string;
  onDisconnect?: (chainId: string) => void;
}

export const ConnectedWallet = memo(
  ({ className, chainId, logo, name, address, onDisconnect }: ConnectedWalletProps) => (
    <div
      className={twMerge(
        "b-flex b-shrink-0 b-items-center b-gap-2.5 b-rounded b-border b-border-secondary-main/30 b-p-2",
        className,
      )}
    >
      <Avatar variant="rounded" size="medium" url={logo} />

      <div className="b-flex b-flex-1 b-flex-col b-items-start">
        <Text as="div" variant="body2" className="b-leading-4">
          {name}
        </Text>
        {Boolean(address) && (
          <Text as="div" variant="caption" className="b-leading-4 b-text-primary-light">
            {address}
          </Text>
        )}
      </div>

      <button className="b-shrink-0 b-cursor-pointer" onClick={() => void onDisconnect?.(chainId)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="b-text-secondary-main"
          fill="none"
        >
          <path
            d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  ),
);
