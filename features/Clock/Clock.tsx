"use client";

import { format } from "date-fns/format";
import { useEffect, useState } from "react";
import { Separator } from "@/components/Separator";

type DateAndTime = {
  date: string;
  time: string;
};

const getFormattedDateAndTime = (now: Date): DateAndTime => ({
  date: format(now, "eeee MMMM do, yyyy"),
  time: format(now, "hh:mm a"),
});

/**
 * Mount-gated rather than rendered on the server. Server and client would
 * format different instants (and possibly different timezones), which is a
 * guaranteed hydration mismatch. Rendering nothing until mounted sidesteps it
 * entirely; `min-h-6` holds the header's height so nothing shifts.
 */
export const Clock = () => {
  const [dateAndTime, setDateAndTime] = useState<DateAndTime | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    // The display has minute resolution, so each tick schedules the next one on
    // the upcoming minute boundary rather than running on a 1000 ms interval.
    // That also stops the clock drifting a second late over a long session.
    const tick = () => {
      const now = new Date();
      setDateAndTime(getFormattedDateAndTime(now));

      timer = setTimeout(
        tick,
        60_000 - (now.getSeconds() * 1000 + now.getMilliseconds()),
      );
    };

    tick();

    return () => clearTimeout(timer);
  }, []);

  return (
    <p className="text-zinc-400 tabular-nums min-h-6">
      {dateAndTime && (
        <>
          {dateAndTime.date}
          <Separator />
          {dateAndTime.time}
        </>
      )}
    </p>
  );
};
