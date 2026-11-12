import { FileQuestion, Trash } from "lucide-react";
import { use } from "react";
import { DialogContext } from "../../context/dialog-context";
import { useMutation } from "../../hooks/useMutation";
import type { WaygateItemResponse } from "../../types/waygate";
import { formatMetadata } from "./formatter";
import { WaygateItemDetail } from "./waygate-item-detail";

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
  const { setDialog } = use(DialogContext);
  const remove = useMutation<string, void>("DELETE", (id) =>
    apiUrl(`/items/${id}`),
  );

  const { created, formattedUrl } = formatMetadata(item);

  return (
    <div className="flex w-full items-center justify-between gap-px">
      <button
        type="button"
        className="cursor-pointer rounded-l-sm bg-zinc-700/40 p-1.5 transition-colors hover:bg-rose-500 hover:text-black/90"
        onClick={async () => {
          setDialog({
            open: true,
            title: "Delete Waygate Item",
            message: "Are you sure you want to delete this item?",
            body: <WaygateItemDetail item={item} />,
            onConfirm: async () => {
              await remove.mutate(item.id.toString());
              refetch();
            },
          });
        }}
      >
        <Trash size={12} />
      </button>
      <div className="flex w-full cursor-pointer flex-row items-center gap-2 rounded-r-sm bg-zinc-700/40 p-1 text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white">
        <a
          className="flex w-full items-center gap-2"
          title={created}
          href={item.item}
          target="_blank"
          rel="noopener"
        >
          {item.favicon ? (
            <img src={item.favicon} alt="Favicon" className="size-3 shrink-0" />
          ) : (
            <FileQuestion size={11} className="text-zinc-500" />
          )}
          <div className="grid w-full grid-cols-6 items-center">
            <span className="col-span-4 truncate text-left text-xs font-medium">
              {item.title}
            </span>
            <span className="col-span-2 truncate text-right font-mono text-xs text-ellipsis opacity-60">
              {formattedUrl}
            </span>
          </div>
        </a>
      </div>
    </div>
  );
};
