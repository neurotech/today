import { useState } from "react";
import { Button } from "../../../../components/Button";
import { EMPTY_ADDRESS, type Address } from "./AddressTile";
import { useAddressesConfig } from "../../../../hooks/useAddressesConfig";
import { v4 } from "uuid";

type AddNewAddressProps = {
	refreshAddresses: () => void;
};

export const AddNewAddress = ({ refreshAddresses }: AddNewAddressProps) => {
	const [newAddress, setNewAddress] = useState<Address>(EMPTY_ADDRESS());
	const { addAddress } = useAddressesConfig();

	return (
		<div className="">
			<input
				type="text"
				placeholder="Label"
				value={newAddress.label}
				onChange={(e) =>
					setNewAddress({
						...newAddress,
						label: e.currentTarget.value,
					})
				}
			/>
			<input
				type="text"
				placeholder="Slug"
				value={newAddress.slug}
				onChange={(e) =>
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
