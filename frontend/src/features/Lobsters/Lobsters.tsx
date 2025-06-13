import { useState } from "react";
import { useLobsters } from "../../hooks/useLobsters";
import { Panel } from "../../components/Panel";
import { Button } from "../../components/Buttons/Button";
import { RefreshButton } from "../../components/Buttons/RefreshButton";
import { ReadingTile } from "../../components/ReadingTile";
import { formatDistanceToNowStrict } from "date-fns";
import { HorizontalRule } from "../../components/HorizontalRule";

export const Lobsters = () => {
	const [showMore, setShowMore] = useState(false);
	const { data, loading, error, getLobsters } = useLobsters();

	return (
		<Panel
			heading="Lobsters"
			loading={loading}
			error={error}
			headingRight={
				<section className="flex flex-row items-center gap-1">
					<RefreshButton onClick={getLobsters} loading={loading} />
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
					{data?.slice(0, showMore ? data.length : 7).map((d) => (
						<ReadingTile
							key={d.short_id}
							url={d.url}
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
				data &&
				!showMore && (
					<>
						<HorizontalRule />
						<div className="text-xs italic text-center leading-none select-none text-velvet-900 py-2">
							and <span>{data.slice(7).length}</span> more...
						</div>
					</>
				)
			}
		/>
	);
};
