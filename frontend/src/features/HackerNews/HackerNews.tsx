import { useState } from "react";
import { useHackerNews } from "../../hooks/useHackerNews";
import { formatDistanceToNowStrict } from "date-fns/formatDistanceToNowStrict";
import { Panel } from "../../components/Panel";
import { Separator } from "../../components/Separator";
import { Button } from "../../components/Button";

export const HackerNews = () => {
	const [showMore, setShowMore] = useState(true);
	const { stories, loading, error } = useHackerNews();

	return (
		<Panel
			heading="Hacker News"
			headingRight={
				<Button
					label={showMore ? "Show Less" : "Show More"}
					onClick={() => setShowMore(!showMore)}
				/>
			}
			content={
				<div className="flex flex-col gap-2">
					{stories.slice(0, showMore ? 10 : 5).map((s) => (
						<div key={s.id}>
							<h3 className="text-md font-bold">
								<a
									href={s.url ?? `https://news.ycombinator.com/item?id=${s.id}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-emerald-400 hover:text-emerald-100 transition-colors"
								>
									{s.title}
								</a>
							</h3>
							<h4 className="text-sm text-emerald-800">
								{formatDistanceToNowStrict(new Date(s.time * 1000), {
									addSuffix: true,
								})}
								<Separator />
								{s.score} points
								<Separator />
								{
									new URL(
										s.url ?? `https://news.ycombinator.com/item?id=${s.id}`,
									).hostname
								}
							</h4>
						</div>
					))}
				</div>
			}
			loading={loading}
			error={error}
		/>
	);
};
