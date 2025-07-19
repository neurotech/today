import { useEffect } from "react";
import { HorizontalRule } from "../../../../components/HorizontalRule";
import { Panel } from "../../../../components/Panel";
import { type Birthday, useConfig } from "../../../../hooks/useConfig";
// import { AddressTile } from "../PropertiesPanel/AddressTile/AddressTile";
import { AddNewBirthday } from "./AddNewBirthday";
import { ConfigTile } from "../ConfigTile";

export const EMPTY_BIRTHDAY = (): Birthday => ({
  id: undefined,
  key: "properties",
  value: {
    person: "",
    birthdate: "",
  },
});

export const BirthdaysPanel = () => {
  const {
    loading,
    error,
    data: birthdays,
    createConfig,
    getConfig,
    updateConfig,
    deleteConfig,
  } = useConfig<Birthday, Birthday[]>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Getting on mount only.
  useEffect(() => {
    getConfig("birthdays");
  }, []);

  return (
    <Panel
      heading={"Birthdays"}
      loading={loading}
      error={error}
      content={
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-velvet-400">Addresses:</h3>
          {birthdays && birthdays?.length <= 0 && (
            <div>Please add a birthday below.</div>
          )}
          {birthdays?.map((p) => (
            <ConfigTile
              key={p.value.person}
              address={p}
              updateConfig={updateConfig}
              deleteConfig={deleteConfig}
            />
          ))}
          <HorizontalRule />
          <AddNewBirthday
            handleNewBirthday={(birthday: Birthday) => createConfig(birthday)}
          />
        </div>
      }
    />
  );
};
