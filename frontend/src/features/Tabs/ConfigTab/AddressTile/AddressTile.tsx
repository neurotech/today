import { useState } from "react";
import { Button } from "../../../../components/Button";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/16/solid";
import { v4 } from "uuid";
import { useAddressesConfig } from "../../../../hooks/useAddressesConfig";

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
			<div className="flex flex-row gap-2 w-full">
				<div className="flex flex-1">
					<div className="bg-emerald-900 text-emerald-100 min-w-20 justify-center flex items-center py-1 px-2 text-sm rounded-l-xs border-l-1 border-l-transparent">
						{editing ? (
							<input
								type="text"
								placeholder="Label"
								value={updatedAddress.label}
								onChange={(e) =>
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
					<div className="bg-emerald-950 text-emerald-300 flex-1 justify-center flex items-center px-1.5 text-xs font-mono self-stretch content-center rounded-r-xs border-r-1 border-r-transparent">
						{editing ? (
							<input
								type="text"
								placeholder="Slug"
								value={updatedAddress.slug}
								onChange={(e) =>
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
				{editing ? (
					<div>
						<Button
							minWidth="min-w-10"
							label={"Cancel"}
							onClick={() => toggleEdit()}
						/>
						<Button
							minWidth="min-w-10"
							label={"Save"}
							onClick={() => {
								updateAddress(updatedAddress);
								if (refreshAddresses) refreshAddresses();
								toggleEdit();
							}}
						/>
					</div>
				) : (
					<>
						<Button
							minWidth="min-w-10"
							label={<PencilSquareIcon className="size-4" />}
							onClick={toggleEdit}
						/>
						<Button
							minWidth="min-w-10"
							label={<TrashIcon className="size-4" />}
							onClick={() => handleRemoveAddress(address)}
						/>
					</>
				)}
			</div>
		</section>
	);
};
