"use client";

import { useState } from "react";
import { MoreLessButton } from "@/components/Buttons/MoreLessButton";
import { HorizontalRule } from "@/components/HorizontalRule";
import { Panel } from "@/components/Panel";
import { ReadingTile } from "@/components/ReadingTile";
import { RefreshAction } from "@/components/RefreshAction";

/** Times are preformatted on the server to avoid a hydration mismatch. */
export type LobstersItem = {
  shortId: string;
  url: string;
  title: string;
  score: number;
  time: string;
};

type LobstersPanelProps = {
  stories: LobstersItem[];
  refresh: () => Promise<void>;
};

const VISIBLE = 16;

export const LobstersPanel = ({ stories, refresh }: LobstersPanelProps) => {
  const [showMore, setShowMore] = useState(false);
  const hidden = Math.max(0, stories.length - VISIBLE);

  return (
    <Panel
      heading="Lobsters"
      headingRight={<RefreshAction action={refresh} />}
      content={
        <div className="flex flex-col gap-2">
          {stories
            .slice(0, showMore ? stories.length : VISIBLE)
            .map((story) => (
              <ReadingTile
                key={story.shortId}
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
