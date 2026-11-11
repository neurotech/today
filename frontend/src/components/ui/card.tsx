import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";
import { Separator } from "./separator";

type CardProps = {
	children: ReactNode;
	headerTitle?: string;
	headerIcon?: ReactNode;
	className?: HTMLAttributes<HTMLElement>["className"];
};

export const Card = ({
	children,
	headerTitle,
	headerIcon,
	className,
}: CardProps) => (
	<section
		className={cn(
			"flex flex-col flex-1 rounded-md bg-zinc-800 shadow-black/50 shadow-xs ring-1 ring-zinc-600/70",
			className,
		)}
	>
		{headerTitle ? (
			<>
				<header className="flex flex-row p-2 items-center gap-2 text-zinc-600">
					{headerIcon}
					<h1 className="text-white">{headerTitle}</h1>
				</header>
				<Separator />
			</>
		) : null}
		<main className="p-2">{children}</main>
	</section>
);
