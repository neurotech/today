import { useCallback, useEffect, useState } from "react";

type Result<T> = {
  url: string;
  attempt: number;
  data: T | null;
  error: Error | null;
};

type UseFetchProps = {
  url?: string;
};

export const useFetch = <T>({ url }: UseFetchProps) => {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Result<T> | null>(null);
  const refetch = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    if (!url) return undefined;

    const controller = new AbortController();

    const run = async () => {
      try {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: T = await response.json();
        setResult({ url, attempt, data, error: null });
      } catch (err) {
        if (controller.signal.aborted) return;
        setResult({
          url,
          attempt,
          data: null,
          error: err instanceof Error ? err : new Error(String(err)),
        });
      }
    };

    void run();

    return () => controller.abort();
  }, [url, attempt]);

  const settled =
    result !== null && result.url === url && result.attempt === attempt;

  return {
    data: result?.data ?? null,
    loading: Boolean(url) && !settled,
    error: settled ? result.error : null,
    refetch,
  };
};
