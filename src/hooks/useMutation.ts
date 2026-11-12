import { useCallback, useState } from "react";

type Method = "POST" | "PUT" | "PATCH" | "DELETE";

type MutationOptions<TVariables> = {
  body?: (variables: TVariables) => unknown;
};

export const useMutation = <TVariables = void, TData = void>(
  method: Method,
  path: string | ((variables: TVariables) => string),
  options: MutationOptions<TVariables> = {},
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { body } = options;

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData> => {
      setLoading(true);
      setError(null);

      try {
        const target = typeof path === "function" ? path(variables) : path;
        const payload = body ? body(variables) : variables;
        const hasBody = method !== "DELETE" && payload !== undefined;

        const response = await fetch(target, {
          method,
          headers: hasBody ? { "Content-Type": "application/json" } : undefined,
          body: hasBody ? JSON.stringify(payload) : undefined,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // A 204 has no body, so callers must use a TData that allows undefined (e.g. void).
        // oxlint-disable-next-line typescript/no-unsafe-type-assertion
        if (response.status === 204) return undefined as TData;

        const data: TData = await response.json();
        return data;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [method, path, body],
  );

  return { mutate, loading, error };
};
