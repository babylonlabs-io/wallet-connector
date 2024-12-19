import { Avatar, Chip, Text } from "@babylonlabs-io/bbn-core-ui";
import { twMerge } from "tailwind-merge";

interface WalletButtonProps {
  className?: string;
  logo: string;
  disabled?: boolean;
  name: string;
  label?: string;
  fallbackLink?: string;
  installed?: boolean;
  onClick?: () => void;
}

export function WalletButton({
  className,
  disabled = false,
  name,
  logo,
  label,
  fallbackLink,
  installed = true,
  onClick,
}: WalletButtonProps) {
  const btnProps = installed ? { as: "button", disabled, onClick } : { as: "a", href: fallbackLink, target: "_blank" };

  return (
    <Text
      className={twMerge(
        "b-flex b-h-14 b-w-full b-cursor-pointer b-items-center b-gap-2.5 b-rounded b-border b-border-primary-main/30 b-px-2",
        disabled ? "b-cursor-default" : "b-cursor-pointer",
        className,
      )}
      {...btnProps}
    >
      <Avatar variant="rounded" className="b-shrink-0" alt={name} url={logo} />
      {name}

      {label && <Chip className="b-ml-auto b-shrink-0">{label}</Chip>}
    </Text>
  );
}
