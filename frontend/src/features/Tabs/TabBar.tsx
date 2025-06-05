import { useLocalStorage } from "../../hooks/useLocalStorage";
import { TabButton } from "./TabButton";

export type TabID = "home-tab" | "reading-tab" | "tools-tab" | "config-tab";

type TabBarProps = {
	activeTab: TabID;
	setActiveTab: (activeTab: TabID) => void;
};

export const TabBar = ({ activeTab, setActiveTab }: TabBarProps) => {
	const { storeValue } = useLocalStorage();

	const handleTabChange = (tabID: TabID) => {
		storeValue("activeTab", tabID);
		setActiveTab(tabID);
	};

	return (
		<nav role="tablist" className="flex">
			<TabButton
				label={"🏡 Home"}
				tabPosition="start"
				isActive={activeTab === "home-tab"}
				onClick={() => handleTabChange("home-tab")}
			/>
			<TabButton
				label={"🔖 Reading"}
				tabPosition="middle"
				isActive={activeTab === "reading-tab"}
				onClick={() => handleTabChange("reading-tab")}
			/>
			<TabButton
				label={"🔨 Tools"}
				tabPosition="middle"
				isActive={activeTab === "tools-tab"}
				onClick={() => handleTabChange("tools-tab")}
			/>
			<TabButton
				label={"⚙️ Config"}
				tabPosition="end"
				isActive={activeTab === "config-tab"}
				onClick={() => handleTabChange("config-tab")}
			/>
		</nav>
	);
};
