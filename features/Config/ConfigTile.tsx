"use client";

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/16/solid";
import { useState, useTransition } from "react";
import { Button } from "@/components/Buttons/Button";
import { Textbox } from "@/components/Textbox";
import type { ConfigKey } from "@/lib/config";
import { deleteConfigAction, updateConfigAction } from "@/lib/config-actions";

export type ConfigTileProps = {
  id: number;
  configKey: ConfigKey;
  /** Raw values, used when editing. */
  left: string;
  right: string;
  /** Display value for the right column, preformatted on the server. */
  rightDisplay: string;
  leftPlaceholder: string;
  rightPlaceholder: string;
  rightInputType?: "text" | "date";
};

/**
 * Fully generic over the config key: the caller supplies an already-flattened
 * left/right pair rather than an entity for this tile to sniff.
 */
export const ConfigTile = ({
  id,
  configKey,
  left,
  right,
  rightDisplay,
  leftPlaceholder,
  rightPlaceholder,
  rightInputType = "text",
}: ConfigTileProps) => {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leftValue, setLeftValue] = useState(left);
  const [rightValue, setRightValue] = useState(right);
  const [pending, startTransition] = useTransition();

  const toggleEdit = () => {
    setError(null);
    setEditing((previous) => !previous);
  };

  // A failure keeps the editor open and says why. Closing it would look like
  // the save had worked: the edited values are local state, so they stay on
  // screen until a reload.
  const save = () =>
    startTransition(async () => {
      const result = await updateConfigAction(
        id,
        configKey,
        leftValue,
        rightValue,
      );

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setError(null);
      setEditing(false);
    });

  const remove = () =>
    startTransition(async () => {
      const result = await deleteConfigAction(id, configKey);

      if (!result.ok) {
        setError(result.error);
        setConfirming(false);
      }
      // On success the row is gone from the next render, so there is nothing
      // left to reset.
    });

  return (
    <section className="flex flex-col gap-1">
      <div className="flex flex-row gap-2 w-full min-h-9">
        <div className="flex flex-1">
          <div className="bg-zinc-800 text-zinc-100 min-w-30 max-w-30 justify-center flex items-center p-1 text-xs font-mono rounded-l-xs border-l-1 border-l-transparent">
            {editing ? (
              <Textbox
                placeholder={leftPlaceholder}
                inputValue={leftValue}
                onChangeHandler={(e) => setLeftValue(e.target.value)}
              />
            ) : (
              left
            )}
          </div>
          <div className="bg-zinc-700/60 text-zinc-300 flex-1 justify-center flex items-center px-1 text-xs font-mono self-stretch content-center rounded-r-xs border-r-1 border-r-transparent">
            {editing ? (
              rightInputType === "date" ? (
                <input
                  type="date"
                  className="w-full flex-1 px-1 py-0.5 border rounded-sm text-sm border-zinc-700 bg-zinc-800 text-zinc-400 focus-within:text-zinc-100 focus-visible:outline-3 focus-visible:outline-zinc-700/20"
                  value={rightValue}
                  onChange={(e) => setRightValue(e.target.value)}
                />
              ) : (
                <Textbox
                  placeholder={rightPlaceholder}
                  inputValue={rightValue}
                  onChangeHandler={(e) => setRightValue(e.target.value)}
                />
              )
            ) : (
              rightDisplay
            )}
          </div>
        </div>

        {/* Three states: editing, confirming a delete, or idle. */}
        <div className="flex flex-row gap-2">
          {editing && (
            <>
              <Button
                minWidth="min-w-14"
                label="Cancel"
                disabled={pending}
                onClick={() => {
                  setLeftValue(left);
                  setRightValue(right);
                  toggleEdit();
                }}
              />
              <Button
                minWidth="min-w-14"
                label="Save"
                disabled={pending}
                onClick={save}
              />
            </>
          )}

          {confirming && (
            <>
              <Button
                minWidth="min-w-14"
                label="Cancel"
                disabled={pending}
                onClick={() => setConfirming(false)}
              />
              <Button
                minWidth="min-w-14"
                label="Delete"
                disabled={pending}
                onClick={remove}
              />
            </>
          )}

          {!editing && !confirming && (
            <>
              <Button
                minWidth="min-w-14"
                label={<PencilSquareIcon className="size-4" />}
                disabled={pending}
                onClick={toggleEdit}
              />
              <Button
                minWidth="min-w-14"
                label={<TrashIcon className="size-4" />}
                disabled={pending}
                onClick={() => {
                  setError(null);
                  setConfirming(true);
                }}
              />
            </>
          )}
        </div>
      </div>

      {error && (
        <p className="text-xs text-zinc-300 px-1" role="alert">
          {error}
        </p>
      )}
    </section>
  );
};
