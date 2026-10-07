import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { BrandIcon } from "@/components/brand-icon";
import { FeedWrapper } from "@/components/feed-wrapper";
import { CompanionScene } from "@/components/companion-scene";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Button } from "@/components/ui/button";
import { UserProgress } from "@/components/user-progress";
import { KANA_TRAINER_TITLE } from "@/constants";
import {
	getCourseProgress,
	getLessonPercentage,
	getUnits,
	getUserProgress,
	getUserSubscription,
} from "@/db/queries";
import { auth } from "@/lib/session";
import { todayGoal } from "@/lib/streak";
import { COMPANIONS, isCompanion } from "@/public/companions";

import { KanaHome } from "./kana-home";
import { LearnExtras } from "./learn-extras";
import { Unit } from "./unit";

export default async function LearnPage(
	{ searchParams }: { searchParams: Promise<{ done?: string }> },
) {
	const session = await auth.protect();
	const { done } = await searchParams;
	const [progress, units, courseProgress, percentage, subscription, goal] =
		await Promise.all([
			getUserProgress(),
			getUnits(),
			getCourseProgress(),
			getLessonPercentage(),
			getUserSubscription(),
			todayGoal(session.user.id),
		]);
	if (!progress?.activeCourse) redirect("/courses");
	if (progress.activeCourse.title === KANA_TRAINER_TITLE) return <KanaHome />;
	const path = units.flatMap((unit) => unit.lessons);
	const at = path.findIndex((lesson) => lesson.id === Number(done));
	const justDone = at >= 0 ? path[at].id : undefined;
	const opened =
		at >= 0 && path[at + 1]?.id === courseProgress?.activeLesson?.id
			? path[at + 1].id
			: undefined;
	const active = courseProgress?.activeLesson;
	const completed = path.filter((lesson) => lesson.completed).length;
	const currentUnit = units.find((unit) => unit.id === active?.unitId);
	const courseFinished = path.length > 0 && completed === path.length;
	const choice = progress.equipped?.companion;
	const friend = COMPANIONS[isCompanion(choice) ? choice : "quokka"];

	return (
		<div className="flex items-start gap-8">
			<FeedWrapper>
				<header className="mb-6 flex items-center justify-between gap-3">
					<div>
						<p className="text-sm font-bold text-muted-foreground">
							나의 학습 길
						</p>
						<h1 className="game-page-title mt-1">
							{progress.activeCourse.title}
						</h1>
					</div>
					<Button asChild variant="ghost" size="icon">
						<Link href="/courses" aria-label="코스 바꾸기">
							<BrandIcon name="course" />
						</Link>
					</Button>
				</header>
				<section className="learning-hero mb-8">
					<div className="relative z-10 min-w-0 flex-1">
						<p className="mb-2 text-xs font-extrabold text-[var(--companion-ink)]">
							{courseFinished
								? "코스 완료"
								: currentUnit
								? `유닛 ${currentUnit.order} · ${completed}개 레슨 완료`
								: "새로운 배움의 시작"}
						</p>
						<h2 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">
							{courseFinished
								? "여기까지, 정말 잘했어요!"
								: percentage > 0
								? "배우던 곳에서 계속해요"
								: (
									<>
										{friend.name}와{" "}
										<span className="whitespace-nowrap">
											한 걸음 더
										</span>
									</>
								)}
						</h2>
						<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
							{courseFinished ? friend.complete : friend.welcome}
						</p>
						{active && (
							<p className="mt-2 text-xs font-bold text-[var(--companion-ink)]">
								{active.title}
							</p>
						)}
						<Button
							asChild
							variant="secondary"
							className="mt-5 min-w-36"
						>
							<Link
								href={active
									? "/lesson"
									: courseFinished
									? "/practice"
									: "/courses"}
							>
								{active
									? "학습 시작"
									: courseFinished
									? "복습하기"
									: "코스 살펴보기"}
								<ArrowRight className="h-4 w-4" aria-hidden />
							</Link>
						</Button>
					</div>
					<CompanionScene />
				</section>
				<LearnExtras />
				<div className="mt-8 space-y-5">
					{units.map((unit) => (
						<Unit
							key={unit.id}
							{...unit}
							activeLesson={active}
							activeLessonPercentage={percentage}
							justDone={justDone}
							opened={opened}
						/>
					))}
				</div>
			</FeedWrapper>
			<StickyWrapper>
				<UserProgress
					activeCourse={progress.activeCourse}
					hearts={progress.hearts}
					points={progress.points}
					gems={progress.gems}
					hasActiveSubscription={!!subscription?.isActive}
				/>
				<section className="game-panel">
					<div className="mb-4 flex items-center gap-3">
						<BrandIcon name="quests" />
						<h2 className="text-base font-extrabold">
							오늘의 작은 목표
						</h2>
					</div>
					<p className="text-sm leading-relaxed text-muted-foreground">
						{goal.done >= goal.goal
							? "오늘 목표를 채웠어요. 좋은 흐름이에요!"
							: `레슨 ${goal.goal}개를 마치고 배움의 습관을 쌓아요.`}
					</p>
					<div
						className="my-4 h-3 overflow-hidden rounded-full bg-muted"
						role="progressbar"
						aria-label="오늘 학습 목표"
						aria-valuemin={0}
						aria-valuemax={goal.goal}
						aria-valuenow={Math.min(goal.done, goal.goal)}
					>
						<div
							className="h-full origin-left rounded-full bg-[var(--game-green)]"
							style={{
								transform: `scaleX(${
									Math.min(1, goal.done / goal.goal)
								})`,
							}}
						/>
					</div>
					<div className="flex items-center justify-between text-sm font-bold">
						<span>
							{Math.min(goal.done, goal.goal)} / {goal.goal} 레슨
						</span>
						<Link
							href="/quests"
							className="py-2 text-[var(--companion-ink)]"
						>
							퀘스트 보기
						</Link>
					</div>
				</section>
				<section className="rounded-[20px] bg-muted p-5">
					<BrandIcon name="trophy" className="mb-3 h-12 w-12" />
					<h2 className="text-base font-extrabold">
						조금씩 쌓이는 실력
					</h2>
					<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
						전체 {path.length}개 레슨 중{" "}
						{completed}개를 마쳤어요. 속도보다 꾸준함이 중요해요.
					</p>
					<Link
						href="/profile"
						className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-bold"
					>
						나의 성장 보기<ArrowRight size={16} aria-hidden />
					</Link>
				</section>
			</StickyWrapper>
		</div>
	);
}
