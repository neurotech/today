import { StarIcon } from "@heroicons/react/24/outline";
import { Panel } from "../../components/Panel";
import { useGitHub } from "../../hooks/useGitHub";
import { useState } from "react";
import { Button } from "../../components/Button";
import { HorizontalRule } from "../../components/HorizontalRule";

export const GitHub = () => {
	const [showMore, setShowMore] = useState(false);
	const { data, loading, error } = useGitHub();

	return (
		<Panel
			heading="GitHub Trending"
			headingRight={
				<Button
					label={showMore ? "Show Less" : "Show More"}
					onClick={() => setShowMore(!showMore)}
				/>
			}
			content={
				<div className="flex flex-col gap-2">
					{data?.slice(0, showMore ? 10 : 5).map((d) => (
						<a
							key={`${d.repo_name}-${d.repo_owner}`}
							href={d.url}
							target="_blank"
							rel="noreferrer"
							className="border-1 border-emerald-950 rounded-sm hover:bg-black/35"
						>
							<section className="flex flex-col gap-1.5 p-2">
								<header className="flex justify-between gap-4 leading-none">
									<h1 className="text-md font-bold text-emerald-400">
										{d.repo_name}
										<span className="text-emerald-700"> by </span>
										{d.repo_owner}
									</h1>
									<div className="text-sm font-mono flex items-center">
										{d.stars}
										<StarIcon className="size-5 ml-2" />
									</div>
								</header>
								<HorizontalRule />
								<main className="grid grid-cols-[1fr_120px] gap-1">
									<h2 className="text-sm text-emerald-800">{d.description}</h2>
									<div className="bg-emerald-950 text-emerald-300 border-1 border-transparent rounded-xs text-xs px-1 py-0.5 text-center w-fit self-end justify-self-end">
										{d.language || "None"}
									</div>
								</main>
							</section>
						</a>
					))}
				</div>
			}
			loading={loading}
			error={error}
		/>
	);
};
