import { createContext, useState, type ReactNode } from "react";
import { useFetch } from "../hooks/useFetch";
import z from "zod";

export type Route = "home" | "youtube" | "configuration";

export const YouTubeConfigSchema = z.object({
  channelName: z.string(),
  channelUrl: z.string(),
});

export type YouTubeConfig = z.infer<typeof YouTubeConfigSchema>;

export type ConfigResponse = {
  town: string;
  weatherapikey: string;
  youtube?: string;
};

export type ConfigData = {
  town: string;
  weatherapikey: string;
  youtube: YouTubeConfig[];
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
    youtube: [],
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
  } = useFetch<ConfigResponse>({
    url: "/api/config",
  });

  const youtube = data?.youtube
    ? z.array(YouTubeConfigSchema).parse(JSON.parse(data.youtube))
    : [];

  const config: ConfigData = {
    town: data?.town ?? "",
    weatherapikey: data?.weatherapikey ?? "",
    youtube,
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
