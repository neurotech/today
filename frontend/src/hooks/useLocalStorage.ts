type ConfigKey = "activeTab" | "addresses";

const prefix = "today";

export const useLocalStorage = () => {
  const getValue = (key: ConfigKey): string =>
    localStorage.getItem(`${prefix}_${key}`) || "";

  const storeValue = (key: ConfigKey, newValue: string) =>
    localStorage.setItem(`${prefix}_${key}`, newValue);

  const deleteValue = (key: string) => localStorage.removeItem(key);

  return {
    storeValue,
    getValue,
    deleteValue,
  };
};
