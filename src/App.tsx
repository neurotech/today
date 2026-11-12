import { Card } from "./components/ui/card";
import Dialog from "./components/ui/dialog";
import { Calendar } from "./features/Calendar/calendar";
import { LivingWorlds } from "./features/LivingWorlds/living-worlds";
import { Waygate } from "./features/Waygate/waygate";

export const App = () => {
  return (
    <div className="font-display flex h-screen flex-col bg-zinc-900 text-zinc-500 selection:bg-zinc-300 selection:text-zinc-700">
      <main className="relative flex flex-row justify-between gap-4 overflow-y-auto p-4">
        <div className="flex flex-1 flex-col gap-4 self-start">
          <Calendar />
          <Waygate />
        </div>

        <Card className="flex-0">
          <LivingWorlds />
        </Card>
      </main>

      <Dialog />
    </div>
  );
};
