import { PageHeader } from "@/components/page-header";
import { BrandIcon } from "@/components/brand-icon";
import { Mascot } from "@/components/mascot";
import Link from "next/link";
import { redirect } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { ChevronRight } from "lucide-react";

import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import db from "@/db/drizzle";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { writingSubmissions } from "@/db/schema";
import { auth } from "@/lib/session";
import { cn } from "@/lib/utils";
import { listTasks } from "@/lib/writing";
import { isUnread } from "@/lib/writing-shared";

// 쓰기 과제 목록: 활성 코스의 과제를 작성자가 정한 순서대로, 과제마다 가장 최근 답안의 상태와 함께.
const WritingPage = async () => {
	const userId = (await auth.protect()).user.id;
	const [userProgress, userSubscription] = await Promise.all([
		getUserProgress(),
		getUserSubscription(),
	]);
	if (!userProgress || !userProgress.activeCourse) redirect("/courses");

	const course = userProgress.activeCourse.slug;
	const tasks = listTasks(course);
	const rows = course
		? await db.select().from(writingSubmissions)
			.where(
				and(
					eq(writingSubmissions.userId, userId),
					eq(writingSubmissions.course, course),
				),
			)
			.orderBy(desc(writingSubmissions.createdAt))
		: [];
	const latest = new Map<string, (typeof rows)[number]>();
	for (const r of rows) {
		if (!latest.has(r.promptId)) latest.set(r.promptId, r);
	}

	return (
		<div className="flex flex-row-reverse gap-8">
			<StickyWrapper>
				<UserProgress
					activeCourse={userProgress.activeCourse}
					hearts={userProgress.hearts}
					points={userProgress.points}
					gems={userProgress.gems}
					hasActiveSubscription={!!userSubscription?.isActive}
				/>
			</StickyWrapper>
			<FeedWrapper>
				<PageHeader
					title="쓰기 과제"
					description="배운 표현을 내 문장으로 쓰고, 첨삭으로 한 번 더 배워요."
					icon="writing"
				/>
				<section className="game-panel mb-6 flex flex-wrap items-center gap-4 p-5 sm:p-6">
					<Mascot pose="thinking" className="h-24 w-24 shrink-0" />
					<div className="min-w-0 flex-1 basis-48">
						<h2 className="text-xl font-extrabold">
							내 문장으로 한 걸음 더
						</h2>
						<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
							답안을 제출하면 점수와 첨삭이 과제에 도착해요. 작성
							중인 답안은 이 브라우저에 저장돼요.
						</p>
					</div>
				</section>

				{tasks.length === 0
					? (
						<p className="game-empty p-6 text-sm text-muted-foreground">
							이 코스에는 아직 쓰기 과제가 없어요. 학습 화면에서
							레슨을 이어가세요.
						</p>
					)
					: (
						<ul className="grid w-full gap-4">
							{tasks.map((t) => {
								const s = latest.get(t.id);
								const graded = s?.score !== null &&
									s?.score !== undefined;
								const fresh = !!s && isUnread(s);
								return (
									<li key={t.id}>
										<Link
											href={`/writing/${t.id}`}
											prefetch
											className="game-panel group flex min-h-24 flex-wrap items-center gap-4 p-5 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:translate-y-0.5 motion-reduce:transform-none"
										>
											<BrandIcon
												name="writing"
												className="h-10 w-10 shrink-0"
											/>
											{t.number !== undefined && (
												<span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-600">
													{t.number}
												</span>
											)}
											<span className="min-w-0 flex-1">
												<span className="block break-words text-base font-extrabold text-neutral-800">
													{t.title}
												</span>
												<span
													className={cn(
														"block text-sm font-semibold",
														!s
															? "text-muted-foreground"
															: graded
															? "text-green-700"
															: "text-amber-600",
													)}
												>
													{!s
														? `새 과제 · ${t.maxScore}점`
														: graded
														? `${s.score} / ${s.maxScore}점`
														: "채점 대기 중"}
												</span>
											</span>
											{fresh && (
												<span className="flex-none rounded-full bg-green-500 px-2 py-0.5 text-sm font-black text-white">
													첨삭 도착
												</span>
											)}
											<ChevronRight className="h-4 w-4 flex-none text-neutral-300 transition-transform group-hover:translate-x-0.5" />
										</Link>
									</li>
								);
							})}
						</ul>
					)}
			</FeedWrapper>
		</div>
	);
};

export default WritingPage;
