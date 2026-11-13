import {
  CalendarCheck,
  Cog,
  Home,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Separator } from "./separator";
import { cn } from "../../utils/cn";
import type { Route } from "../../context/config-context";
import { useState } from "react";
import { useKeyboardShortcut } from "../../hooks/useKeyboardShortcut";

type SidebarProps = {
  currentPage: Route;
  setCurrentPage: (page: Route) => void;
  configInvalid: boolean;
};

const pages = [
  { id: "home", label: "Home", icon: Home },
  { id: "configuration", label: "Configuration", icon: Cog },
] as const;

export const Sidebar = ({
  currentPage,
  setCurrentPage,
  configInvalid,
}: SidebarProps) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  useKeyboardShortcut({ key: "[", handler: () => setExpanded(false) });
  useKeyboardShortcut({ key: "]", handler: () => setExpanded(true) });

  return (
    <div
      className={cn(
        "flex h-full flex-col items-start gap-2 bg-zinc-950/50 pt-2 pb-3 select-none transition-all",
        expanded ? "w-60" : "w-10",
      )}
    >
      <div
        className={cn(
          "flex w-full items-center justify-between",
          expanded ? "gap-2" : "",
        )}
      >
        {expanded ? (
          <div className="flex items-center gap-2 pl-2">
            <CalendarCheck className="text-zinc-700" />
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-400">
              Today
            </h1>
          </div>
        ) : null}
        <button
          type="button"
          className="flex size-10 cursor-pointer items-center justify-center text-zinc-600 transition-colors hover:text-zinc-300"
          onClick={() => setExpanded((p) => !p)}
        >
          {expanded ? <PanelLeftClose /> : <PanelLeftOpen />}
        </button>
      </div>
      <Separator />
      <nav aria-label="Main" className="flex w-full flex-1">
        <ul className="flex w-full flex-col justify-between gap-px">
          {pages.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                type="button"
                onClick={() =>
                  setCurrentPage(configInvalid ? "configuration" : id)
                }
                aria-current={currentPage === id ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 py-1.5 px-2 w-full rounded-l-sm text-left cursor-pointer aria-[current=page]:text-white hover:bg-zinc-900 text-sm transition-colors",
                  currentPage === id && "bg-zinc-900 hover:bg-zinc-900",
                  expanded
                    ? "rounded-l-sm px-2"
                    : "justify-center rounded-none px-2",
                )}
              >
                <Icon
                  size={16}
                  className={cn(
                    currentPage === id && "text-zinc-600",
                    expanded ? "text-zinc-800" : "text-zinc-400",
                  )}
                />
                {expanded ? label : ""}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
