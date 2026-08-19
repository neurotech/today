import * as cheerio from "cheerio";

export type GitHubRepo = {
  repoName: string;
  repoOwner: string;
  description: string;
  language: string | null;
  stars: string;
  url: string;
};

export const GITHUB_TAG = "github";

/**
 * Trim, collapse whitespace, strip spaces entirely, then drop anything that is
 * not alphanumeric, a comma or a slash. Turns "\n  1,234  \n" into "1,234".
 */
const cleanStars = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, "")
    .replace(/[^a-zA-Z0-9,/]/g, "");

export const getGitHubTrending = async (): Promise<GitHubRepo[]> => {
  const response = await fetch("https://github.com/trending", {
    next: { revalidate: 3600, tags: [GITHUB_TAG] },
  });

  if (!response.ok) {
    throw new Error(`GitHub Trending returned ${response.status}`);
  }

  const $ = cheerio.load(await response.text());

  return $("article")
    .toArray()
    .flatMap((article) => {
      const element = $(article);
      const href = element.find("h2 a").attr("href");

      // The href is "/owner/repo", which is far less brittle than parsing the
      // anchor's text and splitting on " / ".
      const [, repoOwner, repoName] = (href ?? "").split("/");

      if (!repoOwner || !repoName) {
        return [];
      }

      const language = element
        .find('[itemprop="programmingLanguage"]')
        .first()
        .text()
        .trim();

      return [
        {
          repoName,
          repoOwner,
          description: element.find("p").first().text().trim(),
          language: language || null,
          stars: cleanStars(
            element.find('svg[aria-label="star"]').first().parent().text(),
          ),
          url: `https://github.com${href}`,
        },
      ];
    });
};
