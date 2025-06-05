import { HackerNews } from "../HackerNews/HackerNews";

export const ReadingTab = () => {
	return (
		<main className="relative flex flex-col flex-1 overflow-y-auto px-2">
			<section className="grid grid-cols-[1fr] gap-2">
				<section className="">
					<HackerNews />
				</section>
			</section>
		</main>
	);
};
