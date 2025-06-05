import { useState } from "react";

type LeagueChipProps = {
	league: string;
	setLeague: (league: string) => void;
	getCurrencyData: () => void;
};

export const LeagueChip = ({
	league,
	setLeague,
	getCurrencyData,
}: LeagueChipProps) => {
	const [open, setOpen] = useState<boolean>(false);

	const leagues = ["Settlers", "Standard"];

	const handleLeagueChange = (newLeague: string) => {
		setLeague(newLeague);
		setOpen(false);
		getCurrencyData();
	};

	return (
		<div className="relative inline-block text-left">
			<button
				type="button"
				onClick={() => setOpen((prev) => !prev)}
				className="flex items-center gap-2 px-2 py-0.5 font-semibold text-emerald-300/90 hover:text-emerald-200 cursor-pointer bg-emerald-950 hover:bg-emerald-900 transition-colors rounded-xs select-none"
			>
				<span className="text-sm">{league}</span>
			</button>

			{open && (
				<div
					className="absolute right-0 z-10 mt-1 w-42 origin-top-right rounded-md bg-black/90 shadow-lg ring-1 ring-black/5 focus:outline-hidden"
					role="menu"
					aria-orientation="vertical"
					aria-labelledby="menu-button"
				>
					<div className="py-1">
						{leagues.map((league, i) => (
							<div
								key={league.toLowerCase()}
								className="block px-4 py-2 text-sm text-white hover:text-emerald-400 transition-colors cursor-pointer"
								role="menuitem"
								tabIndex={-1}
								id={`menu-item-${i}`}
								onClick={() => handleLeagueChange(league)}
								onKeyDown={() => handleLeagueChange(league)}
							>
								{league}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
