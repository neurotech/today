import { getUrlPrefix } from "../utils/getUrlPrefix";
import { useFetch } from "./useFetch";

export type ConfigKey = "properties" | "birthdays";

export type BaseConfigEntity = {
  id: string | undefined;
  key: ConfigKey;
};

export interface Address extends BaseConfigEntity {
  value: { label: string; slug: string };
}

export interface Birthday extends BaseConfigEntity {
  value: { person: string; birthdate: string };
}

export type ConfigEntity = Address | Birthday;

export type UpdatedConfigEntity = BaseConfigEntity & {
  leftValue: string;
  rightValue: string;
};

export const EMPTY_ADDRESS = (): Address => ({
  id: undefined,
  key: "properties",
  value: {
    label: "",
    slug: "",
  },
});

export const EMPTY_BIRTHDAY = (): Birthday => ({
  id: undefined,
  key: "birthdays",
  value: {
    person: "",
    birthdate: "",
  },
});

export const isAddress = (entity: ConfigEntity): entity is Address => {
  return (entity as Address).value.slug !== undefined;
};

export const isBirthday = (entity: ConfigEntity): entity is Birthday => {
  return (entity as Birthday).value.birthdate !== undefined;
};

const urlPath = "api/config";

export const useConfig = () => {
  const { data, loading, error, postURL, getURL, patchURL, deleteURL } =
    useFetch<ConfigEntity, ConfigEntity[]>();

  const createConfig = async (configValue: ConfigEntity) =>
    await postURL(`${getUrlPrefix()}${urlPath}`, configValue);

  const getConfig = async (key: ConfigKey) =>
    await getURL(`${getUrlPrefix()}${urlPath}/${key}`);

  const updateConfig = async (configValue: ConfigEntity) =>
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
