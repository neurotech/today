"use client";

import ArrowPathIcon from "@heroicons/react/16/solid/ArrowPathIcon";
import { Button, type ButtonProps } from "./Button";

type RefreshButtonProps = Pick<ButtonProps, "onClick"> & {
  loading: boolean;
};

const loadingStyles = (loading: boolean) =>
  loading
    ? "animate-spin text-velvet-500"
    : "text-velvet-400 hover:text-velvet-300";

export const RefreshButton = ({ loading, onClick }: RefreshButtonProps) => (
  <Button
    label={
      <ArrowPathIcon
        className={`${loadingStyles(loading)} fill-velvet-300 size-3`}
      />
    }
    onClick={onClick}
    disabled={loading}
    minWidth={"min-w-6"}
  />
);
