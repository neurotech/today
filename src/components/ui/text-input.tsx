import { type ComponentProps, forwardRef, type ReactNode, useId } from "react";
import { twMerge } from "tailwind-merge";

type TextInputProps = {
  label?: string | ReactNode;
  valid?: boolean;
  containerClassName?: string;
} & ComponentProps<"input">;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, valid = false, containerClassName, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div
        className={twMerge("group flex flex-col gap-1.5", containerClassName)}
      >
        {label ? (
          <label
            htmlFor={inputId}
            className="text-sm text-zinc-400 select-none group-focus-within:text-white data-[valid=false]:text-rose-200 group-focus-within:data-[valid=false]:text-rose-400"
            data-valid={valid}
          >
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!valid}
          {...props}
          className="rounded-sm border border-zinc-600 bg-zinc-700/80 p-2 font-mono text-sm text-zinc-400 shadow-sm transition-colors focus:border-indigo-500 focus:bg-zinc-600 focus:text-zinc-50 focus:ring-4 focus:ring-indigo-500/25 focus:outline-none focus:selection:bg-indigo-400 focus:selection:text-indigo-950 disabled:cursor-not-allowed disabled:border-zinc-900 disabled:bg-zinc-900/40 disabled:text-zinc-600 disabled:select-none data-[valid=false]:border-rose-400 data-[valid=false]:bg-rose-800/20 data-[valid=false]:text-rose-400 data-[valid=false]:focus:bg-rose-950/20 data-[valid=false]:focus:ring-red-500/25"
          data-valid={valid}
        />
      </div>
    );
  },
);
