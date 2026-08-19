import { TabLink } from "@/components/TabLink";

export const TabBar = () => (
  <nav className="flex" aria-label="Sections">
    <TabLink href="/" label="🏡 Home" tabPosition="start" />
    <TabLink href="/reading" label="🔖 Reading" tabPosition="middle" />
    <TabLink href="/tools" label="🔨 Tools" tabPosition="middle" />
    <TabLink href="/config" label="⚙️ Config" tabPosition="end" />
  </nav>
);
