import { Trash } from "lucide-react";
import type { YouTubeConfig } from "../../../context/config-context";

export const YouTubeChannelItem = ({
  channel,
  handleDelete,
}: {
  channel: YouTubeConfig;
  handleDelete: (channelName: string) => void;
}) => {
  return (
    <div className="flex">
      <div className="rounded-l-sm bg-indigo-900 p-1.5 font-mono text-sm text-indigo-50 select-none">
        {channel.channelName}
      </div>
      <div className="bg-indigo-950 p-1.5 font-mono text-sm text-indigo-200">
        {channel.channelUrl}
      </div>
      <button
        type="button"
        className="cursor-pointer rounded-r-sm bg-zinc-700 px-3 py-1 text-zinc-200 transition-colors hover:bg-rose-500 hover:text-black/90"
        onClick={() => handleDelete(channel.channelName)}
      >
        <Trash size={14} />
      </button>
    </div>
  );
};
