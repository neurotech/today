import { Captions, ClockFading, FileQuestion, Link } from "lucide-react";
import { Separator } from "../../components/ui/separator";
import type { WaygateItemResponse } from "../../types/waygate";
import { formatMetadata } from "./formatter";

export const WaygateItemDetail = ({ item }: { item: WaygateItemResponse }) => {
	const { created, formattedUrl } = formatMetadata(item);

	return (
		<a
			className="mt-4 flex items-start justify-between gap-4 p-2 rounded-sm border border-zinc-600 bg-zinc-700/60 hover:bg-zinc-700/90"
			href={item.item}
			target="_blank"
			rel="noopener"
		>
			<div className="flex flex-col flex-1 gap-2">
				<h1 className="text-zinc-200 font-medium flex flex-row items-center gap-2">
					<Captions size={16} /> {item.title}
				</h1>
				<Separator />
				<h2 className="text-zinc-400 font-mono font-medium flex flex-row items-center gap-2">
					<Link size={14} /> {formattedUrl}
				</h2>
				<h3 className="text-zinc-500 text-sm flex flex-row items-center gap-2">
					<ClockFading size={14} /> {created}
				</h3>
			</div>

			<div>
				{item.favicon ? (
					<img src={item.favicon} alt="Favicon" className="size-12 shrink-0" />
				) : (
					<FileQuestion size={48} className="text-zinc-500" />
				)}
			</div>
		</a>
	);
};
