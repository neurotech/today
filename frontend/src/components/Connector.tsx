type ConnectorProps = {
	isActive: boolean;
	lineWidth?: number;
	lineHeight?: number;
};

const activeStyles: Record<string, string> = {
	true: "connector-active stroke-velvet-400",
	false: "connector-inactive stroke-velvet-900",
};

export const Connector = ({
	isActive,
	lineWidth = 10,
	lineHeight = 1,
}: ConnectorProps) => {
	return (
		<svg
			width={lineWidth}
			height={lineHeight}
			viewBox={`0 0 ${lineWidth} ${lineHeight}`}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Connector</title>
			<line
				y1="1"
				x2={lineWidth}
				y2="1"
				className={`connector ${activeStyles[isActive.toString()]}`}
			/>
		</svg>
	);
};
