import type { Metadata } from "next";
import { Suspense } from "react";
import { Panel } from "@/components/Panel";
import { HackerNews } from "@/features/HackerNews/HackerNews";
import { Lobsters } from "@/features/Lobsters/Lobsters";

export const metadata: Metadata = { title: "Reading" };

export const dynamic = "force-dynamic";

export default function Reading() {
  return (
    <section className="grid grid-cols-[1fr_1fr] gap-2 items-start">
      <Suspense fallback={<Panel heading="Lobsters" loading content={null} />}>
        <Lobsters />
      </Suspense>

      <Suspense
        fallback={<Panel heading="Hacker News" loading content={null} />}
      >
        <HackerNews />
      </Suspense>
    </section>
  );
}
