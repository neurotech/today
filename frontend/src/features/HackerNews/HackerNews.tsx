import { useState } from "react";
import { useHackerNews } from "../../hooks/useHackerNews";
import { formatDistanceToNowStrict } from "date-fns/formatDistanceToNowStrict";
import { Panel } from "../../components/Panel";
import { RefreshButton } from "../../components/Buttons/RefreshButton";
import { ReadingTile } from "../../components/ReadingTile";
import { HorizontalRule } from "../../components/HorizontalRule";
import { MoreLessButton } from "../../components/Buttons/MoreLessButton";

export const HackerNews = () => {
	const [showMore, setShowMore] = useState(false);
	const { stories, loading, error, getStories } = useHackerNews();
	const showFooter = stories && stories.slice(10).length > 0;

	return (
		<Panel
			heading="Hacker News"
			loading={loading}
			error={error}
			headingRight={<RefreshButton onClick={getStories} loading={loading} />}
			content={
				<div className="flex flex-col gap-2">
					{stories.map((s) => (
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
				showFooter && (
					<>
						<HorizontalRule />
						<MoreLessButton
							showMore={showMore}
							itemCount={stories.slice(10).length}
							onClick={() => setShowMore((p) => !p)}
						/>
					</>
				)
			}
		/>
	);
};
