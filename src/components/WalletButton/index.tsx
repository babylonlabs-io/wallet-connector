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
        "b-flex b-h-14 b-w-full b-cursor-pointer b-items-center b-gap-2.5 b-rounded b-border b-border-primary-main/30 b-px-2",
        disabled ? "b-cursor-default" : "b-cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      <Avatar variant="rounded" className="b-shrink-0" alt={name} url={logo} />
      {name}

      {label && <Chip className="b-ml-auto b-shrink-0">{label}</Chip>}
    </Text>
  );
}
