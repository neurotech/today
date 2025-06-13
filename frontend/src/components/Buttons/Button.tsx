import type { ReactNode } from "react";

export type ButtonProps = {
	label: string | ReactNode;
	onClick: () => void;
	minWidth?: string;
	disabled?: boolean;
	compressed?: boolean;
};

const compressedStyles: Record<string, string> = {
	true: "p-[0px]",
	false: "p-1",
};

export const Button = ({
	label,
	onClick,
	minWidth = "min-w-22",
	disabled,
	compressed = false,
}: ButtonProps) => {
	return (
		<button
			type="button"
			disabled={disabled}
			onClick={onClick}
			className={`${minWidth} ${compressedStyles[compressed.toString()]} flex justify-center items-center cursor-pointer text-sm text-velvet-300 hover:text-velvet-50 transition-colors bg-velvet-800 hover:bg-velvet-600 rounded-sm p-1 border-1 border-velvet-600 hover:border-velvet-600 disabled:cursor-not-allowed disabled:border-neutral-800 disabled:bg-neutral-900 disabled:text-neutral-700`}
		>
			{label}
		</button>
	);
};
