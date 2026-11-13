import { use, useEffect, useRef } from "react";
import { LightboxContext } from "../../context/lightbox-context";

export default function Lightbox() {
  const { lightbox, closeLightbox, clearLightbox } = use(LightboxContext);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (lightbox.open && !dialog.open) {
      dialog.showModal();
    } else if (!lightbox.open && dialog.open) {
      dialog.close();
    }
  }, [lightbox.open]);

  return (
    // Click anywhere to dismiss; Escape (native cancel event) is the keyboard equivalent.
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        closeLightbox();
      }}
      onClose={closeLightbox}
      onClick={closeLightbox}
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget && e.propertyName === "opacity") {
          clearLightbox();
        }
      }}
      className={[
        "font-display m-auto size-[calc(100%-2rem)] max-h-none max-w-none bg-transparent p-0 focus:outline-none",
        // dialog fade
        "opacity-0 transition-[opacity,display,overlay] transition-discrete duration-400 open:opacity-100 starting:open:opacity-0",
        // backdrop fade (the backdrop doesn't inherit the dialog's opacity)
        "backdrop:bg-black/65 backdrop:backdrop-blur-xs backdrop:opacity-0 backdrop:transition-[opacity,display,overlay] backdrop:transition-discrete backdrop:duration-400 open:backdrop:opacity-100 starting:open:backdrop:opacity-0",
        "motion-reduce:transition-none motion-reduce:backdrop:transition-none",
      ].join(" ")}
    >
      {lightbox.open && (
        <div className="flex h-full w-full items-center justify-center">
          {lightbox.body}
        </div>
      )}
    </dialog>
  );
}
