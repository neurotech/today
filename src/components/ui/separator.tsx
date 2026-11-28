import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export const Separator = ({
  className,
}: {
  className?: HTMLAttributes<HTMLHRElement>["className"];
}) => (
  <hr
    className={cn("shadow-hr border-zinc-600/70 shadow-zinc-950/50", className)}
  />
);
