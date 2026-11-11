import { format } from "date-fns/format";
import { Trash } from "lucide-react";
import { useMutation } from "../../hooks/useMutation";
import type { WaygateItemResponse } from "../../types/waygate";

const apiUrl = (path: string) => {
	const url = new URL(path, window.location.href);
	url.port = "8008";

	return url.toString();
};

export const WaygateItem = ({
	item,
	refetch,
}: {
	item: WaygateItemResponse;
	refetch: () => void;
}) => {
	const remove = useMutation<string, void>("DELETE", (id) =>
		apiUrl(`/items/${id}`),
	);

	const created = format(item.createdAt, "Mo MMM RRRR 'at' h:mm a");
	const url = new URL(item.item);
	const formattedUrl = `${url.hostname}${url.pathname ? url.pathname : ""}`;

	return (
		<div className="flex items-center justify-between gap-px w-full">
			<button
				type="button"
				className="cursor-pointer rounded-l-sm p-1.5 bg-zinc-700/40 hover:bg-rose-500 hover:text-black/90 transition-colors"
				onClick={async () => {
					await remove.mutate(item.id.toString());
					refetch();
				}}
			>
				<Trash size={12} />
			</button>
			<div className="flex flex-row w-full items-center gap-2 p-1 rounded-r-sm bg-zinc-700/40 text-zinc-300 hover:bg-zinc-700 hover:text-white cursor-pointer transition-colors">
				<a
					className="flex w-full items-center gap-2"
					title={created}
					href={item.item}
					target="_blank"
					rel="noopener"
				>
					{item.favicon && (
						<img src={item.favicon} alt="Favicon" className="size-3 shrink-0" />
					)}
					<div className="grid w-full grid-cols-6 items-center">
						<span className="col-span-4 truncate text-left font-medium text-xs">
							{item.title}
						</span>
						<span className="col-span-2 truncate text-ellipsis text-right font-mono text-xs opacity-60">
							{formattedUrl}
						</span>
					</div>
				</a>
			</div>
		</div>
	);
};
