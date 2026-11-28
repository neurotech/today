import { formatDistanceToNowStrict } from "date-fns";
import { Card } from "../components/ui/card";
import { useFetch } from "../hooks/useFetch";
import { TvMinimalPlay } from "lucide-react";

type YouTubeVideo = {
  id: string;
  title: string;
  link: {
    "@_href": string;
  };
  "media:group": {
    "media:thumbnail": {
      "@_url": string;
    };
  };
  published: string;
};

type YouTubeResponse = {
  feed: {
    author: {
      name: string;
    };
    entry: YouTubeVideo[];
  };
};

export const YouTube = () => {
  const { data, loading } = useFetch<YouTubeResponse[]>({
    url: "/api/youtube",
  });
  const channels = data?.map((c) => ({
    channel: c.feed?.author?.name,
    videos: c.feed?.entry?.slice(0, 5).map((i) => ({
      id: i.id,
      title: i.title,
      link: i.link["@_href"],
      thumbnail: i["media:group"]["media:thumbnail"]["@_url"],
      published: i.published,
    })),
  }));

  if (loading) return <>Loading...</>;

  return (
    <div className="grid w-full grid-cols-4 gap-4">
      {channels?.map((c) => (
        <Card
          key={c.channel}
          headerTitle={c.channel}
          headerIcon={<TvMinimalPlay size={16} />}
          className="min-w-60 flex-0 self-start"
          containerClassName="gap-6 grid grid-cols-2 col-span-1"
        >
          {c.videos.map((v) => (
            <div key={v.id} className="group">
              <a href={v.link} target="_blank">
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="h-26 w-46 rounded-md border border-zinc-600 object-cover"
                />
                <h1 className="font-semibold text-zinc-400 transition-colors group-hover:text-zinc-50">
                  {v.title}
                </h1>
              </a>
              <h2 className="text-xs">
                {formatDistanceToNowStrict(v.published, { addSuffix: true })}
              </h2>
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
};
