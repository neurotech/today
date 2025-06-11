import type { ChangeEvent } from "react";

type TextboxProps = {
	inputValue: string;
	onChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
};

export const Textbox = ({
	inputValue,
	onChangeHandler,
	placeholder = "",
}: TextboxProps) => {
	return (
		<input
			type="text"
			placeholder={placeholder}
			value={inputValue}
			onChange={(event) => onChangeHandler(event)}
			className="w-full flex-1 px-1 py-0.5 border-1 rounded-sm text-sm border-velvet-800 bg-velvet-950 text-velvet-400 focus-within:text-velvet-100 focus-visible:outline-3 focus-visible:outline-velvet-800/20"
		/>
	);
};
