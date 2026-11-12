import { TriangleAlert } from "lucide-react";
import { use, useEffect, useId, useRef } from "react";
import { DialogContext } from "../../context/dialog-context";
import { Button } from "./button";
import { Separator } from "./separator";

export default function Dialog() {
	const { dialog, close } = use(DialogContext);
	const ref = useRef<HTMLDialogElement>(null);
	const confirmRef = useRef<HTMLButtonElement>(null);
	const pressedOnBackdrop = useRef(false);
	const titleId = useId();
	const descId = useId();

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		if (dialog.open && !el.open) {
			el.showModal();
			confirmRef.current?.focus();
		} else if (!dialog.open && el.open) {
			el.close();
		}
	}, [dialog.open]);

	const handleConfirm = () => {
		dialog.onConfirm?.();
		close();
	};

    return (
     	// biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click is a pointer-only convenience; Escape (native cancel event) is the keyboard equivalent
		<dialog
			ref={ref}
			role="alertdialog"
			aria-labelledby={titleId}
			aria-describedby={descId}
			onCancel={(e) => {
				e.preventDefault();
				close();
			}}
			onMouseDown={(e) => {
				pressedOnBackdrop.current = e.target === e.currentTarget;
			}}
			onClick={(e) => {
				if (pressedOnBackdrop.current && e.target === e.currentTarget) {
					close();
				}
			}}
			className="mx-auto mt-12 w-[calc(100%-2rem)] max-w-lg rounded-md bg-zinc-800 p-0
				font-display text-white shadow-xs shadow-black/50 ring-1 ring-zinc-600/70
				backdrop:bg-black/65 backdrop:backdrop-blur-xs"
		>
			{dialog.open && (
				<div className="flex max-h-[calc(100dvh-6rem)] flex-col">
					<header className="flex items-center gap-2 p-2">
						<TriangleAlert size={16} className="text-rose-400" aria-hidden />
						<h2 id={titleId}>{dialog.title}</h2>
					</header>
					<Separator />

					<div className="overflow-y-auto p-4">
						<p id={descId} className="text-zinc-100">
							{dialog.message}
						</p>
						{dialog.body}
					</div>

					<Separator />
					<footer className="flex items-center justify-end gap-2 p-2">
						<Button variant="red" shortcut="Esc" onClick={close}>
							Cancel
						</Button>
						<Button
							ref={confirmRef}
							variant="indigo"
							shortcut={"Enter"}
							onClick={handleConfirm}
						>
							Yes
						</Button>
					</footer>
				</div>
			)}
		</dialog>
	);
}
