import { twJoin } from "tailwind-merge";

export interface ButtonProps {
  label: string;
  onClick?: () => void;
}

export const Button = ({ label, onClick }: ButtonProps) => {
  return (
    <button type="button" className={twJoin("bwc-text-gray-900")} onClick={onClick}>
      {label}
    </button>
  );
};
