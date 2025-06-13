export const getUrlPrefix = () =>
	import.meta.env.MODE === "development" ? "http://slab:7000/" : "/";
