"use client";

import { useState } from "react";
import { MoreLessButton } from "@/components/Buttons/MoreLessButton";
import { HorizontalRule } from "@/components/HorizontalRule";
import { Panel } from "@/components/Panel";
import { ReadingTile } from "@/components/ReadingTile";
import { RefreshAction } from "@/components/RefreshAction";

/** Times are preformatted on the server to avoid a hydration mismatch. */
export type HackerNewsItem = {
  id: number;
  url: string;
  title: string;
  score: number;
  time: string;
};

type HackerNewsPanelProps = {
  stories: HackerNewsItem[];
  refresh: () => Promise<void>;
};

const VISIBLE = 10;

export const HackerNewsPanel = ({ stories, refresh }: HackerNewsPanelProps) => {
  const [showMore, setShowMore] = useState(false);
  const hidden = Math.max(0, stories.length - VISIBLE);

  return (
    <Panel
      heading="Hacker News"
      headingRight={<RefreshAction action={refresh} />}
      content={
        <div className="flex flex-col gap-2">
          {stories
            .slice(0, showMore ? stories.length : VISIBLE)
            .map((story) => (
              <ReadingTile
                key={story.id}
                url={story.url}
                title={story.title}
                score={story.score}
                time={story.time}
              />
            ))}
        </div>
      }
      footer={
        hidden > 0 && (
          <>
            <HorizontalRule />
            <MoreLessButton
              showMore={showMore}
              itemCount={hidden}
              onClick={() => setShowMore((p) => !p)}
            />
          </>
        )
      }
    />
  );
};
