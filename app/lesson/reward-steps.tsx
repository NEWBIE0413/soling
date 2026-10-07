"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";

import { Check, Clock3, Snowflake } from "lucide-react";

import { claimQuestAction } from "@/actions/economy";
import { BrandIcon } from "@/components/brand-icon";
import { chime } from "@/components/celebrate";
import { Mascot } from "@/components/mascot";
import { Button } from "@/components/ui/button";
import type { QuestView } from "@/lib/economy-defs";
import { cn } from "@/lib/utils";
import type { Bonus } from "@/lib/xp";

import { Footer } from "./footer";

export type LessonDone = {
	streak: number;
	firstToday: boolean;
	week: {
		day: string;
		isToday: boolean;
		frozen: boolean;
		attended: boolean;
	}[];
	quests: QuestView[];
	achievements: { key: string; name: string; desc: string; emoji: string }[];
	goal: { done: number; goal: number };
	bonus: Bonus;
};

export type LessonStats = {
	practice: boolean;
	xp: number;
	accuracy: number;
	timeLabel: string;
	bestCombo: number;
	missed: number;
	recovered: number;
};

type Step = "summary" | "streak" | "quests" | "badges";
const WEEK_LABELS = ["월", "화", "수", "목", "금", "토", "일"];
const STEP_LABELS = {
	summary: "학습 결과",
	streak: "연속 출석",
	quests: "오늘의 목표",
	badges: "새 업적",
};

