type TabPosition = "start" | "middle" | "end";

type TabButtonProps = {
	label: string;
	isActive: boolean;
	tabPosition: TabPosition;
	onClick: () => void;
};

const activeStyles: Record<string, string> = {
	true: "border-emerald-700 bg-emerald-950/80 text-emerald-200",
	false:
		"saturate-50 hover:saturate-100 border-emerald-900/60 hover:border-emerald-700 bg-emerald-950/50 text-emerald-500 hover:text-emerald-200",
};

const positionStyles: Record<TabPosition, string> = {
	start: "rounded-l-sm",
	middle: "border-x-1",
	end: "rounded-r-sm",
};

export const TabButton = ({
	label,
	isActive,
	tabPosition,
	onClick,
}: TabButtonProps) => {
	return (
		<button
			type="button"
			role="tab"
			onClick={onClick}
			className={`${activeStyles[isActive.toString()]} ${positionStyles[tabPosition]} flex justify-center items-center cursor-pointer text-sm transition-colors px-2 py-1 border-1`}
		>
			{label}
		</button>
	);
};
