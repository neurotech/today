import { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { format } from "date-fns/format";

const getDateParts = (date: Date) => ({
  weekday: format(date, "EEEE"),
  day: format(date, "d"),
  month: format(date, "MMMM"),
  hour: format(date, "hh"),
  minute: format(date, "mm"),
  amPm: format(date, "a"),
});

const useNow = (intervalMs = 1000) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
};

export const Calendar = () => {
  const now = useNow();
  const { weekday, day, month, hour, minute, amPm } = getDateParts(now);

  return (
    <Card className="self-start">
      <div className="flex items-stretch gap-2 select-none">
        <div className="flex flex-col items-center">
          <h1 className="text-lg font-semibold text-zinc-400">{weekday}</h1>
          <h1 className="text-4xl font-black text-white">{day}</h1>
          <h1 className="text-lg font-medium text-zinc-500">{month}</h1>
        </div>

        <div className="ml-2 w-0.5 border-l border-l-zinc-600/70" />

        <div className="flex flex-1 justify-center self-center px-2 text-6xl text-zinc-300 proportional-nums">
          <h1 className="">{hour}</h1>
          <h1 className="animate-pulse text-zinc-400">:</h1>
          <h1 className="">{minute}</h1>
          <h1 className="ml-2 text-zinc-500">{amPm}</h1>
        </div>
      </div>
    </Card>
  );
};
