type ReadingTileProps = {
  url: string;
  title: string;
  score: string | number;
  time: string;
};

/**
 * `new URL()` throws on a malformed URL. The old SPA called it bare during
 * render, so one bad item from Lobsters or Hacker News would take down the
 * whole list.
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
      className="flex flex-row justify-between px-2 py-1 border rounded-sm border-velvet-900/60 hover:border-velvet-950/75 bg-velvet-950/50 hover:bg-velvet-1100/20 transition-colors items-center"
      title={`${score} points・${time}`}
    >
      {/* h3, under the Panel's h2. Was an h1, which put a second and third
          top-level heading on every page. Tailwind's preflight resets heading
          sizes to inherit, so the level carries no visual weight of its own. */}
      <h3 className="text-md font-bold text-velvet-400">{title}</h3>
      {hostname && (
        <aside className="text-sm text-velvet-800 italic min-w-45 text-right">
          {hostname}
        </aside>
      )}
    </a>
  );
};
