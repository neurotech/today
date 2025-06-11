import type { ReactNode } from "react";
import { HorizontalRule } from "./HorizontalRule";
import { Loading } from "./Loading";
interface PanelProps {
	content: ReactNode;
	loading?: boolean;
	error?: string | null;
	heading?: string;
	headingRight?: ReactNode;
	fillWidth?: boolean;
}

const fillWidthStyles: Record<string, string> = {
	true: "flex-1",
	false: "",
};

export const Panel = ({
	content,
	loading = false,
	error,
	heading,
	headingRight,
	fillWidth = false,
}: PanelProps) => {
	return (
		<section
			className={`${fillWidthStyles[fillWidth.toString()]} flex flex-col border-1 rounded-sm border-velvet-950 bg-velvet-1000`}
		>
			{heading && (
				<>
					<header className="flex flex-row justify-between items-center p-1">
						<h2 className="text-velvet-500 font-bold select-none text-md px-1">
							{heading}
						</h2>
						{headingRight}
					</header>
					<HorizontalRule />
				</>
			)}
			{loading && (
				<h3 className="flex flex-col justify-center self-center min-h-20 select-none">
					<Loading />
				</h3>
			)}
			{error && <h3>Error: {error}</h3>}
			{!loading && !error && <div className="flex flex-col p-2">{content}</div>}
		</section>
	);
};
