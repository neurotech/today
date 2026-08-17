"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type TabPosition = "start" | "middle" | "end";

type TabLinkProps = {
  href: string;
  label: string;
  tabPosition: TabPosition;
};

const activeStyles = (isActive: boolean) =>
  isActive
    ? "bg-velvet-700 text-velvet-50"
    : "bg-velvet-950/70 text-velvet-500 hover:text-velvet-100";

// Keyed by a union rather than `string`, so this lookup is total.
const positionStyles: Record<TabPosition, string> = {
  start: "rounded-l-sm",
  middle: "border-x-1",
  end: "rounded-r-sm",
};

/**
 * Replaces the old TabButton. Same styling, but the active state comes from the
 * URL instead of React state, so tabs are linkable, bookmarkable and survive a
 * reload without localStorage.
 *
 * `role="tab"` with `aria-selected` was carried over from that TabButton, but a
 * `tab` is only valid inside a `tablist`, and TabBar is a plain `nav`. These are
 * real navigation links rather than tabs in the ARIA sense, so `aria-current`
 * is the correct way to mark the active one.
 */
export const TabLink = ({ href, label, tabPosition }: TabLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`${activeStyles(isActive)} ${positionStyles[tabPosition]} flex justify-center items-center cursor-pointer text-sm transition-colors px-2 py-1.5 border-1 border-transparent`}
    >
      {label}
    </Link>
  );
};
