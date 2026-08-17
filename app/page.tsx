import { Suspense } from "react";
import { Panel } from "@/components/Panel";
import { GitHub } from "@/features/GitHub/GitHub";
import { LivingWorlds } from "@/features/LivingWorlds/LivingWorlds";

export const dynamic = "force-dynamic";

// The old grid was `[373px_1fr_0.75fr_373px]`: Living Worlds, GitHub,
// Properties, Path of Exile. PoE and Properties are cut, so the two remaining
// columns keep their original tracks.
export default function Home() {
  return (
    <section className="grid grid-cols-[728px_1fr] gap-2 items-start">
      <section className="flex flex-col gap-2 w-fit">
        <LivingWorlds />
      </section>

      <section className="flex flex-col gap-2">
        <Suspense
          fallback={<Panel heading="GitHub Trending" loading content={null} />}
        >
          <GitHub />
        </Suspense>
      </section>
    </section>
  );
}
