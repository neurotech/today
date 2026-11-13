import { CalendarCheck, Cog, Home } from "lucide-react";
import { Separator } from "./separator";
import { cn } from "../../utils/cn";
import type { Route } from "../../context/config-context";

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
  return (
    <div className="flex h-full min-w-60 flex-col items-start gap-2 bg-zinc-950/50 p-2 select-none">
      <div className="flex items-center gap-2">
        <CalendarCheck size={25} className="text-zinc-700" />
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-400">
          Today
        </h1>
      </div>
      <Separator />
      <nav aria-label="Main" className="w-full">
        <ul className="flex flex-col gap-1">
          {pages.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                type="button"
                onClick={() =>
                  setCurrentPage(configInvalid ? "configuration" : id)
                }
                aria-current={currentPage === id ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 py-1.5 px-2 w-full rounded-sm text-left cursor-pointer aria-[current=page]:text-white hover:bg-zinc-600/10 text-sm",
                  currentPage === id && "bg-zinc-600/20",
                )}
              >
                <Icon
                  size={16}
                  className={cn(
                    "text-zinc-800",
                    currentPage === id && "text-zinc-600",
                  )}
                />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
