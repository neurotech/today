"use client";

// A Server Component cannot hand a function across the boundary, and an icon is
// a function. The alternative is passing icon names as strings and looking them
// up in TabLink, which costs the whole 324-icon barrel in the client bundle.
// Nothing here reads server state, and TabLink is already a Client Component,
// so moving the boundary up one level is the cheaper trade.

import {
  BookOpenIcon,
  CogIcon,
  HomeIcon,
  WrenchIcon,
} from "@heroicons/react/24/outline";
import { TabLink } from "@/components/TabLink";

export const TabBar = () => (
  <nav className="flex" aria-label="Sections">
    <TabLink href="/" label="Home" tabPosition="start" icon={HomeIcon} />
    <TabLink
      href="/reading"
      label="Reading"
      tabPosition="middle"
      icon={BookOpenIcon}
    />
    <TabLink
      href="/tools"
      label="Tools"
      tabPosition="middle"
      icon={WrenchIcon}
    />
    <TabLink href="/config" label="Config" tabPosition="end" icon={CogIcon} />
  </nav>
);
