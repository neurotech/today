import { useState } from "react";
import { Button } from "../../../../components/Buttons/Button";
import { EMPTY_ADDRESS, type Address } from "./AddressTile";
import { useAddressesConfig } from "../../../../hooks/useAddressesConfig";
import { v4 } from "uuid";
import { Textbox } from "../../../../components/Textbox";

type AddNewAddressProps = {
	refreshAddresses: () => void;
};

export const AddNewAddress = ({ refreshAddresses }: AddNewAddressProps) => {
	const [newAddress, setNewAddress] = useState<Address>(EMPTY_ADDRESS());
	const { addAddress } = useAddressesConfig();

	return (
		<div className="flex flex-row gap-2 justify-between">
			<Textbox
				placeholder="Label"
				inputValue={newAddress.label}
				onChangeHandler={(e) =>
					setNewAddress({
						...newAddress,
						label: e.currentTarget.value,
					})
				}
			/>
			<Textbox
				placeholder="Slug"
				inputValue={newAddress.slug}
				onChangeHandler={(e) =>
					setNewAddress({
						...newAddress,
						slug: e.currentTarget.value,
					})
				}
			/>

			<Button
				minWidth="min-w-10"
				label={"Add new"}
				disabled={newAddress.label === "" || newAddress.slug === ""}
				onClick={() => {
					addAddress({ ...newAddress, id: v4() });
					setNewAddress(EMPTY_ADDRESS());
					refreshAddresses();
				}}
			/>
		</div>
	);
};
