import type { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface FieldControl {
  label: string | JSX.Element;
  className?: string;
}

export function FieldControl({ label, className, children }: PropsWithChildren<FieldControl>) {
  return (
    <label
      className={twMerge(
        "b-flex b-cursor-pointer b-gap-4 b-rounded b-border b-border-primary-main/30 b-p-4",
        className,
      )}
    >
      {children}
      {label}
    </label>
  );
}
