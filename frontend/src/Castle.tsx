import { useEffect, useState } from "react";
import { format } from "date-fns/format";
import { Separator } from "./components/Separator";
import { ZenOfPython } from "./features/ZenOfPython/ZenOfPython";
import { HorizontalRule } from "./components/HorizontalRule";
import { TabBar, type TabID } from "./features/Tabs/TabBar";
import { HomeTab } from "./features/Tabs/HomeTab";
import { ConfigTab } from "./features/Tabs/ConfigTab/ConfigTab";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { ReadingTab } from "./features/Tabs/ReadingTab";

type DateAndTime = {
	date: string;
	time: string;
};

const getFormattedDateAndTime = (now: Date) => ({
	date: format(now, "eeee MMMM do, yyyy"),
	time: format(now, "hh:mm a"),
});

export const Castle = () => {
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
			className="font-display flex flex-col h-screen py-2 gap-2 bg-emerald-1000 text-emerald-600 selection:bg-emerald-300 selection:text-emerald-900"
		>
			<header className="flex flex-row justify-between items-center font-bold px-2">
				<h1 className="font-extrabold select-none">Castle</h1>
				<TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
				<h1 className="text-emerald-500 tabular-nums">
					{dateAndTime?.date}
					<Separator />
					{dateAndTime?.time}
				</h1>
			</header>

			<HorizontalRule />

			{activeTab === "home-tab" && <HomeTab />}

			{activeTab === "reading-tab" && <ReadingTab />}

			{activeTab === "tools-tab" && (
				<main className="relative flex flex-col flex-1 overflow-y-auto px-2">
					<section>Tools</section>
				</main>
			)}

			{activeTab === "config-tab" && (
				<main className="relative flex flex-col flex-1 overflow-y-auto px-2">
					<ConfigTab />
				</main>
			)}

			<HorizontalRule />
			<footer className="flex flex-row justify-between items-center px-2 py-1 leading-none">
				<ZenOfPython />
			</footer>
		</div>
	);
};
