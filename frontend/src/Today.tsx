import { format } from "date-fns/format";
import { useEffect, useState } from "react";
import { HorizontalRule } from "./components/HorizontalRule";
import { Separator } from "./components/Separator";
import { ConfigTab } from "./features/Tabs/ConfigTab/ConfigTab";
import { HomeTab } from "./features/Tabs/HomeTab";
import { ReadingTab } from "./features/Tabs/ReadingTab";
import { TabBar, type TabID } from "./features/Tabs/TabBar";
import { ZenOfPython } from "./features/ZenOfPython/ZenOfPython";
import { useLocalStorage } from "./hooks/useLocalStorage";

type DateAndTime = {
  date: string;
  time: string;
};

const getFormattedDateAndTime = (now: Date) => ({
  date: format(now, "eeee MMMM do, yyyy"),
  time: format(now, "hh:mm a"),
});

export const Today = () => {
  const { getValue } = useLocalStorage();
  const [activeTab, setActiveTab] = useState<TabID>(
    (getValue("activeTab") as TabID) || "home-tab",
  );
  const [dateAndTime, setDateAndTime] = useState<DateAndTime>(
    getFormattedDateAndTime(new Date()),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const { date, time } = getFormattedDateAndTime(new Date());

      if (date !== dateAndTime?.date || time !== dateAndTime?.time)
        setDateAndTime({ date, time });
    }, 1000);

    return () => clearInterval(timer);
  }, [dateAndTime]);

  return (
    <div
      role="document"
      className="font-display flex flex-col h-screen bg-velvet-1100 text-velvet-600 selection:bg-velvet-300 selection:text-velvet-900"
    >
      <header className="flex flex-row justify-between items-center font-bold p-2 bg-velvet-1000">
        <h1 className="text-velvet-500 text-shadow-black/30 text-shadow-2xs font-logo text-2xl font-normal select-none tracking-tighter">
          Today
        </h1>
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
        <h1 className="text-velvet-500 tabular-nums">
          {dateAndTime?.date}
          <Separator />
          {dateAndTime?.time}
        </h1>
      </header>

      <HorizontalRule />

      <main className="relative flex flex-col flex-1 overflow-y-auto p-2">
        {activeTab === "home-tab" && <HomeTab />}

        {activeTab === "reading-tab" && <ReadingTab />}

        {activeTab === "tools-tab" && <section>Tools</section>}

        {activeTab === "config-tab" && <ConfigTab />}
      </main>

      <HorizontalRule />
      <footer className="flex flex-row justify-between items-center px-2 py-3 bg-velvet-1000 leading-none">
        <ZenOfPython />
      </footer>
    </div>
  );
};
