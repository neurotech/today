import { use } from "react";
import { ConfigContext, type ConfigData } from "../../context/config-context";
import { Card } from "../../components/ui/card";
import { WeatherConfigForm } from "./weather-config-form";
import { YouTubeForm } from "./youtube/youtube-config-form";

export const Configuration = () => {
  const { config, loading, error } = use(ConfigContext);

  if (loading) return <Card>Loading…</Card>;
  if (error) return <Card>Couldn't load configuration ({error.message})</Card>;

  return <ConfigurationForm config={config} />;
};

const ConfigurationForm = ({ config }: { config: ConfigData }) => {
  return (
    <>
      <div className="flex flex-1 flex-col gap-4">
        <h1 className="text-lg text-white">Configuration</h1>
        <div className="grid grid-cols-3 gap-4">
          <WeatherConfigForm config={config} />
          <YouTubeForm config={config} />
        </div>
      </div>
    </>
  );
};
