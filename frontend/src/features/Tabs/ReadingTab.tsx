import { HackerNews } from "../HackerNews/HackerNews";
import { Lobsters } from "../Lobsters/Lobsters";

export const ReadingTab = () => {
	return (
		<section className="grid grid-cols-[1fr_1fr] gap-2 items-start">
			<Lobsters />
			<HackerNews />
		</section>
	);
};
