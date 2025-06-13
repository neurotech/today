import { Separator } from "./Separator";

type ReadingTileProps = {
	url: string;
	title: string;
	score: string | number;
	time: string;
};

export const ReadingTile = ({ url, title, score, time }: ReadingTileProps) => (
	<div>
		<h3 className="text-md font-extrabold">
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="text-velvet-400 hover:text-velvet-100 transition-colors"
			>
				{title}
			</a>
		</h3>
		<h4 className="text-sm">
			<span className="text-velvet-600 font-semibold">{time}</span>
			<Separator />
			<span className="text-velvet-700">{score} points</span>
			<Separator />
			<span className="text-velvet-800 italic">{new URL(url).hostname}</span>
		</h4>
	</div>
);
