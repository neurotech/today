import { Card } from "./components/ui/card";
import { LivingWorlds } from "./features/LivingWorlds/living-worlds";
import { Waygate } from "./features/Waygate/waygate";

export const App = () => {
	return (
		<div>
			<h1>Today</h1>

			<Card>
				<Waygate />
			</Card>

			<Card>
				<LivingWorlds />
			</Card>
		</div>
	);
};
