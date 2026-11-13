import { createContext, useState, type ReactNode } from "react";
import { useFetch } from "../hooks/useFetch";

export type Route = "home" | "configuration";

export type ConfigData = {
  town: string;
  weatherapikey: string;
};

type ConfigContextType = {
  invalid: boolean;
  config: ConfigData;
  loading: boolean;
  refetch: () => void;
  error: Error | null;
  currentPage: Route;
  setCurrentPage: (page: Route) => void;
};

const defaultValues: ConfigContextType = {
  invalid: true,
  config: {
    town: "",
    weatherapikey: "",
  },
  loading: false,
  refetch: () => {},
  error: null,
  currentPage: "home",
  setCurrentPage: () => {},
};

export const ConfigContext = createContext<ConfigContextType>(defaultValues);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const {
    data,
    loading: fetching,
    error,
    refetch,
  } = useFetch<ConfigData>({
    url: "/api/config",
  });

  const config: ConfigData = {
    town: data?.town ?? "",
    weatherapikey: data?.weatherapikey ?? "",
  };

  const invalid = config.town === "" || config.weatherapikey === "";

  // Only the first load counts as loading. During a refetch, useFetch keeps
  // the previous data, so `data !== null` and the UI stays mounted.
  const loading = fetching && data === null;

  // null = nothing chosen yet. Decide the starting page once, when the first
  // data arrives, and never again.
  const [page, setPage] = useState<Route | null>(null);

  if (page === null && data !== null) {
    setPage(invalid ? "configuration" : "home");
  }

  return (
    <ConfigContext.Provider
      value={{
        invalid,
        config,
        loading,
        error,
        refetch,
        currentPage: page ?? "home",
        setCurrentPage: setPage,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
