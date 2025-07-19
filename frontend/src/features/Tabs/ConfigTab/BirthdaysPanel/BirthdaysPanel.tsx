import { useEffect } from "react";
import { HorizontalRule } from "../../../../components/HorizontalRule";
import { Panel } from "../../../../components/Panel";
import {
  useConfig,
  type UpdatedConfigEntity,
} from "../../../../hooks/useConfig";
import { ConfigTile } from "../ConfigTile";
import { AddNewBirthday } from "./AddNewBirthday";
import { formatDate } from "date-fns";

export const BirthdaysPanel = () => {
  const {
    loading,
    error,
    data: birthdays,
    createConfig,
    getConfig,
    updateConfig,
    deleteConfig,
  } = useConfig();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Getting on mount only.
  useEffect(() => {
    getConfig("birthdays");
  }, []);

  const handleAdd = (updatedEntity: UpdatedConfigEntity) => {
    updateConfig({
      id: updatedEntity.id,
      key: updatedEntity.key,
      value: {
        person: updatedEntity.leftValue,
        birthdate: updatedEntity.rightValue,
      },
    });
  };

  return (
    <Panel
      heading={"Birthdays"}
      loading={loading}
      error={error}
      content={
        <div className="flex flex-col gap-2">
          {birthdays && birthdays?.length <= 0 && (
            <div>Please add a birthday below.</div>
          )}
          {birthdays?.map((p) => (
            <ConfigTile
              key={p.id}
              entity={p}
              configKey="birthdays"
              updateConfig={handleAdd}
              deleteConfig={deleteConfig}
              rightValueFormatter={(value: string) =>
                formatDate(value, "dd MMMM yyyy")
              }
            />
          ))}
          <HorizontalRule />
          <AddNewBirthday handleNewBirthday={createConfig} />
        </div>
      }
    />
  );
};
