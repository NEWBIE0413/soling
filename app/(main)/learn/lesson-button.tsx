"use client";

import { useEffect, useRef } from "react";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { BrandIcon } from "@/components/brand-icon";
import { cn } from "@/lib/utils";

type LessonButtonProps = {
	id: number;
	title: string;
	index: number;
	totalCount: number;
	locked?: boolean;
	current?: boolean;
	percentage: number;
	moment?: "done" | "opened";
};

export const LessonButton = (
	{ id, title, index, totalCount, locked, current, percentage, moment }:
		LessonButtonProps,
) => {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (moment !== "opened" && moment !== "done") return;
		if (moment === "opened") {
			ref.current?.scrollIntoView({
				block: "center",
				behavior:
					window.matchMedia("(prefers-reduced-motion: reduce)")
							.matches
						? "auto"
						: "smooth",
			});
		}
		if (moment === "done") window.history.replaceState(null, "", "/learn");
	}, [moment]);

	const completed = !current && !locked;
	const offset = [0, 24, 48, 24][index % 4];
	const icon = locked
		? "lock"
		: completed
		? "check"
		: index === totalCount
		? "trophy"
		: "star";
	const content = (
		<>
			<span
				className={cn(
					"lesson-node",
					current && "lesson-node-current",
					completed && "lesson-node-done",
					locked && "lesson-node-locked",
				)}
			>
				<BrandIcon name={icon} className="h-11 w-11" />
			</span>
			<span className="min-w-0 flex-1">
				<span className="mb-1 block text-xs font-bold text-muted-foreground">
					{completed
						? "완료 · 다시 연습하기"
						: current
						? percentage > 0
							? "이어서 학습하기"
							: "지금 시작할 레슨"
						: `레슨 ${index + 1}`}
				</span>
				<span
					className={cn(
						"block text-base font-extrabold leading-snug",
						locked ? "text-muted-foreground" : "text-foreground",
					)}
				>
					{title}
				</span>
				{current && percentage > 0 && (
					<span className="mt-2 block h-1.5 max-w-32 overflow-hidden rounded-full bg-white">
						<span
							className="block h-full origin-left rounded-full bg-[var(--game-green)]"
							style={{
								transform: `scaleX(${
									Math.min(100, percentage) / 100
								})`,
							}}
						/>
					</span>
				)}
			</span>
			{current && (
				<ArrowRight
					className="h-5 w-5 shrink-0 text-[var(--game-green-depth)]"
					aria-hidden
				/>
			)}
		</>
	);

	return (
		<div
			ref={ref}
			className={cn(
				"relative w-full",
				moment === "done" &&
					"animate-[node-done_.5s_ease-out] motion-reduce:animate-none",
				moment === "opened" &&
					"animate-[node-unlock_.5s_ease-out] motion-reduce:animate-none",
			)}
			style={{ paddingLeft: offset }}
		>
			{locked
				? (
					<div
						aria-label={`${title}, 이전 레슨을 완료하면 열립니다`}
						className="flex items-center gap-4 rounded-2xl px-3 py-4"
					>
						{content}
					</div>
				)
				: (
					<Link
						href={completed ? `/lesson/${id}` : "/lesson"}
						aria-current={current ? "step" : undefined}
						className={cn(
							"group flex items-center gap-4 rounded-2xl px-3 py-4 transition-colors hover:bg-muted",
							current &&
								"bg-[var(--game-green-soft)] hover:bg-[var(--game-green-soft)]",
						)}
					>
						{content}
					</Link>
				)}
		</div>
	);
};
