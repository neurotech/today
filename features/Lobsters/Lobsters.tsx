import { formatDistanceToNowStrict } from "date-fns";
import { Panel } from "@/components/Panel";
import { refreshLobsters } from "@/lib/actions";
import { getLobsters } from "@/lib/sources/lobsters";
import { LobstersPanel } from "./LobstersPanel";

export const Lobsters = async () => {
  try {
    const stories = await getLobsters();

    return (
      <LobstersPanel
        refresh={refreshLobsters}
        stories={stories.map((story) => ({
          shortId: story.shortId,
          url: story.url,
          title: story.title,
          score: story.score,
          time: formatDistanceToNowStrict(new Date(story.createdAt), {
            addSuffix: true,
          }),
        }))}
      />
    );
  } catch (error) {
    return (
      <Panel
        heading="Lobsters"
        error={(error as Error).message}
        content={null}
      />
    );
  }
};
