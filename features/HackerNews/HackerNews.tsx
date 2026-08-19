import { formatDistanceToNowStrict } from "date-fns";
import { Panel } from "@/components/Panel";
import { refreshHackerNews } from "@/lib/actions";
import { getHackerNews } from "@/lib/sources/hackernews";
import { HackerNewsPanel } from "./HackerNewsPanel";

export const HackerNews = async () => {
  try {
    const stories = await getHackerNews();

    return (
      <HackerNewsPanel
        refresh={refreshHackerNews}
        stories={stories.map((story) => ({
          id: story.id,
          url: story.url,
          title: story.title,
          score: story.score,
          time: formatDistanceToNowStrict(new Date(story.time * 1000), {
            addSuffix: true,
          }),
        }))}
      />
    );
  } catch (error) {
    return (
      <Panel
        heading="Hacker News"
        error={(error as Error).message}
        content={null}
      />
    );
  }
};
