"use client";

import { useTransition } from "react";
import { RefreshButton } from "./Buttons/RefreshButton";

type RefreshActionProps = {
  /** A Server Action that invalidates this feature's cache tag. */
  action: () => Promise<void>;
};

/**
 * Bridges the ported `RefreshButton` (which wants a sync `onClick` and a
 * `loading` boolean) to a Server Action. `useTransition` supplies the pending
 * state that `useFetch`'s `loading` used to provide.
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
