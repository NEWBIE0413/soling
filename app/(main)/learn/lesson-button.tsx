"use client";

import { useEffect, useRef } from "react";

import { Check, Crown, Star } from "lucide-react";
import Link from "next/link";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

import { cn } from "@/lib/utils";

import "react-circular-progressbar/dist/styles.css";

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
				behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
						.matches
					? "auto"
					: "smooth",
			});
		}
		if (moment === "done") window.history.replaceState(null, "", "/learn");
	}, [moment]);

	const completed = !current && !locked;
	const offset = [0, -36, -72, -36, 0, 36, 72, 36][index % 8];
	const Icon = completed ? Check : index === totalCount ? Crown : Star;
	const progress = Math.min(100, Math.max(0, percentage || 0));
	const label = `${title}, ${
		locked
			? "이전 레슨을 완료하면 열립니다"
			: completed
			? "완료, 다시 연습하기"
			: progress > 0
			? `이어서 학습하기, ${Math.round(progress)}% 완료`
			: "시작"
	}`;
	const node = (
		<span
			className={cn(
				"lesson-node",
				current && "lesson-node-current",
				completed && "lesson-node-done",
				locked && "lesson-node-locked",
			)}
		>
			<Icon
				aria-hidden
				className={cn(
					"h-8 w-8",
					completed ? "stroke-[3.5]" : "fill-current",
				)}
			/>
		</span>
	);
	const content = current
		? (
			<div className="relative h-24 w-24">
				<span className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-extrabold text-[var(--game-green-depth)] shadow-sm">
					{progress > 0 ? "계속하기" : "시작"}
					<span
						className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-border bg-white"
						aria-hidden
					/>
				</span>
				<CircularProgressbarWithChildren
					value={progress}
					styles={{
						path: {
							stroke: "var(--game-green)",
							strokeWidth: 6,
							strokeLinecap: "round",
						},
						trail: { stroke: "#e2e8df", strokeWidth: 6 },
					}}
				>
					{node}
				</CircularProgressbarWithChildren>
			</div>
		)
		: node;

	return (
		<div
			ref={ref}
			className={cn(
				"relative flex w-24 justify-center",
				current && "mt-8",
				moment === "done" &&
					"animate-[node-done_.5s_ease-out] motion-reduce:animate-none",
				moment === "opened" &&
					"animate-[node-unlock_.5s_ease-out] motion-reduce:animate-none",
			)}
			style={{ left: offset }}
		>
			{locked
				? (
					<div
						aria-label={label}
						title={label}
						role="img"
					>
						{content}
					</div>
				)
				: (
					<Link
						href={completed ? `/lesson/${id}` : "/lesson"}
						aria-label={label}
						title={label}
						aria-current={current ? "step" : undefined}
						className="block rounded-full outline-offset-4"
					>
						{content}
					</Link>
				)}
		</div>
	);
};
