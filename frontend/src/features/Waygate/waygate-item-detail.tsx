import { Captions, ClockFading, FileQuestion, Link } from "lucide-react";
import { Separator } from "../../components/ui/separator";
import type { WaygateItemResponse } from "../../types/waygate";
import { formatMetadata } from "./formatter";

export const WaygateItemDetail = ({ item }: { item: WaygateItemResponse }) => {
  const { created, formattedUrl } = formatMetadata(item);

  return (
    <a
      className="mt-4 flex items-start justify-between gap-4 rounded-sm border border-zinc-600 bg-zinc-700/60 p-2 hover:bg-zinc-700/90"
      href={item.item}
      target="_blank"
      rel="noopener"
    >
      <div className="flex flex-1 flex-col gap-2">
        <h1 className="flex flex-row items-center gap-2 font-medium text-zinc-200">
          <Captions size={16} /> {item.title}
        </h1>
        <Separator />
        <h2 className="flex flex-row items-center gap-2 font-mono font-medium text-zinc-400">
          <Link size={14} /> {formattedUrl}
        </h2>
        <h3 className="flex flex-row items-center gap-2 text-sm text-zinc-500">
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
