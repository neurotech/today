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
      className="cursor-pointer transition-colors hover:bg-velvet-950 active:bg-velvet-1000 text-velvet-900 hover:text-velvet-300 text-xs italic text-center leading-none select-none py-2"
    >
      {label}
    </button>
  );
};
