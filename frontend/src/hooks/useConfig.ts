import { getUrlPrefix } from "../utils/getUrlPrefix";
import { useFetch } from "./useFetch";

export type ConfigKey = "properties";

export type Address = {
	key: string;
	id?: string;
	value: {
		label: string;
		slug: string;
	};
};

export const useConfig = <T, K>() => {
	const { data, loading, error, postURL, getURL, patchURL, deleteURL } =
		useFetch<T, K>();

	const createConfig = async (configValue: T) =>
		await postURL(`${getUrlPrefix()}api/config`, configValue);

	const getConfig = async (key: ConfigKey) =>
		await getURL(`${getUrlPrefix()}api/config/${key}`);

	const updateConfig = async (configValue: T) =>
		await patchURL(`${getUrlPrefix()}api/config`, configValue);

	const deleteConfig = async (key: string, id: string) =>
		await deleteURL(`${getUrlPrefix()}api/config/${key}/${id}`);

	return {
		data,
		loading,
		error,
		createConfig,
		getConfig,
		updateConfig,
		deleteConfig,
	};
};
