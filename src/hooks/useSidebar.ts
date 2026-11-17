import { useCallback, useEffect, useState } from "react";

const EXPANDED_KEY = "TODAY_EXPANDED";

const useLocalStorageState = <T>(key: string, initial: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return raw === null ? initial : (JSON.parse(raw) as T);
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  return [value, setValue] as const;
};

export const useSidebar = () => {
  const [expanded, setExpanded] = useLocalStorageState(EXPANDED_KEY, true);
  const toggle = useCallback(() => setExpanded((e) => !e), [setExpanded]);

  return { expanded, setExpanded, toggle };
};
