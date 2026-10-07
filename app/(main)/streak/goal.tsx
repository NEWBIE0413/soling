"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { setDailyGoalAction } from "@/actions/streak";
import { DAILY_GOAL_OPTIONS } from "@/constants";
import { BrandIcon } from "@/components/brand-icon";
import { cn } from "@/lib/utils";

/*
 오늘 목표: how many study sessions today against a goal the learner picks. Attendance still needs one;
 the goal is the "and a bit more" a study plan asks for (e.g. two lessons a day before an exam).
*/
export const DailyGoal = (
	{ done, goal: initial }: { done: number; goal: number },
) => {
	const [goal, setGoal] = useState(initial);
	const [pending, start] = useTransition();
	const met = done >= goal;
	const pick = (g: number) => {
		if (g === goal) return;
		const prev = goal;
		setGoal(g);
		start(async () => {
			const r = await setDailyGoalAction(g);
			if ("error" in r) {
				setGoal(prev);
				toast.error(r.error);
			}
		});
	};
	return (
		<div className="game-panel mb-6 w-full p-5 sm:p-6">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<h2 className="flex items-center gap-2 text-xl font-extrabold">
					<BrandIcon name="practice" className="h-7 w-7" />오늘 목표
				</h2>
				<span
					className={cn(
						"text-sm font-black tabular-nums",
						met ? "text-green-700" : "text-sky-700",
					)}
				>
					{met ? "달성! " : ""}
					{done} / {goal}번
				</span>
			</div>
			<div
				className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100"
				role="progressbar"
				aria-label="오늘 학습 목표"
				aria-valuemin={0}
				aria-valuemax={goal}
				aria-valuenow={Math.min(done, goal)}
			>
				<div
					className={cn(
						"h-full rounded-full ",
						met ? "bg-green-500" : "bg-sky-400",
					)}
					style={{
						width: `${
							Math.min(100, Math.round((100 * done) / goal))
						}%`,
					}}
				/>
			</div>
			<div className="mt-4 flex flex-wrap items-center gap-2">
				<span className="text-sm font-semibold text-muted-foreground">
					하루
				</span>
				{DAILY_GOAL_OPTIONS.map((g) => (
					<button
						key={g}
						type="button"
						disabled={pending}
						onClick={() => pick(g)}
						aria-pressed={g === goal}
						className={cn(
							"min-h-11 min-w-11 flex-1 rounded-xl border-2 border-border px-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:translate-y-0.5 motion-reduce:transform-none",
							g === goal
								? "border-border bg-[var(--game-blue-soft)] text-sky-800"
								: "border-slate-200 bg-white text-neutral-500",
						)}
					>
						{g}번
					</button>
				))}
			</div>
		</div>
	);
};
