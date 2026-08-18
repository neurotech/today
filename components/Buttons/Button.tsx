"use client";

import type { ReactNode } from "react";

export type ButtonProps = {
  label: string | ReactNode;
  onClick: () => void;
  minWidth?: string;
  disabled?: boolean;
};

// A `compressed` prop used to switch a `p-[0px]` in here. No caller ever passed
// it, and it could not have worked: the class list ends with a hardcoded `p-1`,
// and which of two same-specificity padding utilities wins depends on their
// order in the generated stylesheet, not their order in this string.
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
      className={`${minWidth} flex justify-center items-center cursor-pointer text-sm text-velvet-300 hover:text-velvet-50 transition-colors bg-velvet-800 hover:bg-velvet-600 rounded-sm p-1 border border-velvet-600 hover:border-velvet-600 disabled:cursor-not-allowed disabled:border-neutral-800 disabled:bg-neutral-900 disabled:text-neutral-700`}
    >
      {label}
    </button>
  );
};
