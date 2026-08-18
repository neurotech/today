"use client";

import { StarIcon } from "@heroicons/react/24/outline";
import { HorizontalRule } from "@/components/HorizontalRule";
import { Panel } from "@/components/Panel";
import { RefreshAction } from "@/components/RefreshAction";
import type { GitHubRepo } from "@/lib/sources/github";

type GitHubPanelProps = {
  repos: GitHubRepo[];
  refresh: () => Promise<void>;
};

export const GitHubPanel = ({ repos, refresh }: GitHubPanelProps) => {
  return (
    <Panel
      heading="GitHub Trending"
      headingRight={<RefreshAction action={refresh} />}
      content={
        <div className="flex flex-col gap-2">
          {repos.map((repo) => (
            <a
              key={`${repo.repoName}-${repo.repoOwner}`}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="border rounded-sm border-velvet-900/60 hover:border-velvet-950/75 bg-velvet-950/50 hover:bg-velvet-1100/20 transition-colors"
            >
              <section className="flex flex-col gap-1.5 p-2">
                <header className="flex justify-between gap-4 leading-none">
                  <h3 className="text-md font-bold text-velvet-400">
                    {repo.repoName}
                    <span className="text-velvet-900 font-normal"> by </span>
                    {repo.repoOwner}
                  </h3>
                  <div className="text-sm font-mono flex items-center text-velvet-600">
                    {repo.stars}
                    <StarIcon className="size-5 ml-1.5 text-velvet-800" />
                  </div>
                </header>
                <HorizontalRule />
                <div className="grid grid-cols-[1fr_120px] gap-1">
                  <p className="text-sm text-velvet-500">{repo.description}</p>
                  <div className="bg-velvet-900/80 text-velvet-300 border border-transparent rounded-xs text-xs px-1 py-0.5 text-center font-bold w-fit self-end justify-self-end">
                    {repo.language || "None"}
                  </div>
                </div>
              </section>
            </a>
          ))}
        </div>
      }
    />
  );
};
