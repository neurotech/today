import { useState } from "react";
import { useHackerNews } from "../../hooks/useHackerNews";
import { formatDistanceToNowStrict } from "date-fns/formatDistanceToNowStrict";
import { Panel } from "../../components/Panel";
import { Separator } from "../../components/Separator";
import { Button } from "../../components/Buttons/Button";
import { RefreshButton } from "../../components/Buttons/RefreshButton";

export const HackerNews = () => {
	const [showMore, setShowMore] = useState(true);
	const { stories, loading, error, getStories } = useHackerNews();

	return (
		<Panel
			heading="Hacker News"
			headingRight={
				<section className="flex flex-row items-center gap-1">
					<RefreshButton onClick={getStories} loading={loading} />
					<Button
						compressed
						disabled={loading}
						label={showMore ? "Show Less" : "Show More"}
						onClick={() => setShowMore(!showMore)}
					/>
				</section>
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
									className="text-velvet-400 hover:text-velvet-200 transition-colors"
								>
									{s.title}
								</a>
							</h3>
							<h4 className="text-sm text-velvet-800">
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
					{stories && !showMore && (
						<div className="text-xs italic text-center leading-none select-none text-velvet-900">
							and <span>{stories.slice(5).length}</span> more...
						</div>
					)}
				</div>
			}
			loading={loading}
			error={error}
		/>
	);
};
