import { Panel } from "../../../components/Panel";
import { BirthdaysPanel } from "./BirthdaysPanel/BirthdaysPanel";
import { PropertiesPanel } from "./PropertiesPanel/PropertiesPanel";

export const ConfigTab = () => {
	return (
		<section className="grid grid-cols-[1fr_1fr_1fr] gap-2">
			<section className="flex flex-col gap-2">
				<PropertiesPanel />
			</section>

			<section className="flex flex-col gap-2">
				<BirthdaysPanel />
			</section>
			<section className="flex flex-col gap-2">
				<Panel heading={"Placeholder"} content={"TODO"} />
			</section>
		</section>
	);
};
