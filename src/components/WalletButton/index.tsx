import { twMerge } from "tailwind-merge";
import { Text, Avatar, Chip } from "@babylonlabs-io/bbn-core-ui";

interface WalletButtonProps {
  className?: string;
  logo: string;
  disabled?: boolean;
  name: string;
  label?: string;
  onClick?: () => void;
}

export function WalletButton({ className, disabled = false, name, logo, label, onClick }: WalletButtonProps) {
  return (
    <Text
      disabled={disabled}
      as="button"
      className={twMerge(
        "flex h-14 w-full cursor-pointer items-center gap-2.5 rounded border border-primary-main/30 px-2",
        disabled ? "cursor-default" : "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      <Avatar variant="rounded" className="shrink-0" alt={name} url={logo} />
      {name}

      {label && <Chip className="ml-auto shrink-0">{label}</Chip>}
    </Text>
  );
}
