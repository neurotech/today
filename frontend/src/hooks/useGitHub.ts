import { useEffect } from "react";
import { getUrlPrefix } from "../utils/getUrlPrefix";
import { useFetch } from "./useFetch";

type GitHubDetail = {
  repo_name: string;
  repo_owner: string;
  description: string;
  language: string | null;
  stars: string;
  url: string;
};

export const useGitHub = () => {
  const { data, loading, error, getURL } = useFetch<
    GitHubDetail,
    GitHubDetail[]
  >();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Getting on mount only.
  useEffect(() => {
    getGitHubTrending();
  }, []);

  const getGitHubTrending = async () => getURL(`${getUrlPrefix()}api/github`);

  return { data, loading, error, getGitHubTrending };
};
