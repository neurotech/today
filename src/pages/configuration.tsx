import { ThermometerSun } from "lucide-react";
import { Card } from "../components/ui/card";
import { TextInput } from "../components/ui/text-input";
import { Button } from "../components/ui/button";
import { use, useCallback, useState } from "react";
import { ConfigContext, type ConfigData } from "../context/config-context";
import { useMutation } from "../hooks/useMutation";

export const Configuration = () => {
  const { config, loading, error } = use(ConfigContext);

  if (loading) return <Card>Loading…</Card>;
  if (error) return <Card>Couldn't load configuration ({error.message})</Card>;

  return <ConfigurationForm config={config} />;
};

const ConfigurationForm = ({ config }: { config: ConfigData }) => {
  const { refetch } = use(ConfigContext);
  const { mutate: updateTown } = useMutation<{ value: string }>(
    "PUT",
    "/api/config/town",
  );
  const { mutate: updateWeatherApiKey } = useMutation<{ value: string }>(
    "PUT",
    "/api/config/weatherapikey",
  );

  const [town, setTown] = useState(config.town ?? "");
  const [weatherAuApiKey, setWeatherAuApiKey] = useState(
    config.weatherapikey ?? "",
  );

  const handleSave = useCallback(async () => {
    await Promise.all([
      updateTown({ value: town }),
      updateWeatherApiKey({ value: weatherAuApiKey }),
    ]);
    refetch();
  }, [town, updateTown, weatherAuApiKey, updateWeatherApiKey, refetch]);

  return (
    <>
      <div className="flex flex-1 flex-col gap-4">
        <h1 className="text-lg text-white">Configuration</h1>
        <div className="grid grid-cols-3 gap-4">
          <Card
            headerTitle="Weather"
            headerIcon={<ThermometerSun size={16} />}
            className="col-span-1 flex-0 self-start"
            containerClassName="flex flex-col gap-4"
          >
            <TextInput
              label={"Town"}
              value={town}
              onChange={(e) => setTown(e.target.value)}
              valid={town !== ""}
            />
            <TextInput
              label={"WeatherAU API Key"}
              value={weatherAuApiKey}
              onChange={(e) => setWeatherAuApiKey(e.target.value)}
              valid={weatherAuApiKey !== ""}
            />
            <Button
              variant="emerald"
              className="flex-0 self-end"
              onClick={handleSave}
            >
              Save
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
};
