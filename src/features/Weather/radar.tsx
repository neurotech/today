import { use } from "react";
import { LightboxContext } from "../../context/lightbox-context";

const RADAR_SRC = "http://slab:7777";

const enlargedRadar = (
  <img
    src={RADAR_SRC}
    alt="Radar, enlarged"
    className="h-full w-full cursor-pointer object-contain"
  />
);

export default function Radar() {
  const { openLightbox } = use(LightboxContext);

  return (
    <button
      type="button"
      onClick={() => openLightbox(enlargedRadar)}
      className="group rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
    >
      <img
        src={RADAR_SRC}
        alt="Radar"
        className="block size-48 cursor-pointer rounded-sm grayscale invert transition-all group-hover:grayscale-0 group-hover:invert-0 group-focus-visible:grayscale-0 group-focus-visible:invert-0"
      />
    </button>
  );
}
