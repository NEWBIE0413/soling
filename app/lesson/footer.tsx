import { CheckCircle2, CornerDownLeft, XCircle } from "lucide-react";
import Link from "next/link";
import { useKey } from "react-use";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FooterProps = {
	onCheck: () => void;
	status: "correct" | "wrong" | "none" | "completed";
	disabled?: boolean;
	lessonId?: number;
	wrongHint?: string;
	explanation?: string;
	continueLabel?: string;
};

export const Footer = (
	{
		onCheck,
		status,
		disabled,
		lessonId,
		wrongHint,
		explanation,
		continueLabel,
	}: FooterProps,
) => {
	useKey(
		(event) =>
			event.key === "Enter" && !event.repeat && !event.altKey &&
			!event.ctrlKey && !event.metaKey &&
			!(event.target instanceof HTMLElement &&
				event.target.closest(
					"input, textarea, select, [contenteditable=true], button:not(.game-choice), a",
				)) &&
			!document.querySelector('[role="dialog"][data-state="open"]'),
		(event) => {
			if (!disabled) {
				event.preventDefault();
				onCheck();
			}
		},
		{},
		[onCheck, disabled],
	);
	const verdict = status === "correct" || status === "wrong";
	return (
		<footer
			className={cn(
				"shrink-0 border-t-2 border-border px-5 pb-[calc(20px+env(safe-area-inset-bottom))] pt-4 sm:px-8 sm:py-6",
				status === "correct"
					? "bg-[var(--game-green-soft)]"
					: status === "wrong"
					? "bg-[#fff0f1]"
					: "bg-white",
			)}
		>
			<div className="mx-auto flex max-w-[920px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="min-w-0 flex-1">
					{verdict
						? (
							<div
								role="status"
								className="animate-[fade_150ms_ease-out]"
							>
								<div
									className={cn(
										"flex items-center gap-2 text-lg font-extrabold",
										status === "correct"
											? "text-[#3c741d]"
											: "text-[#a1263d]",
									)}
								>
									{status === "correct"
										? <CheckCircle2 size={26} />
										: <XCircle size={26} />}
									{status === "correct"
										? "정답이에요!"
										: "다시 만나면 맞힐 수 있어요"}
								</div>
								{status === "wrong" && wrongHint && (
									<p className="mt-1 text-sm font-bold text-[#a1263d]">
										{wrongHint}
									</p>
								)}
								{explanation && (
									<p className="mt-2 max-h-28 overflow-y-auto text-sm leading-relaxed text-foreground">
										{explanation}
									</p>
								)}
							</div>
						)
						: (
							<p className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
								<CornerDownLeft size={16} />Enter로{" "}
								{status === "completed"
									? "계속하기"
									: "확인하기"}
							</p>
						)}
				</div>
				<div className="flex shrink-0 gap-3">
					{status === "completed" && lessonId !== undefined && (
						<Button
							asChild
							variant="ghost"
							className="flex-1 sm:flex-none"
						>
							<Link href={`/lesson/${lessonId}`}>다시 연습</Link>
						</Button>
					)}
					<Button
						disabled={disabled}
						onClick={onCheck}
						size="lg"
						variant={status === "wrong" ? "danger" : "secondary"}
						className="min-w-40 flex-1 sm:flex-none"
					>
						{continueLabel ?? (status === "none" ? "확인" : "계속")}
					</Button>
				</div>
			</div>
		</footer>
	);
};
