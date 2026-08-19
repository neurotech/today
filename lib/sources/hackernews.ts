export type HackerNewsStory = {
  id: number;
  title: string;
  url: string;
  score: number;
  time: number;
};

export const HACKER_NEWS_TAG = "hackernews";

const API = "https://hacker-news.firebaseio.com/v0";

// The old client-side hook fetched 10 stories then did `stories.slice(10)` to
// decide whether to show the "more" footer, which was always empty. Fetching 20
// and slicing at 10 is what it was meant to do.
const STORY_COUNT = 20;

type HackerNewsApiItem = {
  id: number;
  title?: string;
  url?: string;
  score?: number;
  time?: number;
} | null;

export const getHackerNews = async (): Promise<HackerNewsStory[]> => {
  const response = await fetch(`${API}/topstories.json`, {
    next: { revalidate: 900, tags: [HACKER_NEWS_TAG] },
  });

  if (!response.ok) {
    throw new Error(`Hacker News returned ${response.status}`);
  }

  const ids = (await response.json()) as number[];

  // This N+1 used to run in the browser, so every visitor paid for ~11 serial
  // round trips. On the server each item is cached independently.
  const items = await Promise.all(
    ids.slice(0, STORY_COUNT).map(async (id) => {
      const item = await fetch(`${API}/item/${id}.json`, {
        next: { revalidate: 900, tags: [HACKER_NEWS_TAG] },
      });

      return item.ok ? ((await item.json()) as HackerNewsApiItem) : null;
    }),
  );

  return items.flatMap((item) => {
    // Deleted and dead items come back as null or without a title.
    if (!item?.title) {
      return [];
    }

    return [
      {
        id: item.id,
        // Ask HN and similar have no url; fall back to the comments page.
        url: item.url ?? `https://news.ycombinator.com/item?id=${item.id}`,
        title: item.title,
        score: item.score ?? 0,
        time: item.time ?? 0,
      },
    ];
  });
};
