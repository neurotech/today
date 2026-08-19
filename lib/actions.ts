"use server";

import { updateTag } from "next/cache";
import { GITHUB_TAG } from "./sources/github";
import { HACKER_NEWS_TAG } from "./sources/hackernews";
import { LOBSTERS_TAG } from "./sources/lobsters";

// These replace the client-side refetch that the old `RefreshButton` triggered
// through useFetch. Expiring the tag is the whole implementation; Next
// re-renders the Server Component with fresh data.
//
// `updateTag`, not `revalidateTag`. In Next 16 `revalidateTag` takes a second
// cacheLife argument and expires lazily; `updateTag` is the Server-Action-only
// form that expires immediately with read-your-own-writes semantics, which is
// what a refresh button means.

export const refreshGitHub = async () => {
  updateTag(GITHUB_TAG);
};

export const refreshLobsters = async () => {
  updateTag(LOBSTERS_TAG);
};

export const refreshHackerNews = async () => {
  updateTag(HACKER_NEWS_TAG);
};
