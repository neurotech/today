import { useState } from "react";

export const useFetch = <T>() => {
	const [data, setData] = useState<T[] | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const postURL = async (url: string, body: T) => {
		setLoading(true);

		fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((json) => {
				setData(json);
				setError(null);
			})
			.catch((err) => {
				setError(err.message);
				setData(null);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const getURL = async (url: string) => {
		setLoading(true);

		fetch(url)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((json) => {
				setData(json);
				setError(null);
			})
			.catch((err) => {
				setError(err.message);
				setData(null);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const patchURL = async (url: string, body: T) => {
		setLoading(true);

		fetch(url, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((json) => {
				setData(json);
				setError(null);
			})
			.catch((err) => {
				setError(err.message);
				setData(null);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const deleteURL = async (url: string) => {
		setLoading(true);

		fetch(url, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((json) => {
				setData(json);
				setError(null);
			})
			.catch((err) => {
				setError(err.message);
				setData(null);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return { data, loading, error, postURL, getURL, patchURL, deleteURL };
};
