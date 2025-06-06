import { useState } from "react";
import { Button } from "../../components/Button";
import { Panel } from "../../components/Panel";
import {
	useAddressesConfig,
	type Address,
} from "../../hooks/useAddressesConfig";
import { Connector } from "../../components/Connector";

const urlPrefix =
	import.meta.env.MODE === "development" ? "http://slab:7000/" : "/";

const getPropertyURL = (address: string) =>
	`${urlPrefix}api/property?address=${encodeURIComponent(address)}`;

export const Properties = () => {
	const { getAddresses } = useAddressesConfig();
	const [addresses] = useState<Address[]>(getAddresses());
	const [activeImage, setActiveImage] = useState<string>("");
	const [activeAddress, setActiveAddress] = useState<Address>();

	return (
		<Panel
			heading="Properties"
			content={
				<section className="flex flex-row">
					<div className="flex flex-col gap-2">
						{addresses.map((address) => {
							return (
								<div
									key={address.slug}
									className="flex flex-row justify-center items-center"
								>
									<Button
										label={address.label}
										onClick={() => {
											console.log(activeImage);
											if (activeImage === address.id) {
												setActiveImage("");
												setActiveAddress(undefined);
											} else {
												setActiveImage(address.id);
												setActiveAddress(address);
											}
										}}
									/>
									<Connector
										isActive={activeAddress?.id === address.id}
										lineWidth={20}
									/>
								</div>
							);
						})}
					</div>

					<div className="flex border-emerald-900/50 bg-emerald-950/10 border-1 rounded-sm p-1 flex-1 justify-center items-center min-h-[250px]">
						{activeAddress ? (
							<img
								src={getPropertyURL(activeAddress.slug)}
								alt={activeAddress.label}
								className="object-cover object-center w-fit h-60 self-center animate-fade-in"
							/>
						) : (
							<aside>Select a property.</aside>
						)}
					</div>
				</section>
			}
		/>
	);
};
