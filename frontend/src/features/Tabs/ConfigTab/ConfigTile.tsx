import { PencilSquareIcon, TrashIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import { Button } from "../../../components/Buttons/Button";
import { Textbox } from "../../../components/Textbox";
import {
  isAddress,
  isBirthday,
  type ConfigEntity,
  type ConfigKey,
  type UpdatedConfigEntity,
} from "../../../hooks/useConfig";

interface ConfigTileProps {
  entity: ConfigEntity;
  configKey: ConfigKey;
  updateConfig: (updatedEntity: UpdatedConfigEntity) => void;
  deleteConfig: (key: string, id: string) => void;
  rightValueFormatter?: (value: string) => string;
}

const getValues = (entity: ConfigEntity): { left: string; right: string } => {
  if (isAddress(entity)) {
    return { left: entity.value.label, right: entity.value.slug };
  }

  if (isBirthday(entity)) {
    return { left: entity.value.person, right: entity.value.birthdate };
  }

  return { left: "", right: "" };
};

export const ConfigTile = ({
  entity,
  configKey,
  updateConfig,
  deleteConfig,
  rightValueFormatter,
}: ConfigTileProps) => {
  const { left, right } = getValues(entity);

  const [editing, setEditing] = useState<boolean>(false);
  const [leftValue, setLeftValue] = useState<string>(left);
  const [rightValue, setRightValue] = useState<string>(right);

  const toggleEdit = () => setEditing((previous) => !previous);

  return (
    <section className="flex flex-row">
      <div className="flex flex-row gap-2 w-full min-h-9">
        <div className="flex flex-1">
          <div className="bg-velvet-950 text-velvet-100 min-w-30 max-w-30 justify-center flex items-center p-1 text-xs font-mono rounded-l-xs border-l-1 border-l-transparent">
            {editing ? (
              <Textbox
                placeholder="Label"
                inputValue={leftValue}
                onChangeHandler={(e) => setLeftValue(e.target.value)}
              />
            ) : (
              leftValue
            )}
          </div>
          <div className="bg-velvet-900/60 text-velvet-300 flex-1 justify-center flex items-center px-1 text-xs font-mono self-stretch content-center rounded-r-xs border-r-1 border-r-transparent">
            {editing ? (
              <Textbox
                placeholder="Slug"
                inputValue={rightValue}
                onChangeHandler={(e) => setRightValue(e.target.value)}
              />
            ) : rightValueFormatter ? (
              rightValueFormatter(rightValue)
            ) : (
              rightValue
            )}
          </div>
        </div>

        <div className="flex flex-row gap-2">
          {editing ? (
            <>
              <Button
                minWidth="min-w-14"
                label={"Cancel"}
                onClick={() => toggleEdit()}
              />
              <Button
                minWidth="min-w-14"
                label={"Save"}
                onClick={() => {
                  updateConfig({
                    id: entity.id,
                    key: configKey,
                    leftValue,
                    rightValue,
                  });
                  toggleEdit();
                }}
              />
            </>
          ) : (
            <>
              <Button
                minWidth="min-w-14"
                label={<PencilSquareIcon className="size-4" />}
                onClick={toggleEdit}
              />
              <Button
                minWidth="min-w-14"
                label={<TrashIcon className="size-4" />}
                onClick={() => {
                  if (entity.id) deleteConfig(configKey, entity.id);
                }}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
};
