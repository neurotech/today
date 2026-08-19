"use client";

type MoreLessButtonProps = {
  showMore: boolean;
  itemCount: number;
  onClick: () => void;
};

export const MoreLessButton = ({
  showMore,
  itemCount,
  onClick,
}: MoreLessButtonProps) => {
  const showMoreContent = (
    <>
      <span>and</span>
      <span className="font-semibold"> {itemCount} </span>
      <span>more...</span>
    </>
  );
  const label = showMore ? "Show Less" : showMoreContent;
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer transition-colors hover:bg-zinc-800 active:bg-zinc-900 text-zinc-700 hover:text-zinc-300 text-xs italic text-center leading-none select-none py-2"
    >
      {label}
    </button>
  );
};
