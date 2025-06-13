import { StarIcon } from "@heroicons/react/24/outline";
import { Panel } from "../../components/Panel";
import { useGitHub } from "../../hooks/useGitHub";
import { useState } from "react";
import { Button } from "../../components/Buttons/Button";
import { HorizontalRule } from "../../components/HorizontalRule";
import { RefreshButton } from "../../components/Buttons/RefreshButton";

export const GitHub = () => {
	const [showMore, setShowMore] = useState(false);
	const { data, loading, error, getGitHubTrending } = useGitHub();

	return (
		<Panel
			heading="GitHub Trending"
			headingRight={
				<section className="flex flex-row items-center gap-1">
					<RefreshButton onClick={getGitHubTrending} loading={loading} />
					<Button
						compressed
						label={showMore ? "Show Less" : "Show More"}
						onClick={() => setShowMore(!showMore)}
					/>
				</section>
			}
			content={
				<div className="flex flex-col gap-2">
					{data?.slice(0, showMore ? 10 : 5).map((d) => (
						<a
							key={`${d.repo_name}-${d.repo_owner}`}
							href={d.url}
							target="_blank"
							rel="noreferrer"
							className="border-1 rounded-sm border-velvet-900/60 hover:border-velvet-900/85 bg-velvet-950/50 hover:bg-velvet-1100/20 transition-colors"
						>
							<section className="flex flex-col gap-1.5 p-2">
								<header className="flex justify-between gap-4 leading-none">
									<h1 className="text-md font-bold text-velvet-400">
										{d.repo_name}
										<span className="text-velvet-900 font-normal"> by </span>
										{d.repo_owner}
									</h1>
									<div className="text-sm font-mono flex items-center text-velvet-600">
										{d.stars}
										<StarIcon className="size-5 ml-1.5 text-velvet-800" />
									</div>
								</header>
								<HorizontalRule />
								<main className="grid grid-cols-[1fr_120px] gap-1">
									<h2 className="text-sm text-velvet-500">{d.description}</h2>
									<div className="bg-velvet-900/80 text-velvet-300 border-1 border-transparent rounded-xs text-xs px-1 py-0.5 text-center font-bold w-fit self-end justify-self-end">
										{d.language || "None"}
									</div>
								</main>
							</section>
						</a>
					))}
					{data && !showMore && (
						<div className="text-xs italic text-center leading-none select-none text-velvet-900">
							and <span>{data.slice(5).length}</span> more...
						</div>
					)}
				</div>
			}
			loading={loading}
			error={error}
		/>
	);
};
