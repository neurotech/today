import { useState } from "react";
import { useLobsters } from "../../hooks/useLobsters";
import { Panel } from "../../components/Panel";
import { RefreshButton } from "../../components/Buttons/RefreshButton";
import { ReadingTile } from "../../components/ReadingTile";
import { formatDistanceToNowStrict } from "date-fns";
import { HorizontalRule } from "../../components/HorizontalRule";
import { MoreLessButton } from "../../components/Buttons/MoreLessButton";

export const Lobsters = () => {
	const [showMore, setShowMore] = useState(false);
	const { data, loading, error, getLobsters } = useLobsters();
	const showFooter = data && data.slice(7).length > 0;

	return (
		<Panel
			heading="Lobsters"
			loading={loading}
			error={error}
			headingRight={<RefreshButton onClick={getLobsters} loading={loading} />}
			content={
				<div className="flex flex-col gap-2">
					{data?.slice(0, showMore ? data.length : 7).map((d) => (
						<ReadingTile
							key={d.short_id}
							url={d.url === "" ? d.comments_url : d.url}
							title={d.title}
							score={d.score}
							time={formatDistanceToNowStrict(d.created_at, {
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
							itemCount={data.slice(7).length}
							onClick={() => setShowMore((p) => !p)}
						/>
					</>
				)
			}
		/>
	);
};
