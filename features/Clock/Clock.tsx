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
    setDateAndTime(getFormattedDateAndTime(new Date()));

    const timer = setInterval(
      () => setDateAndTime(getFormattedDateAndTime(new Date())),
      1000,
    );

    return () => clearInterval(timer);
  }, []);

  return (
    <h1 className="text-velvet-500 tabular-nums min-h-6">
      {dateAndTime && (
        <>
          {dateAndTime.date}
          <Separator />
          {dateAndTime.time}
        </>
      )}
    </h1>
  );
};
