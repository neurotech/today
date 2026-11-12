export const LivingWorlds = () => (
  <iframe
    width={710}
    height={960}
    src="/living-worlds/index.html"
    title="living-worlds"
    // Disable the warning below as we control everything in living worlds:
    // oxlint-disable-next-line react/iframe-missing-sandbox
    sandbox="allow-scripts allow-same-origin"
  />
);
