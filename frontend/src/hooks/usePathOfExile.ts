import { useEffect } from "react";
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

const urlPrefix =
	import.meta.env.MODE === "development" ? "http://slab:7000/" : "/";

export const usePathOfExile = ({ currency, league }: UsePathOfExileProps) => {
	const { data, loading, error, getURL } = useFetch<PathOfExileData>();

	useEffect(() => {
		getCurrencyData();
	}, []);

	const getCurrencyData = async () =>
		getURL(`${urlPrefix}api/poe?currency=${currency}&league=${league}`);

	return { data, loading, error, getCurrencyData };
};
