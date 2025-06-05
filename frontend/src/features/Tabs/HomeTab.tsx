import { HackerNews } from "../HackerNews/HackerNews";
import { LivingWorlds } from "../LivingWorlds/LivingWorlds";
import { PathOfExile } from "../PathOfExile/PathOfExile";
import { Properties } from "../Properties/Properties";

export const HomeTab = () => {
	return (
		<main className="relative flex flex-col flex-1 overflow-y-auto px-2">
			<section className="grid grid-cols-[373px_1fr_300px] gap-2">
				<section className="flex flex-col gap-2 w-fit">
					<LivingWorlds />
					<Properties />
				</section>

				<section className="flex flex-col gap-2">
					<HackerNews />
				</section>

				<section className="flex flex-col gap-2">
					<PathOfExile />
				</section>
			</section>
		</main>
	);
};
