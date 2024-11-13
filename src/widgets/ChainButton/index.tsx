import type { JSX, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

import { Avatar, Text } from "@/index";

interface ChainButtonProps extends PropsWithChildren {
  className?: string;
  disabled?: boolean;
  logo?: string | JSX.Element;
  title?: string | JSX.Element;
  alt?: string;
}

export function ChainButton({ className, disabled, alt, logo, title, children }: ChainButtonProps) {
  const avatar = typeof logo === "string" ? <Avatar url={logo} alt={alt} /> : <Avatar>{logo}</Avatar>;

  return (
    <Text
      disabled={disabled}
      as="buttons"
      className={twMerge(
        "flex flex-col gap-2.5 rounded border border-primary-main/30 p-4",
        disabled ? "cursor-default" : "cursor-pointer",
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        {avatar}
        {title}

        {!disabled && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="ml-auto block"
          >
            <path
              d="M8.58984 16.59L13.1698 12L8.58984 7.41L9.99984 6L15.9998 12L9.99984 18L8.58984 16.59Z"
              fill="currentColor"
            />
          </svg>
        )}
      </div>

      {children && <div onClick={(e) => e.stopPropagation()}>{children}</div>}
    </Text>
  );
}
