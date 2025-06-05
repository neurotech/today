import { useEffect, useState } from "react";

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
	const [data, setData] = useState<PathOfExileData | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		getCurrencyData();
	}, []);

	const url = `${urlPrefix}api/poe?currency=${currency}&league=${league}`;

	const getCurrencyData = async () => {
		setLoading(true);

		fetch(url)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((json) => {
				setData(json);
				setError(null);
			})
			.catch((err) => {
				setError(err.message);
				setData(null);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return { data, loading, error, getCurrencyData };
};
