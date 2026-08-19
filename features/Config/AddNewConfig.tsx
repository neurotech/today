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

export const AddNewConfig = ({
  configKey,
  leftPlaceholder,
  rightPlaceholder,
  rightInputType = "text",
}: AddNewConfigProps) => {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // A rejected create says why, rather than leaving the inputs populated with
  // no indication of what went wrong.
  const add = () =>
    startTransition(async () => {
      const result = await createConfigAction(configKey, left, right);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setError(null);
      setLeft("");
      setRight("");
    });

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row gap-2 justify-between">
        <Textbox
          placeholder={leftPlaceholder}
          inputValue={left}
          onChangeHandler={(e) => setLeft(e.target.value)}
        />

        {rightInputType === "date" ? (
          <input
            type="date"
            className="w-full flex-1 px-1 py-0.5 border rounded-sm text-sm border-zinc-700 bg-zinc-800 text-zinc-400 focus-within:text-zinc-100 focus-visible:outline-3 focus-visible:outline-zinc-700/20"
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
          disabled={left.trim() === "" || right.trim() === "" || pending}
          onClick={add}
        />
      </div>

      {error && (
        <p className="text-xs text-zinc-300 px-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
