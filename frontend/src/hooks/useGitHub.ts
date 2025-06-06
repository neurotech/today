import { useEffect, useState } from "react";

type GitHubDetail = {
	repo_name: string;
	repo_owner: string;
	description: string;
	language: string | null;
	stars: string;
	url: string;
};

const urlPrefix =
	import.meta.env.MODE === "development" ? "http://slab:7000/" : "/";

export const useGitHub = () => {
	const [data, setData] = useState<GitHubDetail[] | null>();
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		getCurrencyData();
	}, []);

	const getCurrencyData = async () => {
		setLoading(true);

		fetch(`${urlPrefix}api/github`)
			.then((response) => {
				if (!response.ok) throw new Error("Network response was not ok");
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

	return { data, loading, error, getCurrencyData };
};
