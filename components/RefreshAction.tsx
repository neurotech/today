"use client";

import { useTransition } from "react";
import { RefreshButton } from "./Buttons/RefreshButton";

type RefreshActionProps = {
  /** A Server Action that invalidates this feature's cache tag. */
  action: () => Promise<void>;
};

/**
 * Bridges `RefreshButton` (which wants a sync `onClick` and a `loading`
 * boolean) to a Server Action, with `useTransition` supplying the pending state.
 */
export const RefreshAction = ({ action }: RefreshActionProps) => {
  const [pending, startTransition] = useTransition();

  return (
    <RefreshButton
      loading={pending}
      onClick={() => startTransition(async () => await action())}
    />
  );
};
