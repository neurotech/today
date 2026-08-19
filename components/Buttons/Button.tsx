"use client";

import type { ReactNode } from "react";

export type ButtonProps = {
  label: string | ReactNode;
  onClick: () => void;
  minWidth?: string;
  disabled?: boolean;
};

export const Button = ({
  label,
  onClick,
  minWidth = "min-w-22",
  disabled,
}: ButtonProps) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${minWidth} flex justify-center items-center cursor-pointer text-sm text-zinc-300 hover:text-zinc-50 transition-colors bg-zinc-700 hover:bg-zinc-500 rounded-sm p-1 border border-zinc-500 hover:border-zinc-500 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:bg-zinc-900 disabled:text-zinc-700`}
    >
      {label}
    </button>
  );
};
