import { PageHeader } from "@/components/page-header";
import { BrandIcon } from "@/components/brand-icon";
import { Mascot } from "@/components/mascot";
import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getQuestBoard } from "@/lib/economy";
import {
	getCourseProgress,
	getUserProgress,
	getUserSubscription,
} from "@/db/queries";
import { auth } from "@/lib/session";

import { QuestList } from "./quest-list";

const QuestsPage = async () => {
	const { userId } = await auth.protect().then((s) => ({
		userId: s.user.id,
	}));

	const [userProgress, userSubscription] = await Promise.all([
		getUserProgress(),
		getUserSubscription(),
	]);

	if (!userProgress || !userProgress.activeCourse) redirect("/courses");

	// 가나 훈련 퀘스트는 일본어 코스(가나·JLPT) 사용자에게만 노출된다.
	const courseTitle = userProgress.activeCourse.title;
	const onlyCourseKana = courseTitle.includes("가나") ||
		courseTitle.includes("JLPT");

	const board = await getQuestBoard(userId, onlyCourseKana);

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
				<div className="flex w-full flex-col items-center">
					<div className="w-full">
						<PageHeader
							title="퀘스트"
							description="작은 목표를 달성하고, 오늘의 젬을 모아보세요."
							icon="quests"
						/>
					</div>
					<section className="game-panel mb-6 flex w-full flex-wrap items-center gap-5 p-5 sm:p-6">
						<Mascot
							pose="celebrate"
							className="h-24 w-24 shrink-0"
						/>
						<div className="min-w-0 flex-1 basis-48">
							<h2 className="text-xl font-extrabold">
								오늘의 작은 도전
							</h2>
							<p className="mt-1 text-sm leading-relaxed text-muted-foreground">
								완료한 목표의 받기 버튼을 누르면 보상이
								지급돼요.
							</p>
							<div className="mt-3 flex items-center gap-2 text-xl font-black tabular-nums">
								<BrandIcon name="gem" className="h-7 w-7" />
								{userProgress.gems}{" "}
								<span className="text-sm font-bold text-muted-foreground">
									젬
								</span>
							</div>
						</div>
					</section>

					<QuestList
						quests={board.quests}
						initialGems={userProgress.gems}
					/>
				</div>
			</FeedWrapper>
		</div>
	);
};

export default QuestsPage;