function useCounter(target: number) {
	const [shown, setShown] = useState(0);
	const current = useRef(0);
	useEffect(() => {
		const from = current.current;
		const start = performance.now();
		const reduced =
			window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let frame = 0;
		const tick = (now: number) => {
			const fraction = reduced ? 1 : Math.min(1, (now - start) / 550);
			current.current = Math.round(
				from + (target - from) * (1 - (1 - fraction) ** 3),
			);
			setShown(current.current);
			if (fraction < 1) frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [target]);
	return shown;
}

export const RewardSteps = (
	{ lessonId, stats, done, failed, questsBefore, onFinish }: {
		lessonId: number;
		stats: LessonStats;
		done: LessonDone | null;
		failed: boolean;
		questsBefore: Record<string, number>;
		onFinish: () => void;
	},
) => {
	const [index, setIndex] = useState(0);
	const [gaveUp, setGaveUp] = useState(false);
	useEffect(() => {
		const timer = setTimeout(() => setGaveUp(true), 6000);
		return () => clearTimeout(timer);
	}, []);
	const quests = useMemo(
		() =>
			done?.quests.filter((q) =>
				!q.claimed &&
				(q.done ||
					q.have > (questsBefore[q.key] ?? 0) &&
						(questsBefore[q.key] ?? 0) < q.goal)
			) ?? [],
		[done, questsBefore],
	);
	const steps = useMemo(() => {
		const result: Step[] = ["summary"];
		if (!done) return result;
		if (done.firstToday && done.streak > 0) result.push("streak");
		if (quests.length || done.goal.goal > 1) result.push("quests");
		if (done.achievements.length) result.push("badges");
		return result;
	}, [done, quests]);
	const step = steps[index];
	useEffect(() => {
		if (index > 0) chime(step === "quests" ? "combo" : "lesson");
	}, [index, step]);
	const ready = done !== null || failed || gaveUp;
	const next = () => {
		if (!ready) return;
		if (index < steps.length - 1) setIndex(index + 1);
		else onFinish();
	};
	return (
		<>
			<div className="lesson-scroll">
				<div
					key={step}
					className="mx-auto flex min-h-full w-full max-w-[600px] animate-[fade_180ms_ease-out] flex-col items-center justify-center gap-5 px-5 py-8 text-center sm:px-8"
				>
					{step === "summary" && (
						<Summary stats={stats} bonus={done?.bonus} />
					)}
					{step === "streak" && done && (
						<StreakStep streak={done.streak} week={done.week} />
					)}
					{step === "quests" && done && (
						<QuestStep quests={quests} goal={done.goal} />
					)}
					{step === "badges" && done && (
						<>
							<div className="reward-scene reward-scene-perfect">
								<Mascot pose="celebrate" />
								<BrandIcon
									name="trophy"
									className="reward-spark"
								/>
							</div>
							<h1 className="game-page-title">
								새로운 배지를 얻었어요!
							</h1>
							<div className="w-full space-y-3 text-left">
								{done.achievements.map((achievement) => (
									<div
										key={achievement.key}
										className="game-panel flex items-center gap-4"
									>
										<BrandIcon
											name="trophy"
											className="h-12 w-12 shrink-0"
										/>
										<div>
											<h2 className="text-base font-extrabold">
												{achievement.name}
											</h2>
											<p className="mt-1 text-sm text-muted-foreground">
												{achievement.desc}
											</p>
										</div>
									</div>
								))}
							</div>
						</>
					)}
					{(failed || gaveUp && !done) && (
						<p
							role="alert"
							className="rounded-xl bg-[#fff0f1] px-4 py-3 text-sm text-[#a1263d]"
						>
							학습은 끝났지만 저장을 확인하지 못했어요. 학습
							길에서 진도를 확인해 주세요.
						</p>
					)}
					{!ready && (
						<p
							role="status"
							className="text-sm text-muted-foreground"
						>
							학습 기록을 저장하고 있어요…
						</p>
					)}
					{steps.length > 1 && (
						<ol aria-label="보상 단계" className="mt-2 flex gap-2">
							{steps.map((name, i) => (
								<li
									key={name}
									aria-current={i === index
										? "step"
										: undefined}
									aria-label={STEP_LABELS[name]}
									className={cn(
										"h-2 rounded-full transition-[width,background-color] motion-reduce:transition-none",
										i === index
											? "w-6 bg-[var(--game-green-depth)]"
											: "w-2 bg-border",
									)}
								/>
							))}
						</ol>
					)}
				</div>
			</div>
			<Footer
				lessonId={step === "summary" && !stats.practice
					? lessonId
					: undefined}
				status="completed"
				disabled={!ready}
				onCheck={next}
				continueLabel={ready && index === steps.length - 1
					? "학습 길로"
					: "계속"}
			/>
		</>
	);
};

function Summary({ stats, bonus }: { stats: LessonStats; bonus?: Bonus }) {
	const xp = useCounter(stats.xp + (bonus?.total ?? 0));
	const accuracy = useCounter(stats.accuracy);
	const perfect = stats.accuracy === 100;
	const bonusParts = bonus
		? [
			bonus.perfect && `완벽 +${bonus.perfect}`,
			bonus.combo && `콤보 +${bonus.combo}`,
			bonus.goal && `오늘 목표 +${bonus.goal}`,
		].filter(Boolean)
		: [];
	return (
		<>
			<div
				className={cn(
					"reward-scene",
					perfect && "reward-scene-perfect",
				)}
			>
				<Mascot
					pose="celebrate"
					label="두 팔을 들고 축하하는 Solingo"
				/>
				<BrandIcon name="star" className="reward-spark" />
				<BrandIcon
					name={perfect ? "trophy" : "star"}
					className="reward-spark"
				/>
				<BrandIcon name="star" className="reward-spark" />
			</div>
			<div>
				<p className="mb-2 text-sm font-extrabold text-[#3c741d]">
					{stats.practice ? "복습 완료" : "레슨 완료"}
				</p>
				<h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">
					{perfect
						? "완벽한 한 걸음!"
						: stats.accuracy >= 80
						? "오늘도 실력이 쑥!"
						: "끝까지 해낸 당신, 멋져요!"}
				</h1>
				<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
					{stats.missed > 0
						? `처음에 틀린 ${stats.missed}개 중 ${stats.recovered}개를 다시 맞혔어요.`
						: "차곡차곡, 새로운 언어가 내 것이 되고 있어요."}
				</p>
			</div>
			<div className="mt-2 grid w-full grid-cols-3 gap-3">
				<EndStat label="획득 XP" value={`${xp}`} icon="xp" />
				<EndStat label="정확도" value={`${accuracy}%`} icon="check" />
				<EndStat
					label="학습 시간"
					value={stats.timeLabel}
					icon="time"
				/>
			</div>
			<div className="min-h-6 text-sm font-bold text-[#8b6412]">
				{bonusParts.length > 0 && `보너스 ${bonusParts.join(" · ")}`}
			</div>
			{stats.bestCombo >= 3 && (
				<p className="flex items-center gap-2 text-sm font-bold text-[#a95016]">
					<BrandIcon name="streak" className="h-6 w-6" />최고{" "}
					{stats.bestCombo}연속 정답
				</p>
			)}
		</>
	);
}

function EndStat(
	{ label, value, icon }: {
		label: string;
		value: string;
		icon: "xp" | "check" | "time";
	},
) {
	return (
		<div className="flex min-w-0 flex-col items-center gap-2 rounded-2xl bg-muted px-2 py-4">
			{icon === "time"
				? (
					<Clock3
						className="h-8 w-8 text-[#087bb8]"
						strokeWidth={2.5}
					/>
				)
				: <BrandIcon name={icon} />}
			<span className="text-xs font-bold text-muted-foreground sm:text-sm">
				{label}
			</span>
			<span className="text-base font-black tabular-nums sm:text-xl">
				{value}
			</span>
		</div>
	);
}

function StreakStep(
	{ streak, week }: { streak: number; week: LessonDone["week"] },
) {
	return (
		<>
			<BrandIcon
				name="streak"
				className="h-32 w-32 animate-[ignite_600ms_ease-out] motion-reduce:animate-none"
			/>
			<div>
				<p className="text-6xl font-black tabular-nums text-[#a95016]">
					{streak}
					<span className="ml-2 text-2xl">일</span>
				</p>
				<h1 className="mt-3 game-page-title">
					좋은 습관이 되고 있어요
				</h1>
				<p className="mt-3 text-sm text-muted-foreground">
					오늘도 이어온 배움. 내일의 나도 기다리고 있어요.
				</p>
			</div>
			<div className="game-panel mt-4 grid w-full grid-cols-7 gap-2">
				{week.map((day, i) => (
					<div
						key={day.day}
						className="flex flex-col items-center gap-3"
					>
						<span className="text-xs font-bold text-muted-foreground">
							{WEEK_LABELS[i]}
						</span>
						<span
							aria-label={`${WEEK_LABELS[i]}요일 ${
								day.attended
									? "출석"
									: day.frozen
									? "보호됨"
									: "미출석"
							}`}
							className={cn(
								"flex h-8 w-8 items-center justify-center rounded-full bg-muted",
								day.attended &&
									"bg-[var(--game-green-soft)] text-[#3c741d]",
								day.isToday &&
									"ring-2 ring-[var(--game-green-depth)] ring-offset-2",
							)}
						>
							{day.attended
								? <Check size={20} strokeWidth={3} />
								: day.frozen
								? (
									<Snowflake
										size={18}
										className="text-sky-700"
									/>
								)
								: (
									<span className="h-1.5 w-1.5 rounded-full bg-border" />
								)}
						</span>
					</div>
				))}
			</div>
		</>
	);
}

function QuestStep(
	{ quests, goal }: { quests: QuestView[]; goal: LessonDone["goal"] },
) {
	const [pending, startTransition] = useTransition();
	const [paid, setPaid] = useState<Record<string, number>>({});
	const [error, setError] = useState<string | null>(null);
	const claim = (key: string) =>
		startTransition(async () => {
			setError(null);
			try {
				const result = await claimQuestAction(key);
				if (result.ok) {
					setPaid((previous) => ({
						...previous,
						[key]: "reward" in result ? result.reward ?? 0 : 0,
					}));
					chime("purchase");
				} else {setError(
						result.error === "already-claimed"
							? "이미 받은 보상이에요."
							: "보상을 받지 못했어요. 다시 시도해 주세요.",
					);}
			} catch {
				setError(
					"연결이 끊겼어요. 연결을 확인하고 다시 시도해 주세요.",
				);
			}
		});
	return (
		<>
			<BrandIcon name="quests" className="h-24 w-24" />
			<h1 className="game-page-title">목표에 한 걸음 가까이!</h1>
			<p className="text-sm text-muted-foreground">
				오늘의 노력이 보상으로 돌아왔어요.
			</p>
			<ul className="mt-2 w-full space-y-3 text-left">
				{goal.goal > 1 && (
					<li className="game-panel">
						<p className="flex justify-between text-sm font-extrabold">
							<span>오늘 학습 목표</span>
							<span>
								{Math.min(goal.done, goal.goal)}/{goal.goal}
							</span>
						</p>
						<Bar value={goal.done / goal.goal} />
					</li>
				)}
				{quests.map((quest) => (
					<li
						key={quest.key}
						className="game-panel flex flex-wrap items-center gap-3"
					>
						<BrandIcon
							name="quests"
							className="h-10 w-10 shrink-0"
						/>
						<div className="min-w-0 flex-1">
							<p className="text-sm font-extrabold">
								{quest.name}
							</p>
							<p className="mt-1 text-xs text-muted-foreground">
								{Math.min(quest.have, quest.goal)} /{" "}
								{quest.goal}
							</p>
							<Bar value={quest.have / quest.goal} />
						</div>
						{paid[quest.key] !== undefined
							? (
								<span className="flex items-center gap-1 text-sm font-extrabold text-sky-700">
									<BrandIcon
										name="gem"
										className="h-6 w-6"
									/>+{paid[quest.key]}
								</span>
							)
							: quest.done && (
								<Button
									size="sm"
									variant="secondary"
									disabled={pending}
									onClick={() => claim(quest.key)}
								>
									<BrandIcon name="gem" className="h-5 w-5" />
									{quest.gems} 받기
								</Button>
							)}
					</li>
				))}
			</ul>
			{error && (
				<p role="alert" className="text-sm text-[#a1263d]">{error}</p>
			)}
		</>
	);
}

function Bar({ value }: { value: number }) {
	return (
		<div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
			<div
				className="h-full origin-left rounded-full bg-[var(--game-green)]"
				style={{
					transform: `scaleX(${Math.min(1, Math.max(0, value))})`,
				}}
			/>
		</div>
	);
}
