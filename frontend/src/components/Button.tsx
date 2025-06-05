import type { ReactNode } from "react";

interface ButtonProps {
	label: string | ReactNode;
	onClick: () => void;
	minWidth?: string;
	disabled?: boolean;
}

export const Button = ({
	label,
	onClick,
	minWidth = "min-w-22",
	disabled,
}: ButtonProps) => {
	return (
		<button
			type="button"
			disabled={disabled}
			onClick={onClick}
			className={`${minWidth} flex justify-center items-center cursor-pointer text-sm text-emerald-500 hover:text-emerald-200 transition-colors bg-emerald-950/50 hover:bg-emerald-950 rounded-sm p-1 border-1 border-emerald-900/60 hover:border-emerald-900 disabled:cursor-not-allowed disabled:border-neutral-800 disabled:bg-neutral-900 disabled:text-neutral-700`}
		>
			{label}
		</button>
	);
};
