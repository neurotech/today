import { useState } from "react";
import { Button } from "../../../../components/Buttons/Button";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/16/solid";
import { v4 } from "uuid";
import { useAddressesConfig } from "../../../../hooks/useAddressesConfig";
import { Textbox } from "../../../../components/Textbox";

export type Address = {
	id: string;
	label: string;
	slug: string;
};

type AddressTileProps = {
	address: Address;
	handleRemoveAddress: (address: Address) => void;
	refreshAddresses?: () => void;
};

export const EMPTY_ADDRESS = () => ({
	id: v4(),
	label: "",
	slug: "",
});

export const AddressTile = ({
	address,
	handleRemoveAddress,
	refreshAddresses,
}: AddressTileProps) => {
	const [editing, setEditing] = useState<boolean>(false);
	const [updatedAddress, setUpdatedAddress] = useState<Address>(address);
	const { updateAddress } = useAddressesConfig();

	const toggleEdit = () => setEditing((previous) => !previous);

	return (
		<section className="flex flex-row">
			<div className="flex flex-row gap-2 w-full min-h-9">
				<div className="flex flex-1">
					<div className="bg-velvet-950 text-velvet-100 min-w-30 max-w-30 justify-center flex items-center p-1 text-xs font-mono rounded-l-xs border-l-1 border-l-transparent">
						{editing ? (
							<Textbox
								placeholder="Label"
								inputValue={updatedAddress.label}
								onChangeHandler={(e) =>
									setUpdatedAddress({
										label: e.currentTarget.value,
										id: updatedAddress.id,
										slug: updatedAddress.slug,
									})
								}
							/>
						) : (
							address.label
						)}
					</div>
					<div className="bg-velvet-900/60 text-velvet-300 flex-1 justify-center flex items-center px-1 text-xs font-mono self-stretch content-center rounded-r-xs border-r-1 border-r-transparent">
						{editing ? (
							<Textbox
								placeholder="Slug"
								inputValue={updatedAddress.slug}
								onChangeHandler={(e) =>
									setUpdatedAddress({
										slug: e.currentTarget.value,
										id: updatedAddress.id,
										label: updatedAddress.label,
									})
								}
							/>
						) : (
							address.slug
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
									updateAddress(updatedAddress);
									if (refreshAddresses) refreshAddresses();
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
								onClick={() => handleRemoveAddress(address)}
							/>
						</>
					)}
				</div>
			</div>
		</section>
	);
};
