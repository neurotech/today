import { Panel } from "../../components/Panel";

export const LivingWorlds = () => {
	return (
		<Panel
			content={
				<iframe
					width={355}
					height={480}
					src={"./living-worlds/index.html"}
					title="living-worlds"
					className="border-1 rounded-xs border-emerald-950"
				/>
			}
		/>
	);
};
