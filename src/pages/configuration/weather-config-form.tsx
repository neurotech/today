import { ThermometerSun } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { TextInput } from "../../components/ui/text-input";
import { use, useState, useCallback } from "react";
import { ConfigContext, type ConfigData } from "../../context/config-context";
import { useMutation } from "../../hooks/useMutation";

export const WeatherConfigForm = ({ config }: { config: ConfigData }) => {
  const { refetch } = use(ConfigContext);
  const { mutate: updateTown } = useMutation<string>("PUT", "/api/config/town");
  const { mutate: updateWeatherApiKey } = useMutation<string>(
    "PUT",
    "/api/config/weatherapikey",
  );

  const [town, setTown] = useState(config.town ?? "");
  const [weatherAuApiKey, setWeatherAuApiKey] = useState(
    config.weatherapikey ?? "",
  );

  const handleSave = useCallback(async () => {
    await Promise.all([updateTown(town), updateWeatherApiKey(weatherAuApiKey)]);
    refetch();
  }, [town, updateTown, weatherAuApiKey, updateWeatherApiKey, refetch]);

  return (
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
  );
};
