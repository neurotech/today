type ReadingTileProps = {
	url: string;
	title: string;
	score: string | number;
	time: string;
};

export const ReadingTile = ({ url, title, score, time }: ReadingTileProps) => (
	<a
		href={url}
		target="_blank"
		rel="noopener noreferrer"
		className="flex flex-row justify-between px-2 py-1 border-1 rounded-sm border-velvet-900/60 hover:border-velvet-900/85 bg-velvet-950/50 hover:bg-velvet-1100/20 transition-colors items-center"
		title={`${score} points・${time}`}
	>
		<h1 className="text-md font-bold text-velvet-400">{title}</h1>
		<aside className="text-sm text-velvet-800 italic min-w-45 text-right">
			{new URL(url).hostname}
		</aside>
	</a>
);
