import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  [
    "border",
    "border-zinc-900",
    "text-xs",
    "flex",
    "flex-row",
    "items-center",
    "justify-between",
    "px-1.5",
    "py-1.5",
    "rounded-sm",
    "text-white",
    "text-shadow-2xs",
    "cursor-pointer",
    "transition-colors",
    "select-none",
    "shadow-[0_1px_--theme(--color-white/0.2)_inset,0_1px_1px_--theme(--color-zinc-950/0.1)]",
    "disabled:shadow-[0_1px_--theme(--color-white/0.07)_inset,0_1px_1px_--theme(--color-zinc-950/0.5)]",
    "disabled:cursor-not-allowed",
    "disabled:bg-zinc-900/70",
    "disabled:from-zinc-800/50",
    "disabled:to-zinc-800",
    "disabled:text-zinc-500",
    "disabled:text-shadow-none",
    "font-semibold",
    "group",
  ],
  {
    variants: {
      variant: {
        indigo: [
          "bg-indigo-600 bg-linear-to-b from-indigo-400/60 to-indigo-800 hover:bg-linear-to-b hover:from-indigo-400/90 hover:to-indigo-800/80",
        ],
        red: [
          "bg-red-600 bg-linear-to-b from-red-400/60 to-red-800 hover:bg-linear-to-b hover:from-red-400/90 hover:to-red-800/80",
        ],
        yellow: [
          "bg-yellow-600 bg-linear-to-b from-yellow-400/60 to-yellow-800 hover:bg-linear-to-b hover:from-yellow-400/90 hover:to-yellow-800/80",
        ],
        emerald: [
          "bg-emerald-600 bg-linear-to-b from-emerald-400/60 to-emerald-800 hover:bg-linear-to-b hover:from-emerald-400/90 hover:to-emerald-800/80",
        ],
      },
    },
    defaultVariants: {
      variant: "indigo",
    },
  },
);

const shortcutVariants = cva(
  "text-[10px] ml-2 px-1 py-px rounded-xs text-shadow-none  transition-colors border font-medium w-fit",
  {
    variants: {
      variant: {
        indigo: [
          "group-hover:bg-indigo-950/60 border-indigo-950/50 bg-indigo-900 text-indigo-200",
        ],
        red: [
          "group-hover:bg-red-950/60 border-red-950/50 bg-red-900 text-red-200",
        ],
        yellow: [
          "group-hover:bg-yellow-950/60 border-yellow-950/50 bg-yellow-900 text-yellow-200",
        ],
        emerald: [
          "group-hover:bg-emerald-950/60 border-emerald-950/50 bg-emerald-900 text-emerald-200",
        ],
      },
    },
    defaultVariants: {
      variant: "indigo",
    },
  },
);

type ButtonProps = {
  small?: boolean;
  shortcut?: string;
} & ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

export const Button = ({
  className,
  small = false,
  shortcut,
  variant,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={twMerge(
        buttonVariants({ variant }),
        small && "py-1 pr-1 pl-1.5",
        className,
      )}
      {...props}
    >
      <div>{props.children}</div>
      {shortcut ? (
        <div className={twMerge(shortcutVariants({ variant }), className)}>
          {shortcut}
        </div>
      ) : null}
    </button>
  );
};
