import { useEffect, useState } from "react";
import { useFetch } from "./useFetch";

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
	const { data, loading, error, getURL } = useFetch<GitHubDetail[]>();

	useEffect(() => {
		getGitHubTrending();
	}, []);

	const getGitHubTrending = async () => getURL(`${urlPrefix}api/github`);

	return { data, loading, error, getGitHubTrending };
};
