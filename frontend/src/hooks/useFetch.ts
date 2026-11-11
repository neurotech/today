import { useCallback, useEffect, useState } from "react";

type FetchState<T> = {
	data: T | null;
	loading: boolean;
	error: Error | null;
};

type useFetchProps = {
	url?: string;
};

export const useFetch = <T>({ url }: useFetchProps) => {
	const [state, setState] = useState<FetchState<T>>({
		data: null,
		loading: url !== null,
		error: null,
	});

	const [refetchCount, setRefetchCount] = useState(0);
	const refetch = useCallback(() => setRefetchCount((n) => n + 1), []);

	useEffect(() => {
		if (!url) return;

		void refetchCount;

		const controller = new AbortController();

		setState((prev) => ({ ...prev, loading: true, error: null }));

		const run = async () => {
			try {
				const response = await fetch(url, {
					signal: controller.signal,
					headers: { "Content-Type": "application/json" },
				});

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const data = (await response.json()) as T;
				setState({ data, loading: false, error: null });
			} catch (err) {
				if (controller.signal.aborted) return;
				setState({
					data: null,
					loading: false,
					error: err instanceof Error ? err : new Error(String(err)),
				});
			}
		};

		run();

		return () => controller.abort();
	}, [url, refetchCount]);

	return { ...state, refetch };
};
