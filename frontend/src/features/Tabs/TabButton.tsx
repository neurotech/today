type TabPosition = "start" | "middle" | "end";

type TabButtonProps = {
  label: string;
  isActive: boolean;
  tabPosition: TabPosition;
  onClick: () => void;
};

const activeStyles: Record<string, string> = {
  true: "bg-velvet-700 text-velvet-50",
  false: "bg-velvet-950/70 text-velvet-500 hover:text-velvet-100",
};

const positionStyles: Record<TabPosition, string> = {
  start: "rounded-l-sm",
  middle: "border-x-1",
  end: "rounded-r-sm",
};

export const TabButton = ({
  label,
  isActive,
  tabPosition,
  onClick,
}: TabButtonProps) => {
  return (
    <button
      type="button"
      role="tab"
      onClick={onClick}
      className={`${activeStyles[isActive.toString()]} ${positionStyles[tabPosition]} flex justify-center items-center cursor-pointer text-sm transition-colors px-2 py-1.5 border-1 border-transparent`}
    >
      {label}
    </button>
  );
};
