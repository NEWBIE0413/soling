import { auth } from "@/lib/session";
import { BrandIcon } from "@/components/brand-icon";
import { Mascot } from "@/components/mascot";
import { PageHeader } from "@/components/page-header";
import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { UserProgress } from "@/components/user-progress";
import { cn } from "@/lib/utils";
import {
	getTopTenUsers,
	getUserProgress,
	getUserSubscription,
} from "@/db/queries";
import { shopItem } from "@/lib/economy";
import { getWeeklyTop } from "@/lib/leaderboard";
import Link from "next/link";

const equippedRing = (frame?: string) => {
	const color = frame?.split("_")[1] ?? "";
	const map: Record<string, string> = {
		sky: "ring-2 ring-sky-400",
		rose: "ring-2 ring-rose-400",
		gold: "ring-2 ring-amber-400",
	};
	return map[color] ?? "";
};

const md = (day: string) =>
	`${Number(day.slice(5, 7))}/${Number(day.slice(8, 10))}`;

const LeaderboardPage = async ({
	searchParams,
}: {
	searchParams: Promise<{ range?: string }>;
}) => {
	const session = await auth.protect();
	const { range } = await searchParams;
	const weekly = range !== "all";

	const [userProgress, userSubscription, allTime, week] = await Promise.all([
		getUserProgress(),
		getUserSubscription(),
		getTopTenUsers(),
		getWeeklyTop(),
	]);

	if (!userProgress || !userProgress.activeCourse) redirect("/courses");

	const isPro = !!userSubscription?.isActive;
	const leaderboard = weekly
		? week.rows
		: allTime.map((u) => ({ ...u, weekXp: 0 }));

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
							title="리더보드"
							description={weekly
								? `이번 주 (${md(week.start)} ~ ${
									md(week.end)
								}) · 매주 월요일 초기화`
								: "지금까지 모은 누적 XP 순위예요."}
							icon="trophy"
						/>
					</div>
					<section className="game-panel mb-6 flex w-full flex-wrap items-center gap-4 p-5 sm:p-6">
						<Mascot
							pose="celebrate"
							className="h-24 w-24 shrink-0"
						/>
						<div className="min-w-0">
							<h2 className="text-xl font-extrabold">
								함께 배우면 더 멀리
							</h2>
							<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
								오늘의 학습으로 XP를 쌓고, 내 다음 기록에
								도전해요.
							</p>
							<p className="mt-3 flex items-center gap-2 text-base font-black tabular-nums">
								<BrandIcon name="xp" className="h-6 w-6" />내
								누적 {userProgress.points} XP
							</p>
						</div>
					</section>

					<div className="mb-6 flex w-full rounded-2xl border border-border bg-muted p-1">
						<Link
							href="/leaderboard"
							aria-current={weekly ? "page" : undefined}
							prefetch
							className={cn(
								"flex min-h-11 flex-1 items-center justify-center rounded-xl px-4 py-2 text-sm font-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
								weekly
									? "border border-slate-200 bg-white text-neutral-800 shadow-sm"
									: "text-neutral-500 hover:text-neutral-700",
							)}
						>
							이번 주
						</Link>
						<Link
							href="/leaderboard?range=all"
							aria-current={!weekly ? "page" : undefined}
							prefetch
							className={cn(
								"flex min-h-11 flex-1 items-center justify-center rounded-xl px-4 py-2 text-sm font-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
								!weekly
									? "border border-slate-200 bg-white text-neutral-800 shadow-sm"
									: "text-neutral-500 hover:text-neutral-700",
							)}
						>
							전체
						</Link>
					</div>

					<div className="w-full space-y-3 pb-8">
						{leaderboard.length === 0 && (
							<div className="game-empty p-6">
								<BrandIcon
									name="trophy"
									className="mx-auto mb-3 h-12 w-12"
								/>
								<h2 className="text-xl font-extrabold">
									새로운 순위가 기다려요
								</h2>
								<p className="mt-2 text-sm text-muted-foreground">
									레슨을 완료하고 이번 주 첫 XP를 모아보세요.
								</p>
								<Link
									href="/learn"
									className="mt-3 inline-flex min-h-11 items-center font-bold text-sky-700 underline"
								>
									학습하러 가기
								</Link>
							</div>
						)}
						{leaderboard.map((userProgress, i) => {
							const isMe =
								userProgress.userId === session.user.id;
							const xp = weekly
								? userProgress.weekXp
								: userProgress.points;
							return (
								<div
									key={userProgress.userId}
									className={cn(
										"game-panel flex w-full flex-wrap items-center gap-3 p-4 sm:p-5",
										isMe
											? "bg-[var(--game-green-soft)]"
											: "border-slate-200 bg-white hover:bg-slate-50/80",
									)}
								>
									<p className="w-7 flex-none text-center text-sm font-black text-neutral-600 sm:text-base">
										<span className="sr-only">순위</span>
										{i + 1}
									</p>

									<Avatar
										className={cn(
											"h-10 w-10 flex-none rounded-full border border-slate-200 bg-slate-100 shadow-inner",
											equippedRing(
												(userProgress.equipped as {
													frame?: string;
												} | null)
													?.frame,
											),
										)}
									>
										<AvatarImage
											src={userProgress.userImageSrc}
											className="object-cover"
										/>
									</Avatar>

									<div className="flex min-w-0 flex-1 flex-col items-start gap-1">
										<p className="truncate text-sm font-bold text-neutral-800 sm:text-base">
											{userProgress.userName}
											{isMe && (
												<span className="ml-2 text-sm font-bold text-green-700">
													나
												</span>
											)}
										</p>
										{userProgress.equipped?.title && (
											<span className="max-w-full break-words rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-sm font-black text-amber-700">
												{shopItem(
													userProgress.equipped.title,
												)?.name}
											</span>
										)}
									</div>
									<span className="flex-none rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-sm font-black tabular-nums text-emerald-700">
										<BrandIcon
											name="xp"
											className="mr-1 inline-block h-5 w-5 align-middle"
										/>
										{xp} XP
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</FeedWrapper>
		</div>
	);
};

export default LeaderboardPage;
