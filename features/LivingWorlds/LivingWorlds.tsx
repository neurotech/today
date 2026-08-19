import { Panel } from "@/components/Panel";

// The iframe is a sandbox for 2010-era global-scoped canvas code, kept
// deliberately isolated from the React tree. Absolute src, so it resolves the
// same wherever the component is mounted.
export const LivingWorlds = () => (
  <Panel
    content={
      <iframe
        width={710}
        height={960}
        src="/living-worlds/index.html"
        title="living-worlds"
        className="border rounded-xs border-zinc-700/70"
      />
    }
  />
);
