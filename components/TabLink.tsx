"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type TabPosition = "start" | "middle" | "end";

type TabLinkProps = {
  href: string;
  label: string;
  tabPosition: TabPosition;
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

/**
 * Replaces the old TabButton. Same styling, but the active state comes from the
 * URL instead of React state, so tabs are linkable, bookmarkable and survive a
 * reload without localStorage.
 */
export const TabLink = ({ href, label, tabPosition }: TabLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      role="tab"
      aria-selected={isActive}
      className={`${activeStyles[isActive.toString()]} ${positionStyles[tabPosition]} flex justify-center items-center cursor-pointer text-sm transition-colors px-2 py-1.5 border-1 border-transparent`}
    >
      {label}
    </Link>
  );
};
