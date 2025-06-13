import { Panel } from "../../../../components/Panel";
import { AddressTile } from "./AddressTile/AddressTile";
import { HorizontalRule } from "../../../../components/HorizontalRule";
import { AddNewAddress } from "./AddressTile/AddNewAddress";
import { useConfig, type Address } from "../../../../hooks/useConfig";
import { useEffect } from "react";

export const PropertiesPanel = () => {
	useEffect(() => {
		getConfig("properties");
	}, []);

	const {
		loading,
		error,
		data: addresses,
		createConfig,
		getConfig,
		updateConfig,
		deleteConfig,
	} = useConfig<Address>();

	const handleNewAddress = (address: Address) => {
		createConfig(address);
	};

	return (
		<Panel
			heading={"Properties"}
			loading={loading}
			error={error}
			content={
				<div className="flex flex-col gap-2">
					<h3 className="font-bold text-velvet-400">Addresses:</h3>
					{addresses && addresses?.length <= 0 && (
						<div>No addresses found.</div>
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
					<AddNewAddress handleNewAddress={handleNewAddress} />
				</div>
			}
		/>
	);
};
