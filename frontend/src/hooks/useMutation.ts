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

	// biome-ignore lint/correctness/useExhaustiveDependencies: <Leaving it in the deps would make mutate change every render, which defeats useCallback and would retrigger any effect that depends on mutate>
	const mutate = useCallback(
		async (variables: TVariables): Promise<TData> => {
			setLoading(true);
			setError(null);

			try {
				const target = typeof path === "function" ? path(variables) : path;
				const payload = options.body ? options.body(variables) : variables;
				const hasBody = method !== "DELETE" && payload !== undefined;

				const response = await fetch(target, {
					method,
					headers: hasBody ? { "Content-Type": "application/json" } : undefined,
					body: hasBody ? JSON.stringify(payload) : undefined,
				});

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				if (response.status === 204) return undefined as TData;

				return (await response.json()) as TData;
			} catch (err) {
				const e = err instanceof Error ? err : new Error(String(err));
				setError(e);
				throw e;
			} finally {
				setLoading(false);
			}
		},
		[method],
	);

	return { mutate, loading, error };
};
