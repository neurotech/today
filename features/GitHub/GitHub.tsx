import { Panel } from "@/components/Panel";
import { refreshGitHub } from "@/lib/actions";
import { getGitHubTrending } from "@/lib/sources/github";
import { GitHubPanel } from "./GitHubPanel";

export const GitHub = async () => {
  try {
    const repos = await getGitHubTrending();

    return <GitHubPanel repos={repos} refresh={refreshGitHub} />;
  } catch (error) {
    // Matches the old UX: a failed source shows an error inside its own panel
    // rather than taking down the page.
    return (
      <Panel
        heading="GitHub Trending"
        error={(error as Error).message}
        content={null}
      />
    );
  }
};
