import { useEffect, useState } from "react";

interface HackerNewsStory {
  id: number;
  title: string;
  url: string;
  score: number;
  time: number;
  text: string;
}

interface FetchStoriesOptions {
  start?: number;
  end?: number;
}

export const useHackerNews = () => {
  const [stories, setStories] = useState<HackerNewsStory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Getting on mount only.
  useEffect(() => {
    getStories();
  }, []);

  const getStories = async (options: FetchStoriesOptions = {}) => {
    const { start = 0, end = 10 } = options;

    try {
      setLoading(true);

      // Fetch top story IDs
      const response = await fetch(
        "https://hacker-news.firebaseio.com/v0/topstories.json",
      );
      const storyIds: number[] = await response.json();

      // Get first x story IDs
      const ids = storyIds.slice(start, end);

      // Fetch details for each story
      const storyPromises = ids.map((id) =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
          (res) => res.json(),
        ),
      );

      const storyDetails = await Promise.all(storyPromises);
      setStories(
        storyDetails.map((s) => ({
          id: s.id,
          title: s.title,
          url: s.url,
          score: s.score,
          time: s.time,
          text: s.text,
        })),
      );
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  return { stories, loading, error, getStories };
};
