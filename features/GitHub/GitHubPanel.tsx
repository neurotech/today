"use client";

import { StarIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { MoreLessButton } from "@/components/Buttons/MoreLessButton";
import { HorizontalRule } from "@/components/HorizontalRule";
import { Panel } from "@/components/Panel";
import { RefreshAction } from "@/components/RefreshAction";
import type { GitHubRepo } from "@/lib/sources/github";

type GitHubPanelProps = {
  repos: GitHubRepo[];
  refresh: () => Promise<void>;
};

const VISIBLE = 5;

export const GitHubPanel = ({ repos, refresh }: GitHubPanelProps) => {
  const [showMore, setShowMore] = useState(false);
  // The old version showed 5, expanded to a hardcoded 10, but labelled the
  // footer with `length - 5`. With 14 repos it read "and 9 more" then revealed
  // 5. Expanding now shows everything the label promised, matching Lobsters and
  // Hacker News.
  const hidden = repos.slice(VISIBLE).length;

  return (
    <Panel
      heading="GitHub Trending"
      headingRight={<RefreshAction action={refresh} />}
      content={
        <div className="flex flex-col gap-2">
          {repos.slice(0, showMore ? repos.length : VISIBLE).map((repo) => (
            <a
              key={`${repo.repoName}-${repo.repoOwner}`}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="border-1 rounded-sm border-velvet-900/60 hover:border-velvet-950/75 bg-velvet-950/50 hover:bg-velvet-1100/20 transition-colors"
            >
              <section className="flex flex-col gap-1.5 p-2">
                <header className="flex justify-between gap-4 leading-none">
                  <h1 className="text-md font-bold text-velvet-400">
                    {repo.repoName}
                    <span className="text-velvet-900 font-normal"> by </span>
                    {repo.repoOwner}
                  </h1>
                  <div className="text-sm font-mono flex items-center text-velvet-600">
                    {repo.stars}
                    <StarIcon className="size-5 ml-1.5 text-velvet-800" />
                  </div>
                </header>
                <HorizontalRule />
                {/* Was <main>, but the layout already has one and a document
                    may only contain a single main landmark. */}
                <div className="grid grid-cols-[1fr_120px] gap-1">
                  <h2 className="text-sm text-velvet-500">
                    {repo.description}
                  </h2>
                  <div className="bg-velvet-900/80 text-velvet-300 border-1 border-transparent rounded-xs text-xs px-1 py-0.5 text-center font-bold w-fit self-end justify-self-end">
                    {repo.language || "None"}
                  </div>
                </div>
              </section>
            </a>
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
