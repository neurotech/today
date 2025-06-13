import { useState } from "react";
import { useHackerNews } from "../../hooks/useHackerNews";
import { formatDistanceToNowStrict } from "date-fns/formatDistanceToNowStrict";
import { Panel } from "../../components/Panel";
import { Button } from "../../components/Buttons/Button";
import { RefreshButton } from "../../components/Buttons/RefreshButton";
import { ReadingTile } from "../../components/ReadingTile";
import { HorizontalRule } from "../../components/HorizontalRule";

export const HackerNews = () => {
	const [showMore, setShowMore] = useState(false);
	const { stories, loading, error, getStories } = useHackerNews();

	return (
		<Panel
			heading="Hacker News"
			loading={loading}
			error={error}
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
					{stories.slice(0, showMore ? 10 : 7).map((s) => (
						<ReadingTile
							key={s.id}
							url={s.url ?? `https://news.ycombinator.com/item?id=${s.id}`}
							title={s.title}
							score={s.score}
							time={formatDistanceToNowStrict(new Date(s.time * 1000), {
								addSuffix: true,
							})}
						/>
					))}
				</div>
			}
			footer={
				stories &&
				!showMore && (
					<>
						<HorizontalRule />
						<div className="text-xs italic text-center leading-none select-none text-velvet-900 py-2">
							and <span>{stories.slice(7).length}</span> more...
						</div>
					</>
				)
			}
		/>
	);
};
