import { useState } from "react";
import { Button } from "../../components/Button";
import { Panel } from "../../components/Panel";
import {
	useAddressesConfig,
	type Address,
} from "../../hooks/useAddressesConfig";

const urlPrefix =
	import.meta.env.MODE === "development" ? "http://slab:7000/" : "/";

const getPropertyURL = (address: string) =>
	`${urlPrefix}api/property?address=${encodeURIComponent(address)}`;

export const Properties = () => {
	const { getAddresses } = useAddressesConfig();
	const [addresses] = useState<Address[]>(getAddresses());
	const [activeImage, setActiveImage] = useState<string>("");
	return (
		<Panel
			heading="Properties"
			content={
				<section className="grid gap-2">
					{addresses.map((address) => {
						return (
							<div key={address.slug} className="flex flex-col justify-center">
								<Button
									label={address.label}
									onClick={() => {
										console.log(activeImage);
										if (activeImage === address.id) {
											setActiveImage("");
										} else {
											setActiveImage(address.id);
										}
									}}
								/>
								{activeImage === address.id && (
									<img
										src={getPropertyURL(address.slug)}
										alt={address.label}
										className="object-cover object-center w-fit h-60 self-center animate-fade-in"
									/>
								)}
							</div>
						);
					})}
				</section>
			}
		/>
	);
};
