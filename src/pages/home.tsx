import { Card } from "../components/ui/card";
import type { ConfigData } from "../context/config-context";
import { Calendar } from "../features/Calendar/calendar";
import { LivingWorlds } from "../features/LivingWorlds/living-worlds";
import { Waygate } from "../features/Waygate/waygate";
import { Weather } from "../features/Weather/weather";

export const Home = ({ config }: { config: ConfigData }) => {
  return (
    <>
      <div className="flex flex-1 flex-row gap-4 self-start">
        <div className="flex flex-col gap-4">
          <Calendar />
          <Weather town={config.town} weatherApiKey={config.weatherapikey} />
        </div>
        <Waygate />
      </div>

      <Card className="flex-0 self-start">
        <LivingWorlds />
      </Card>
    </>
  );
};
