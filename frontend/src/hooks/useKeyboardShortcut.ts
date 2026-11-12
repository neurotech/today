import { useEffect } from "react";

type Options = {
  key: string;
  metaKey?: boolean;
  eventType?: "keydown" | "keyup";
  enabled?: boolean;
  handler: () => void;
};

export const useKeyboardShortcut = ({
  key,
  metaKey = false,
  eventType = "keydown",
  enabled = true,
  handler,
}: Options) => {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: KeyboardEvent) => {
      const modifierMatches = metaKey ? event.metaKey || event.ctrlKey : true;

      if (event.key === key && modifierMatches) {
        handler();
      }
    };

    document.addEventListener(eventType, listener);

    return () => {
      document.removeEventListener(eventType, listener);
    };
  }, [key, metaKey, eventType, enabled, handler]);
};
