"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/Buttons/Button";
import { Textbox } from "@/components/Textbox";
import type { ConfigKey } from "@/lib/config";
import { createConfigAction } from "@/lib/config-actions";

type AddNewConfigProps = {
  configKey: ConfigKey;
  leftPlaceholder: string;
  rightPlaceholder: string;
  rightInputType?: "text" | "date";
};

/** Replaces AddNewAddress and AddNewBirthday, which differed only in labels
 *  and the right-hand input type. */
export const AddNewConfig = ({
  configKey,
  leftPlaceholder,
  rightPlaceholder,
  rightInputType = "text",
}: AddNewConfigProps) => {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [pending, startTransition] = useTransition();

  const add = () =>
    startTransition(async () => {
      const result = await createConfigAction(configKey, left, right);

      if (result.ok) {
        setLeft("");
        setRight("");
      }
    });

  return (
    <div className="flex flex-row gap-2 justify-between">
      <Textbox
        placeholder={leftPlaceholder}
        inputValue={left}
        onChangeHandler={(e) => setLeft(e.target.value)}
      />

      {rightInputType === "date" ? (
        <input
          type="date"
          className="w-full flex-1 px-1 py-0.5 border-1 rounded-sm text-sm border-velvet-800 bg-velvet-950 text-velvet-400 focus-within:text-velvet-100 focus-visible:outline-3 focus-visible:outline-velvet-800/20"
          value={right}
          onChange={(e) => setRight(e.target.value)}
        />
      ) : (
        <Textbox
          placeholder={rightPlaceholder}
          inputValue={right}
          onChangeHandler={(e) => setRight(e.target.value)}
        />
      )}

      <Button
        minWidth="min-w-10"
        label="Add new"
        disabled={left === "" || right === "" || pending}
        onClick={add}
      />
    </div>
  );
};
