import { Panel } from "../../../../components/Panel";

export const BirthdaysPanel = () => {
	return (
		<Panel
			heading="Birthdays"
			content={
				<div className="flex flex-col gap-2">
					<div>No birthdays found.</div>
				</div>
			}
		/>
	);
};
