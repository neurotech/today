import { ThermometerSun } from "lucide-react";
import { Card } from "../../components/ui/card";
import { useFetch } from "../../hooks/useFetch";
import { cn } from "../../utils/cn";
import Radar from "./radar";

export type WeatherResponse = {
  town: string;
  sky_condition: string;
  min_temp_c: number;
  max_temp_c: number;
  storm_outlook: string | null;
};

export const Weather = ({
  town,
  weatherApiKey,
}: {
  town: string;
  weatherApiKey: string;
}) => {
  const { data, loading, error, refetch } = useFetch<WeatherResponse>({
    url: `/api/weather/${town.toLowerCase()}`,
    headers: {
      "X-API-Key": weatherApiKey,
    },
  });

  if (error) return <Card>Couldn't load weather ({error.message})</Card>;

  return (
    <Card
      className="max-w-104 min-w-104 flex-0 self-start"
      headerTitle={`Weather for ${town}`}
      headerIcon={
        <ThermometerSun
          size={16}
          className={cn("cursor-pointer", loading ? " text-amber-300" : "")}
          onClick={() => refetch()}
        />
      }
    >
      <div className="flex justify-between">
        <div className="flex flex-col gap-1 text-zinc-400">
          <p className="flex gap-1 text-2xl">
            <span className="text-blue-300">{data?.min_temp_c}°C</span>–
            <span className="text-rose-300">{data?.max_temp_c}°C</span>
          </p>
          <p className="text-xl text-zinc-300">{data?.sky_condition}</p>
          {data?.storm_outlook && (
            <p className="text-md text-zinc-400 italic">{data.storm_outlook}</p>
          )}
        </div>

        <div className="rounded-sm border border-zinc-950">
          <Radar />
        </div>
      </div>
    </Card>
  );
};
