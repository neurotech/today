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
 * Fully generic over the config key. The old version sniffed the entity shape
 * with isAddress/isBirthday guards; the caller now supplies an already-flattened
 * left/right pair, which is what the abandoned genericisation was aiming at.
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

  // Both actions return an ActionResult that used to be discarded, so a
  // rejected save closed the editor and looked like it had worked: the edited
  // values stayed on screen because they are local state, and only a reload
  // revealed otherwise. Failures now keep the editor open and say why.
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
          <div className="bg-velvet-950 text-velvet-100 min-w-30 max-w-30 justify-center flex items-center p-1 text-xs font-mono rounded-l-xs border-l-1 border-l-transparent">
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
          <div className="bg-velvet-900/60 text-velvet-300 flex-1 justify-center flex items-center px-1 text-xs font-mono self-stretch content-center rounded-r-xs border-r-1 border-r-transparent">
            {editing ? (
              rightInputType === "date" ? (
                <input
                  type="date"
                  className="w-full flex-1 px-1 py-0.5 border rounded-sm text-sm border-velvet-800 bg-velvet-950 text-velvet-400 focus-within:text-velvet-100 focus-visible:outline-3 focus-visible:outline-velvet-800/20"
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

        {/* Three states: editing, confirming a delete, or idle. The bin used to
            delete on the first click, with no undo. */}
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
        <p className="text-xs text-red-400 px-1" role="alert">
          {error}
        </p>
      )}
    </section>
  );
};
