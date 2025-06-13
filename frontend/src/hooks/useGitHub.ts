import { useEffect } from "react";
import { useFetch } from "./useFetch";
import { getUrlPrefix } from "../utils/getUrlPrefix";

type GitHubDetail = {
	repo_name: string;
	repo_owner: string;
	description: string;
	language: string | null;
	stars: string;
	url: string;
};

export const useGitHub = () => {
	const { data, loading, error, getURL } = useFetch<GitHubDetail[]>();

	useEffect(() => {
		getGitHubTrending();
	}, []);

	const getGitHubTrending = async () => getURL(`${getUrlPrefix()}api/github`);

	return { data, loading, error, getGitHubTrending };
};
