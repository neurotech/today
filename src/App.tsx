import Dialog from "./components/ui/dialog";
import { Home } from "./pages/home";
import { Sidebar } from "./components/ui/sidebar";
import { Configuration } from "./pages/configuration";
import { use, type JSX } from "react";
import {
  ConfigContext,
  type ConfigData,
  type Route,
} from "./context/config-context";

const renderPage = (page: Route, config: ConfigData): JSX.Element => {
  switch (page) {
    case "home":
    default:
      return <Home config={config} />;
    case "configuration":
      return <Configuration />;
  }
};

export const App = () => {
  const { loading, error } = use(ConfigContext);

  if (error) {
    return (
      <div className="p-4 text-zinc-300">
        Couldn't load configuration: {error.message}
      </div>
    );
  }

  return <AppShell loading={loading} />;
};

export const AppShell = ({ loading }: { loading: boolean }) => {
  const { config, invalid, currentPage, setCurrentPage } = use(ConfigContext);

  return (
    <div className="font-display flex h-screen flex-1 bg-zinc-900 text-zinc-500 selection:bg-zinc-300 selection:text-zinc-700">
      <main className="relative flex flex-1 flex-row">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          configInvalid={invalid}
        />
        <div className="flex flex-1 gap-4 overflow-y-auto p-4">
          {loading ? <></> : renderPage(currentPage, config)}
        </div>
      </main>
      <Dialog />
    </div>
  );
};
