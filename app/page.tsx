import { Suspense } from "react";
import { Panel } from "@/components/Panel";
import { GitHub } from "@/features/GitHub/GitHub";

export const dynamic = "force-dynamic";

// The old grid was `[373px_1fr_0.75fr_373px]`: Living Worlds, GitHub,
// Properties, Path of Exile. Three of those are gone (PoE cut, Living Worlds
// deferred, Properties cut after domain.com.au started blocking automation), so
// home is a single column until something joins it.
export default function Home() {
  return (
    <section className="grid grid-cols-1 gap-2 items-start">
      <Suspense
        fallback={<Panel heading="GitHub Trending" loading content={null} />}
      >
        <GitHub />
      </Suspense>
    </section>
  );
}
