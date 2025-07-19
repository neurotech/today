import { getUrlPrefix } from "../utils/getUrlPrefix";
import { useFetch } from "./useFetch";

export type ConfigKey = "properties" | "birthdays";

type BaseConfig = {
  key: string;
  id?: string;
};

export type Address = {
  key: string;
  id?: string;
  value: {
    label: string;
    slug: string;
  };
};

export type Birthday = BaseConfig & {
  value: {
    person: string;
    birthdate: string;
  };
};

const urlPath = "api/config";

export const useConfig = <T, K>() => {
  const { data, loading, error, postURL, getURL, patchURL, deleteURL } =
    useFetch<T, K>();

  const createConfig = async (configValue: T) =>
    await postURL(`${getUrlPrefix()}${urlPath}`, configValue);

  const getConfig = async (key: ConfigKey) =>
    await getURL(`${getUrlPrefix()}${urlPath}/${key}`);

  const updateConfig = async (configValue: T) =>
    await patchURL(`${getUrlPrefix()}${urlPath}`, configValue);

  const deleteConfig = async (key: string, id: string) =>
    await deleteURL(`${getUrlPrefix()}${urlPath}/${key}/${id}`);

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
