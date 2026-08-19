export type LobstersStory = {
  shortId: string;
  title: string;
  url: string;
  score: number;
  createdAt: string;
  commentsUrl: string;
};

export const LOBSTERS_TAG = "lobsters";

type LobstersApiStory = {
  short_id: string;
  title: string;
  url: string;
  score: number;
  created_at: string;
  comments_url: string;
};

export const getLobsters = async (): Promise<LobstersStory[]> => {
  const response = await fetch("https://lobste.rs/hottest.json", {
    next: { revalidate: 900, tags: [LOBSTERS_TAG] },
  });

  if (!response.ok) {
    throw new Error(`Lobsters returned ${response.status}`);
  }

  const stories = (await response.json()) as LobstersApiStory[];

  return stories.map((story) => ({
    shortId: story.short_id,
    title: story.title,
    // Text-only submissions have an empty url and link to their comments.
    url: story.url === "" ? story.comments_url : story.url,
    score: story.score,
    createdAt: story.created_at,
    commentsUrl: story.comments_url,
  }));
};
