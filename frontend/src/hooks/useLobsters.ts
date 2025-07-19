import { useEffect } from "react";
import { getUrlPrefix } from "../utils/getUrlPrefix";
import { useFetch } from "./useFetch";

type LobstersData = {
  short_id: string;
  created_at: string;
  title: string;
  url: string;
  score: number;
  flags: number;
  comment_count: number;
  description: string;
  description_plain: string;
  submitter_user: string;
  user_is_author: boolean;
  tags: string[];
  short_id_url: string;
  comments_url: string;
};

export const useLobsters = () => {
  const { data, loading, error, getURL } = useFetch<
    LobstersData,
    LobstersData[]
  >();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Getting on mount only.
  useEffect(() => {
    getLobsters();
  }, []);

  const getLobsters = async () => getURL(`${getUrlPrefix()}api/lobsters`);

  return { data, loading, error, getLobsters };
};
