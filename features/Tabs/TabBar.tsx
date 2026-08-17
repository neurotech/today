import { TabLink } from "@/components/TabLink";

// No longer needs state or a setter: TabLink reads the active tab from the URL.
export const TabBar = () => (
  <nav className="flex">
    <TabLink href="/" label="🏡 Home" tabPosition="start" />
    <TabLink href="/reading" label="🔖 Reading" tabPosition="middle" />
    <TabLink href="/tools" label="🔨 Tools" tabPosition="middle" />
    <TabLink href="/config" label="⚙️ Config" tabPosition="end" />
  </nav>
);
