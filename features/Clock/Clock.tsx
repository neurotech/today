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

    // The display has minute resolution, so a 1000 ms interval re-rendered the
    // header 60 times more often than it could possibly change. Each tick
    // schedules the next one on the upcoming minute boundary instead, which
    // also stops the clock drifting a second late over a long session.
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

  // Not a heading. It was an h1, competing with the site title beside it.
  return (
    <p className="text-velvet-500 tabular-nums min-h-6">
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
