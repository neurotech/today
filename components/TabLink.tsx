"use client";

import type * as OutlineIcons from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

type TabPosition = "start" | "middle" | "end";

// Every component the outline set exports, derived from the module rather than
// written out, so it follows the package rather than going stale against it.
// `import type` matters: the namespace erases at compile time, so call sites
// still import the single icon they use and Next's optimizePackageImports goes
// on tree-shaking the barrel. A value import here would pull all 324 in.
type OutlineIcon = (typeof OutlineIcons)[keyof typeof OutlineIcons];

type TabLinkProps = {
  href: string;
  label: string;
  tabPosition: TabPosition;
  icon: OutlineIcon;
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
export const TabLink = ({
  href,
  label,
  tabPosition,
  icon: Icon,
}: TabLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`${activeStyles(isActive)} ${positionStyles[tabPosition]} flex justify-center items-center cursor-pointer text-sm transition-colors px-2 py-1.5 border border-transparent gap-2`}
    >
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </Link>
  );
};
