import Link from "next/link";
import { and, eq, sql } from "drizzle-orm";
import { ChevronRight } from "lucide-react";
import { BrandIcon } from "@/components/brand-icon";

import db from "@/db/drizzle";
import {
	countCompletedChallenges,
	countWeakChallenges,
	getUserProgress,
} from "@/db/queries";
import { writingSubmissions } from "@/db/schema";
import { listTasks, unreadFeedback } from "@/lib/writing";

/*
 One card above the unit path: 약점 복습. It is a "different kind of thing to do" rather than a
 step on the path, hence the dashed border. (히라가나 훈련 is its own course in 언어 코스.)
 문구는 상태를 따라간다 — 틀린 문항이 있으면 알리고, 없으면 완료 문항 복습을 안내하고,
 복습할 게 아무것도 없으면 카드가 왜 잠겨 있는지 말해준다.
*/
export const LearnExtras = async () => {
	const [weak, completed, progress] = await Promise.all([
		countWeakChallenges(),
		countCompletedChallenges(),
		getUserProgress(),
	]);
	const writing = await writingSummary(
		progress?.userId,
		progress?.activeCourse?.slug,
	);
	const sub = weak > 0
		? `틀린 문항 ${weak}개`
		: completed > 0
		? "완료 문항 다시 풀기"
		: "레슨 하나 끝내면 열려요";
	// one sleek row, tactile and compact: the unit banner and path below are the hero elements
	return (
		<>
			<Link
				href="/practice"
				prefetch
				className="group mb-3 flex min-h-16 items-center gap-3 rounded-2xl bg-[var(--game-blue-soft)] px-4 py-3 transition-transform active:scale-[0.99] motion-reduce:active:scale-100"
			>
				<BrandIcon name="practice" className="h-9 w-9 shrink-0" />
				<span className="text-sm font-bold text-neutral-800">
					약점 복습
				</span>
				<span className="ml-1 truncate text-xs font-medium text-sky-700/80">
					{sub}
				</span>
				<ChevronRight className="ml-auto h-4 w-4 flex-none text-sky-400 transition-transform duration-150 group-hover:translate-x-0.5" />
			</Link>
			{writing && (
				<Link
					href="/writing"
					prefetch
					className="group mb-3 flex min-h-16 items-center gap-3 rounded-2xl bg-violet-50 px-4 py-3 transition-transform active:scale-[0.99] motion-reduce:active:scale-100"
				>
					<BrandIcon name="writing" className="h-9 w-9 shrink-0" />
					<span className="text-sm font-bold text-neutral-800">
						쓰기 과제
					</span>
					<span className="ml-1 truncate text-xs font-medium text-violet-700/80">
						{writing.fresh > 0
							? `첨삭 도착 ${writing.fresh}`
							: `${writing.total}개 중 ${writing.done}개 제출`}
					</span>
					{writing.fresh > 0 && (
						<span
							className="h-2 w-2 flex-none rounded-full bg-green-500"
							aria-hidden="true"
						/>
					)}
					<ChevronRight className="ml-auto h-4 w-4 flex-none text-violet-400 transition-transform duration-150 group-hover:translate-x-0.5" />
				</Link>
			)}
		</>
	);
};

/** Only for courses that have writing tasks: how many were answered, and how many grades are unread. */
async function writingSummary(
	userId: string | undefined,
	course: string | null | undefined,
) {
	const tasks = listTasks(course);
	if (!userId || !course || !tasks.length) return null;
	const mine = and(
		eq(writingSubmissions.userId, userId),
		eq(writingSubmissions.course, course),
	);
	const [r] = await db
		.select({
			done: sql<
				number
			>`count(distinct ${writingSubmissions.promptId})::int`,
			fresh: sql<number>`(count(*) filter (where ${unreadFeedback}))::int`,
		})
		.from(writingSubmissions)
		.where(mine);
	return { total: tasks.length, done: r?.done ?? 0, fresh: r?.fresh ?? 0 };
}
