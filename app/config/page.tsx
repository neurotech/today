import type { Metadata } from "next";
import { Panel } from "@/components/Panel";
import { BirthdaysPanel } from "@/features/Config/BirthdaysPanel";

export const metadata: Metadata = { title: "Config" };

// Reads SQLite, so it must not be prerendered at build time.
export const dynamic = "force-dynamic";

// Was three columns: Properties, Birthdays, Placeholder. Properties went with
// the cut screenshot feature.
export default function Config() {
  return (
    <section className="grid grid-cols-[1fr_1fr] gap-2 items-start">
      <BirthdaysPanel />
      <Panel heading="Placeholder" content="TODO" />
    </section>
  );
}
