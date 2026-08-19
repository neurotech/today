type ReadingTileProps = {
  url: string;
  title: string;
  score: string | number;
  time: string;
};

/**
 * `new URL()` throws on a malformed URL, so calling it bare during render would
 * let one bad item from Lobsters or Hacker News take down the whole list.
 */
const getHostname = (url: string): string | null => {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
};

export const ReadingTile = ({ url, title, score, time }: ReadingTileProps) => {
  const hostname = getHostname(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-row justify-between px-2 py-1 border rounded-sm border-zinc-700/60 hover:border-zinc-800/75 bg-zinc-800/50 hover:bg-zinc-950/20 transition-colors items-center"
      title={`${score} points・${time}`}
    >
      {/* h3, under the Panel's h2. Tailwind's preflight resets heading sizes to
          inherit, so the level carries no visual weight of its own. */}
      <h3 className="text-md font-bold text-zinc-400">{title}</h3>
      {hostname && (
        <aside className="text-sm text-zinc-700 italic min-w-45 text-right">
          {hostname}
        </aside>
      )}
    </a>
  );
};
