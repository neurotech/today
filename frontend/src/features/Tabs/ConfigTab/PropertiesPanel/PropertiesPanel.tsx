import { useEffect } from "react";
import { HorizontalRule } from "../../../../components/HorizontalRule";
import { Panel } from "../../../../components/Panel";
import {
  useConfig,
  type UpdatedConfigEntity,
} from "../../../../hooks/useConfig";
import { AddNewAddress } from "./AddressTile/AddNewAddress";
import { ConfigTile } from "../ConfigTile";

export const PropertiesPanel = () => {
  const {
    loading,
    error,
    data: addresses,
    createConfig,
    getConfig,
    updateConfig,
    deleteConfig,
  } = useConfig();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Getting on mount only
  useEffect(() => {
    getConfig("properties");
  }, []);

  const handleAdd = (updatedEntity: UpdatedConfigEntity) => {
    updateConfig({
      id: updatedEntity.id,
      key: updatedEntity.key,
      value: {
        label: updatedEntity.leftValue,
        slug: updatedEntity.rightValue,
      },
    });
  };

  return (
    <Panel
      heading="Properties"
      loading={loading}
      error={error}
      content={
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-velvet-400">Addresses:</h3>
          {addresses && addresses?.length <= 0 && (
            <div>Please add an address below.</div>
          )}
          {addresses?.map((p) => (
            <ConfigTile
              key={p.id}
              entity={p}
              configKey="properties"
              updateConfig={handleAdd}
              deleteConfig={deleteConfig}
            />
          ))}
          <HorizontalRule />
          <AddNewAddress handleNewAddress={createConfig} />
        </div>
      }
    />
  );
};
