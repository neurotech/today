import { useEffect } from "react";
import { HorizontalRule } from "../../../../components/HorizontalRule";
import { Panel } from "../../../../components/Panel";
import { type Address, useConfig } from "../../../../hooks/useConfig";
import { AddNewAddress } from "./AddressTile/AddNewAddress";
import { AddressTile } from "./AddressTile/AddressTile";

export const PropertiesPanel = () => {
  const {
    loading,
    error,
    data: addresses,
    createConfig,
    getConfig,
    updateConfig,
    deleteConfig,
  } = useConfig<Address, Address[]>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Getting on mount only
  useEffect(() => {
    getConfig("properties");
  }, []);

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
            <AddressTile
              key={p.value.slug}
              address={p}
              updateConfig={updateConfig}
              deleteConfig={deleteConfig}
            />
          ))}
          <HorizontalRule />
          <AddNewAddress
            handleNewAddress={(address: Address) => createConfig(address)}
          />
        </div>
      }
    />
  );
};
