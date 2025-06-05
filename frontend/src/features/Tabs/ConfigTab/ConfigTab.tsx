import { useState } from "react";
import { Panel } from "../../../components/Panel";
import { AddressTile, type Address } from "./AddressTile/AddressTile";
import { HorizontalRule } from "../../../components/HorizontalRule";
import { AddNewAddress } from "./AddressTile/AddNewAddress";
import { useAddressesConfig } from "../../../hooks/useAddressesConfig";

export const ConfigTab = () => {
	const { deleteAddress, getAddresses } = useAddressesConfig();
	const [addresses, setAddresses] = useState<Address[]>(getAddresses());

	const refreshAddresses = () => setAddresses(getAddresses());

	const handleRemoveAddress = (address: Address) => {
		deleteAddress(address);
		refreshAddresses();
	};

	return (
		<main className="relative flex flex-col flex-1 overflow-y-auto px-2">
			<section className="grid grid-cols-[1fr_1fr_1fr] gap-2">
				<section className="flex flex-col gap-2">
					<Panel
						heading={"Properties"}
						content={
							<div className="flex flex-col gap-2">
								<h3>Addresses:</h3>
								{addresses.length <= 0 && <div>No addresses found.</div>}
								{addresses.map((p) => (
									<AddressTile
										key={p.slug}
										address={p}
										handleRemoveAddress={handleRemoveAddress}
										refreshAddresses={refreshAddresses}
									/>
								))}
								<HorizontalRule />
								<AddNewAddress refreshAddresses={refreshAddresses} />
							</div>
						}
					/>
				</section>

				<section className="flex flex-col gap-2">
					<Panel heading={"Placeholder"} content={"TODO"} />
				</section>
				<section className="flex flex-col gap-2">
					<Panel heading={"Placeholder"} content={"TODO"} />
				</section>
			</section>
		</main>
	);
};
