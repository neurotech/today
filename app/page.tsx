import { LivingWorlds } from "@/features/LivingWorlds/LivingWorlds";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <section className="flex flex-col gap-2 w-fit">
      <LivingWorlds />
    </section>
  );
}
