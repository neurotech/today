import { useLocalStorage } from "./useLocalStorage";

export type Address = {
	id: string;
	label: string;
	slug: string;
};

const ADDRESSES_KEY = "addresses";

export const useAddressesConfig = () => {
	const { getValue, storeValue } = useLocalStorage();

	const addAddress = (newAddress: Address) => {
		const existing = getAddresses();
		storeValue(ADDRESSES_KEY, JSON.stringify([...existing, newAddress]));
	};

	const getAddresses = () => {
		const raw = getValue(ADDRESSES_KEY);

		if (!raw || raw === "") return [];

		return JSON.parse(raw) as Address[];
	};

	const updateAddress = (updatedAddress: Address) => {
		const addresses = getAddresses();
		const candidate = addresses.find((a) => a.id === updatedAddress.id);

		if (candidate) {
			addresses[addresses.indexOf(candidate)] = updatedAddress;
			replaceAddresses(addresses);
		} else {
			throw new Error(
				`Could not find an address with the id: ${updatedAddress.id}`,
			);
		}
	};

	const replaceAddresses = (addresses: Address[]) =>
		storeValue(ADDRESSES_KEY, JSON.stringify(addresses));

	const deleteAddress = (addressToDelete: Address) => {
		const addresses = getAddresses();
		const updatedAddresses = addresses.filter(
			(a) => a.id !== addressToDelete.id,
		);
		replaceAddresses(updatedAddresses);
	};

	return { addAddress, getAddresses, updateAddress, deleteAddress };
};
