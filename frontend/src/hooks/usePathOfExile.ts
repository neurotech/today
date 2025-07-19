import { useEffect } from "react";
import { getUrlPrefix } from "../utils/getUrlPrefix";
import { useFetch } from "./useFetch";

type UsePathOfExileProps = {
  currency: string;
  league: string;
};

type PathOfExileCurrencyDetail = {
  id: number;
  icon: string;
  name: string;
  tradeId: string;
};

type PathOfExileData = {
  chaos_orb: PathOfExileCurrencyDetail;
  currency_detail: PathOfExileCurrencyDetail;
  buy: number;
  sell: number;
};

export const usePathOfExile = ({ currency, league }: UsePathOfExileProps) => {
  const { data, loading, error, getURL } = useFetch<
    PathOfExileData,
    PathOfExileData
  >();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Getting on mount only.
  useEffect(() => {
    getCurrencyData();
  }, []);

  const getCurrencyData = async () =>
    getURL(`${getUrlPrefix()}api/poe?currency=${currency}&league=${league}`);

  return { data, loading, error, getCurrencyData };
};
