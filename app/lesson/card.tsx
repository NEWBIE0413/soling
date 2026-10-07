import { useCallback } from "react";

import { Check, X } from "lucide-react";
import Image from "next/image";
import { useKey } from "react-use";

import { cn } from "@/lib/utils";

import { play } from "./audio";

type CardProps = {
	id: number;
	text: string;
	imageSrc: string | null;
	audioSrc: string | null;
	shortcut: string;
	selected?: boolean;
	onClick: () => void;
	status?: "correct" | "wrong" | "none";
	disabled?: boolean;
	layout: "grid" | "list";
	big?: boolean;
};

const isScript = (text: string) =>
	/[぀-ヿ가-힣一-龯]/.test(text) && text.length <= 2;

export const Card = ({
	text,
	imageSrc,
	audioSrc,
	shortcut,
	selected,
	onClick,
	status,
	disabled,
	layout,
	big,
}: CardProps) => {
	const handleClick = useCallback(() => {
		if (disabled || status !== "none") return;
		play(audioSrc);
		onClick();
	}, [disabled, status, onClick, audioSrc]);

	useKey(
		(event) =>
			event.key === shortcut && !event.repeat && !event.altKey &&
			!event.ctrlKey && !event.metaKey &&
			!(event.target instanceof HTMLElement &&
				event.target.closest(
					"input, textarea, select, [contenteditable=true]",
				)) &&
			!document.querySelector('[role="dialog"][data-state="open"]'),
		handleClick,
		{},
		[handleClick, shortcut],
	);
	const large = big ?? isScript(text);
	const verdict = selected && (status === "correct" || status === "wrong");

	return (
		<button
			type="button"
			onClick={handleClick}
			disabled={disabled}
			aria-pressed={!!selected}
			aria-label={`${shortcut}. ${text}`}
			data-status={selected ? status : undefined}
			className={cn(
				"game-choice flex min-h-24 w-full items-center gap-4 p-4 text-foreground sm:p-5",
				layout === "grid" &&
					"min-h-36 flex-col justify-center pb-10 sm:min-h-40",
				selected && status === "wrong" &&
					"animate-[shake_220ms_ease-in-out] motion-reduce:animate-none",
				disabled && "cursor-not-allowed opacity-60",
			)}
		>
			{imageSrc && (
				<span className="relative block h-24 w-24 shrink-0">
					<Image
						src={imageSrc}
						fill
						alt=""
						sizes="96px"
						className="object-contain"
					/>
				</span>
			)}
			<span
				className={cn(
					"min-w-0 flex-1 font-bold [overflow-wrap:anywhere] [word-break:keep-all]",
					large
						? "text-4xl leading-tight sm:text-5xl"
						: "text-base leading-relaxed sm:text-xl",
					layout === "grid" ? "text-center" : "text-left",
				)}
			>
				{text}
			</span>
			<span
				className={cn(
					"flex h-7 min-w-7 shrink-0 items-center justify-center rounded-lg bg-muted px-1 text-xs font-extrabold text-muted-foreground",
					layout === "grid" && "absolute bottom-3 right-3",
					selected && "bg-white text-sky-700",
					verdict && status === "correct" && "text-green-700",
					verdict && status === "wrong" && "text-rose-700",
				)}
			>
				{selected
					? status === "wrong"
						? <X size={18} aria-hidden />
						: <Check size={18} aria-hidden />
					: shortcut}
			</span>
		</button>
	);
};
