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

// A `fillWidth` prop switched a `flex-1` in here. No caller ever passed it; the
// grid on each page sizes the panels.
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
      className={`flex flex-col shadow-xs/55 border rounded-sm border-velvet-950 bg-velvet-1000`}
    >
      {heading && (
        <>
          <header className="flex flex-row justify-between items-center p-1">
            <h2 className="text-velvet-500 font-bold select-none text-md px-1">
              {heading}
            </h2>
            {headingRight}
          </header>
          <HorizontalRule />
        </>
      )}
      {/* Neither of these is a heading; both were h3. */}
      {loading && (
        <div className="flex flex-col justify-center self-center min-h-50 select-none">
          <Loading />
        </div>
      )}
      {/* The state you see precisely when a source dies, so it gets the same
          care as the happy path: it used to render unstyled and unpadded,
          outside the content wrapper. */}
      {error && (
        <p className="p-2 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && <div className="flex flex-col p-2">{content}</div>}
      {footer}
    </section>
  );
};
