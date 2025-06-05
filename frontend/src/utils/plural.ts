export const plural = (count: number) => {
	if (count === 1) return "";
	if (count > 1 || count === 0) return "s";
};
