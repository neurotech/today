import { useState } from "react";
import { Panel } from "../../components/Panel";
import { usePathOfExile } from "../../hooks/usePathOfExile";
import { CurrencyChip } from "./CurrencyChip";
import { LeagueChip } from "./LeagueChip";
import { RefreshButton } from "../../components/Buttons/RefreshButton";

export const PathOfExile = () => {
	const [league, setLeague] = useState<string>("Settlers");
	const currency = "Divine Orb";
	const { data, loading, error, getCurrencyData } = usePathOfExile({
		league,
		currency,
	});
	const [quantity, setQuantity] = useState<number>(1);

	let zeroKey = 0;

	return (
		<Panel
			heading={"PoE Currency"}
			headingRight={
				<section className="flex flex-row items-center gap-1">
					<RefreshButton onClick={getCurrencyData} loading={loading} />
					<LeagueChip
						league={league}
						setLeague={setLeague}
						getCurrencyData={getCurrencyData}
					/>
				</section>
			}
			content={
				data && (
					<section className="flex flex-col gap-2">
						<div
							className="cursor-ns-resize"
							onWheel={(e) => {
								e.preventDefault();
								e.stopPropagation();

								if (e.deltaY > 0) setQuantity((prev) => Math.max(0, prev - 1));
								if (e.deltaY <= 0) setQuantity((prev) => prev + 1);
							}}
							onMouseDown={(e) => {
								e.preventDefault();
								e.stopPropagation();

								if (e.button === 1) setQuantity(1);
							}}
						>
							<div className="flex flex-row items-center justify-center gap-2 font-semibold select-none tabular-nums text-lg text-velvet-400 hover:text-velvet-300">
								<div>
									{Array.from({ length: 4 - quantity.toString().length }).map(
										() => {
											zeroKey = zeroKey + 1;
											return (
												<span key={zeroKey} className="text-velvet-950">
													0
												</span>
											);
										},
									)}
									<span>{quantity}</span>
								</div>
								<span className="text-velvet-800">&times;</span>
								{data.currency_detail.name}
								<img
									src={data.currency_detail.icon}
									alt={`Icon for ${currency}`}
									className="size-5 mt-1"
								/>
							</div>
						</div>

						<CurrencyChip
							variant={"buy"}
							quantity={quantity}
							pricePer={data.buy}
							currencyName={data.chaos_orb.name}
							currencyIcon={data.chaos_orb.icon}
						/>
						<CurrencyChip
							variant={"sell"}
							quantity={quantity}
							pricePer={data.sell}
							currencyName={data.chaos_orb.name}
							currencyIcon={data.chaos_orb.icon}
						/>
					</section>
				)
			}
			loading={loading}
			error={error}
		/>
	);
};
