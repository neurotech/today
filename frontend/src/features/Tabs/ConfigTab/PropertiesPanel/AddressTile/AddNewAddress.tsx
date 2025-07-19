import { useState } from "react";
import { Button } from "../../../../../components/Buttons/Button";
import { Textbox } from "../../../../../components/Textbox";
import { EMPTY_ADDRESS, type Address } from "../../../../../hooks/useConfig";

type AddNewAddressProps = {
  handleNewAddress: (address: Address) => void;
};

export const AddNewAddress = ({ handleNewAddress }: AddNewAddressProps) => {
  const [newAddress, setNewAddress] = useState<Address>(EMPTY_ADDRESS());

  return (
    <div className="flex flex-row gap-2 justify-between">
      <Textbox
        placeholder="Label"
        inputValue={newAddress.value.label || ""}
        onChangeHandler={(e) =>
          setNewAddress((p) => ({
            ...p,
            value: {
              ...p.value,
              label: e.target.value,
            },
          }))
        }
      />
      <Textbox
        placeholder="Slug"
        inputValue={newAddress.value.slug || ""}
        onChangeHandler={(e) =>
          setNewAddress((p) => ({
            ...p,
            value: {
              ...p.value,
              slug: e.target.value,
            },
          }))
        }
      />

      <Button
        minWidth="min-w-10"
        label={"Add new"}
        disabled={newAddress.value.label === "" || newAddress.value.slug === ""}
        onClick={() => handleNewAddress(newAddress)}
      />
    </div>
  );
};
