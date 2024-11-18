import { DetailedHTMLProps, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export type IconButtonProps = DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export const IconButton = ({ className, ...restProps }: IconButtonProps) => {
  return (
    <button
      {...restProps}
      className={twMerge(
        "inline-flex size-10 items-center justify-center rounded border border-current text-primary-light",
        className,
      )}
    />
  );
};
