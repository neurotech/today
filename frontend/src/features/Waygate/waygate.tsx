import { useFetch } from "../../hooks/useFetch";

export const Waygate = () => {
	const {
		data: waygateItems,
		loading,
		error,
	} = useFetch({ url: "http://slab.meteor-symmetric.ts.net:8008/items" });

	if (loading) return <>Loading.../</>;

	if (error) return <>Error!</>;

	return <>{JSON.stringify(waygateItems)}</>;
};
