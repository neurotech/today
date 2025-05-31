import { useEffect, useState } from "react";
import { format } from "date-fns/format";
import { Separator } from "./components/Separator";

export const App = () => {
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	return (
		<div
			role="document"
			className="font-display flex flex-col h-screen p-4 gap-4 bg-emerald-1000 text-emerald-600 selection:bg-emerald-300 selection:text-emerald-900"
		>
			<header className="flex flex-row justify-between font-bold">
				<h1 className="font-extrabold select-none">Castle</h1>
				<h1 className="text-emerald-500 tabular-nums">
					{format(currentTime, "eeee MMM do, yyyy")}
					<Separator />
					{format(currentTime, "hh:mm a")}
				</h1>
			</header>

			<hr className="border-emerald-900/30" />

			<main className="flex flex-row flex-1 overflow-y-auto">
				{import.meta.env.MODE}
			</main>

			<footer>{import.meta.env.MODE}</footer>
		</div>
	);
};
