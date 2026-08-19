import type { ReactNode } from "react";
import { HorizontalRule } from "./HorizontalRule";
import { Loading } from "./Loading";

interface PanelProps {
  content: ReactNode;
  loading?: boolean;
  error?: string | null;
  heading?: string;
  headingRight?: ReactNode;
  footer?: string | ReactNode;
}

export const Panel = ({
  content,
  loading = false,
  error,
  heading,
  headingRight,
  footer,
}: PanelProps) => {
  return (
    <section
      className={`flex flex-col shadow-xs/55 border rounded-sm border-zinc-800 bg-zinc-900`}
    >
      {heading && (
        <>
          <header className="flex flex-row justify-between items-center p-1">
            <h2 className="text-zinc-400 font-bold select-none text-md px-1">
              {heading}
            </h2>
            {headingRight}
          </header>
          <HorizontalRule />
        </>
      )}
      {loading && (
        <div className="flex flex-col justify-center self-center min-h-50 select-none">
          <Loading />
        </div>
      )}
      {error && (
        <p className="p-2 text-sm text-zinc-300" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && <div className="flex flex-col p-2">{content}</div>}
      {footer}
    </section>
  );
};
