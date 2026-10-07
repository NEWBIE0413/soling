import { BrandIcon } from "@/components/brand-icon";
import { Mascot } from "@/components/mascot";
import { PageHeader } from "@/components/page-header";
import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { auth } from "@/lib/session";
import { getCoupleStatus, getStreak, todayGoal } from "@/lib/streak";

import { CoupleCard } from "./couple-card";
import { DailyGoal } from "./goal";
import { WeekCalendar } from "./week";

const StreakPage = async () => {
	const { userId } = await auth.protect().then((s) => ({
		userId: s.user.id,
	}));
	const [userProgress, userSubscription, mine, couple, today] = await Promise
		.all([
			getUserProgress(),
			getUserSubscription(),
			getStreak(userId),
			getCoupleStatus(userId),
			todayGoal(userId),
		]);
	if (!userProgress || !userProgress.activeCourse) redirect("/courses");
	const isPro = !!userSubscription?.isActive;

	return (
		<div className="flex flex-row-reverse gap-8">
			<StickyWrapper>
				<UserProgress
					activeCourse={userProgress.activeCourse}
					hearts={userProgress.hearts}
					points={userProgress.points}
					gems={userProgress.gems}
					hasActiveSubscription={isPro}
				/>
				{!isPro && <Promo />}
			</StickyWrapper>

			<FeedWrapper>
				<div className="flex w-full flex-col items-center">
					<div className="w-full">
						<PageHeader
							title="출석"
							description="하루 한 번의 학습이 오래가는 습관이 돼요."
							icon="streak"
						/>
					</div>
					<section className="game-panel mb-6 flex w-full flex-wrap items-center gap-4 p-5 sm:p-6">
						<Mascot
							pose={mine.todayDone ? "celebrate" : "wave"}
							className="h-24 w-24 shrink-0"
						/>
						<div className="min-w-0 flex-1 basis-48">
							<h2 className="text-xl font-extrabold">
								{mine.todayDone
									? "오늘도 한 걸음 완료!"
									: "오늘의 한 걸음을 시작해요"}
							</h2>
							<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
								레슨 하나만 끝내면 출석이에요. 히라가나 세션도
								인정돼요.
							</p>
						</div>
					</section>

					<WeekCalendar userId={userId} />
					<DailyGoal done={today.done} goal={today.goal} />

					<div className="mb-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
						<div
							className={`game-panel p-5 text-center sm:p-6 ${
								mine.todayDone
									? "bg-orange-50"
									: "border-slate-200 bg-white"
							}`}
						>
							<BrandIcon
								name="streak"
								className="mx-auto h-12 w-12"
							/>
							<div className="mt-1 text-3xl font-black text-orange-700 sm:text-4xl">
								{mine.current}
								<span className="ml-1 text-sm font-bold text-neutral-500">
									일
								</span>
							</div>
							<div className="mt-0.5 text-sm font-bold text-neutral-700 sm:text-sm">
								내 연속 출석
							</div>
							<div className="mt-1 text-sm text-muted-foreground">
								{mine.todayDone
									? "오늘 출석 완료"
									: "오늘 아직이에요"} · 최고 {mine.longest}일
							</div>
						</div>
						<div
							className={`game-panel p-5 text-center sm:p-6 ${
								couple?.partner
									? couple.streak.todayDone
										? "bg-rose-50"
										: "border-slate-200 bg-white"
									: "border-dashed border-slate-300 bg-slate-50/40"
							}`}
						>
							<BrandIcon
								name="heart"
								className="mx-auto h-12 w-12"
							/>
							<div className="mt-1 text-3xl font-black text-rose-500 sm:text-4xl">
								{couple?.partner ? couple.streak.current : "–"}
								<span className="ml-1 text-sm font-bold text-neutral-500">
									일
								</span>
							</div>
							<div className="mt-0.5 text-sm font-bold text-neutral-700 sm:text-sm">
								커플 연속 출석
							</div>
							<div className="mt-2 leading-relaxed text-sm text-muted-foreground">
								{couple?.partner
									? `${
										couple.streak.todayDone
											? "오늘 둘 다 출석"
											: couple.partnerTodayDone
											? "상대는 완료, 내 차례"
											: mine.todayDone
											? "상대 기다리는 중"
											: "둘 다 아직"
									} · 최고 ${couple.streak.longest}일`
									: "아직 연결 안 됨"}
							</div>
						</div>
					</div>

					<CoupleCard couple={couple} />
				</div>
			</FeedWrapper>
		</div>
	);
};

export default StreakPage;
