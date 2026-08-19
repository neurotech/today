"use client";

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
      className="w-full flex-1 px-1 py-0.5 border rounded-sm text-sm border-zinc-700 bg-zinc-800 text-zinc-400 focus-within:text-zinc-100 focus-visible:outline-3 focus-visible:outline-zinc-700/20"
    />
  );
};
