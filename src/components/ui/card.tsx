import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";
import { Separator } from "./separator";

type CardProps = {
  children: ReactNode;
  headerTitle?: string;
  headerIcon?: ReactNode;
  className?: HTMLAttributes<HTMLElement>["className"];
  containerClassName?: HTMLAttributes<HTMLElement>["className"];
};

export const Card = ({
  children,
  headerTitle,
  headerIcon,
  className,
  containerClassName,
}: CardProps) => (
  <section
    className={cn(
      "flex flex-col flex-1 rounded-md bg-zinc-800 shadow-black/20 shadow-md ring-1 ring-zinc-600/70",
      className,
    )}
  >
    {headerTitle ? (
      <>
        <header className="flex flex-row items-center gap-2 p-2 text-zinc-600">
          {headerIcon}
          <h1 className="text-white">{headerTitle}</h1>
        </header>
        <Separator />
      </>
    ) : null}
    <main className={cn("p-2", containerClassName)}>{children}</main>
  </section>
);
