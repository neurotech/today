"use client";

import ArrowPathIcon from "@heroicons/react/16/solid/ArrowPathIcon";
import { Button, type ButtonProps } from "./Button";

type RefreshButtonProps = Pick<ButtonProps, "onClick"> & {
  loading: boolean;
};

const loadingStyles = (loading: boolean) =>
  loading ? "animate-spin text-zinc-500" : "text-zinc-400 hover:text-zinc-300";

export const RefreshButton = ({ loading, onClick }: RefreshButtonProps) => (
  <Button
    label={
      <ArrowPathIcon
        className={`${loadingStyles(loading)} fill-zinc-300 size-3`}
      />
    }
    onClick={onClick}
    disabled={loading}
    minWidth={"min-w-6"}
  />
);
