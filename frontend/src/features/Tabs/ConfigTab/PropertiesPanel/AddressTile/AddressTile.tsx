import { PencilSquareIcon, TrashIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import { Button } from "../../../../../components/Buttons/Button";
import { Textbox } from "../../../../../components/Textbox";
import type { Address } from "../../../../../hooks/useConfig";

type AddressTileProps = {
  address: Address;
  updateConfig: (address: Address) => void;
  deleteConfig: (key: string, id: string) => void;
};

export const EMPTY_ADDRESS = () => ({
  id: undefined,
  key: "properties",
  value: {
    label: "",
    slug: "",
  },
});

export const AddressTile = ({
  address,
  updateConfig,
  deleteConfig,
}: AddressTileProps) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [updatedAddress, setUpdatedAddress] = useState<Address>(address);
  const toggleEdit = () => setEditing((previous) => !previous);

  return (
    <section className="flex flex-row">
      <div className="flex flex-row gap-2 w-full min-h-9">
        <div className="flex flex-1">
          <div className="bg-velvet-950 text-velvet-100 min-w-30 max-w-30 justify-center flex items-center p-1 text-xs font-mono rounded-l-xs border-l-1 border-l-transparent">
            {editing ? (
              <Textbox
                placeholder="Label"
                inputValue={updatedAddress.value.label}
                onChangeHandler={(e) =>
                  setUpdatedAddress((p) => ({
                    ...p,
                    value: {
                      ...p.value,
                      label: e.target.value,
                    },
                  }))
                }
              />
            ) : (
              address.value.label
            )}
          </div>
          <div className="bg-velvet-900/60 text-velvet-300 flex-1 justify-center flex items-center px-1 text-xs font-mono self-stretch content-center rounded-r-xs border-r-1 border-r-transparent">
            {editing ? (
              <Textbox
                placeholder="Slug"
                inputValue={updatedAddress.value.slug}
                onChangeHandler={(e) =>
                  setUpdatedAddress((p) => ({
                    ...p,
                    value: {
                      ...p.value,
                      slug: e.target.value,
                    },
                  }))
                }
              />
            ) : (
              address.value.slug
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
                  updateConfig(updatedAddress);
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
                  if (address.id) deleteConfig("properties", address.id);
                }}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
};
