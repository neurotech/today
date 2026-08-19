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
    ? "bg-zinc-600 text-zinc-50"
    : "bg-zinc-800/70 text-zinc-400 hover:text-zinc-100";

// Keyed by a union rather than `string`, so this lookup is total.
const positionStyles: Record<TabPosition, string> = {
  start: "rounded-l-sm",
  middle: "border-x-1",
  end: "rounded-r-sm",
};

/**
 * The active state comes from the URL rather than React state, so tabs are
 * linkable, bookmarkable and survive a reload without localStorage.
 *
 * A `tab` role is only valid inside a `tablist`, and TabBar is a plain `nav`.
 * These are real navigation links rather than tabs in the ARIA sense, so
 * `aria-current` is the correct way to mark the active one.
 */
export const TabLink = ({ href, label, tabPosition }: TabLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`${activeStyles(isActive)} ${positionStyles[tabPosition]} flex justify-center items-center cursor-pointer text-sm transition-colors px-2 py-1.5 border border-transparent`}
    >
      {label}
    </Link>
  );
};
