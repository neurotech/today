import { TvMinimalPlay } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { TextInput } from "../../../components/ui/text-input";
import {
  ConfigContext,
  type ConfigData,
  type YouTubeConfig,
} from "../../../context/config-context";
import { Button } from "../../../components/ui/button";
import { use, useState } from "react";
import { Separator } from "../../../components/ui/separator";
import { useMutation } from "../../../hooks/useMutation";
import { YouTubeChannelItem } from "./youtube-channel-item";

export const YouTubeForm = ({ config }: { config: ConfigData }) => {
  const { refetch } = use(ConfigContext);
  const { mutate: updateYouTube, loading: updating } = useMutation<string>(
    "PUT",
    "/api/config/youtube",
  );

  const [youTubeItems, setYouTubeItems] = useState<YouTubeConfig[]>(
    config.youtube ?? [],
  );
  const [showNewItem, setShowNewItem] = useState(false);
  const [newItem, setNewItem] = useState<YouTubeConfig>({
    channelName: "",
    channelUrl: "",
  });

  const handleAdd = () => setShowNewItem(true);

  const handleSave = async () => {
    if (showNewItem) {
      await updateYouTube(JSON.stringify([...youTubeItems, newItem]));
      setYouTubeItems((p) => [...p, newItem]);
    } else {
      await updateYouTube(JSON.stringify(youTubeItems));
    }

    refetch();

    setShowNewItem(false);
    setNewItem({
      channelName: "",
      channelUrl: "",
    });
  };

  const handleDelete = async (channelName: string) => {
    const filtered = youTubeItems.filter((i) => i.channelName !== channelName);
    setYouTubeItems(filtered);
    await updateYouTube(JSON.stringify(filtered));
    refetch();
  };

  return (
    <Card
      headerTitle="YouTube"
      headerIcon={<TvMinimalPlay size={16} />}
      footer={
        <div className="flex flex-1 justify-between">
          <Button onClick={handleAdd}>Add</Button>
          <Button variant="emerald" onClick={handleSave} disabled={updating}>
            Save
          </Button>
        </div>
      }
      className="col-span-2 flex-0 self-start"
      containerClassName="flex flex-col gap-4"
    >
      {!showNewItem && youTubeItems.length === 0 ? (
        <div className="p-2 text-center select-none">
          No channels configured.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {showNewItem ? (
            <div className="grid flex-1 grid-cols-3 gap-2">
              <TextInput
                placeholder="Channel Name"
                valid
                containerClassName="flex-1 col-span-1"
                value={newItem.channelName}
                onChange={(e) =>
                  setNewItem((p) => ({
                    ...p,
                    channelName: e.target.value,
                  }))
                }
              />
              <TextInput
                placeholder="Channel URL"
                valid
                containerClassName="flex-1 col-span-2"
                value={newItem.channelUrl}
                onChange={(e) =>
                  setNewItem((p) => ({
                    ...p,
                    channelUrl: e.target.value,
                  }))
                }
              />
              {youTubeItems.length > 0 ? (
                <Separator className="col-span-3" />
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            {youTubeItems.map((item) => (
              <YouTubeChannelItem
                key={item.channelName}
                channel={item}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
