import { PageHeader } from "@/components/page-header";
import { CompanionFeedback } from "@/components/companion-feedback";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";

import { FeedWrapper } from "@/components/feed-wrapper";
import { Markdown } from "@/components/markdown";
import db from "@/db/drizzle";
import { getUserProgress } from "@/db/queries";
import { writingSubmissions } from "@/db/schema";
import { auth } from "@/lib/session";
import { getTask, unreadFeedback } from "@/lib/writing";
import { blanksOf, countChars, isUnread } from "@/lib/writing-shared";

import { WritingEditor } from "./writing-editor";

const fmt = new Intl.DateTimeFormat("ko-KR", {
	month: "numeric",
	day: "numeric",
	hour: "numeric",
	minute: "2-digit",
	timeZone: "Asia/Seoul",
});

// 과제 하나: 지시문, 편집기, 지금까지 낸 답안(최신순)과 각각의 점수·첨삭.
const WritingTaskPage = async (
	{ params }: { params: Promise<{ id: string }> },
) => {
	const userId = (await auth.protect()).user.id;
	const [{ id }, userProgress] = await Promise.all([
		params,
		getUserProgress(),
	]);
	if (!userProgress?.activeCourse) redirect("/courses");
	const course = userProgress.activeCourse.slug;
	const task = getTask(course, id);
	if (!course || !task) notFound();

	const mine = and(
		eq(writingSubmissions.userId, userId),
		eq(writingSubmissions.course, course),
		eq(writingSubmissions.promptId, id),
	);
	const history = await db.select().from(writingSubmissions).where(mine)
		.orderBy(desc(writingSubmissions.createdAt));
	// opening the task is reading its feedback: clear the "첨삭 도착" badge
	if (history.some(isUnread)) {
		await db.update(writingSubmissions).set({ seenAt: new Date() }).where(
			and(mine, unreadFeedback),
		);
	}
	const range = task.minChars || task.maxChars
		? `${task.minChars ?? 0}~${task.maxChars ?? ""}자 (띄어쓰기 포함)`
		: null;

	return (
		<div className="flex flex-row-reverse gap-8">
			<FeedWrapper>
				<div className="mb-4 flex flex-wrap items-center gap-2">
					<Link
						href="/writing"
						prefetch
						aria-label="쓰기 과제 목록"
						className="flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground hover:bg-slate-100"
					>
						<ArrowLeft className="h-5 w-5" />
					</Link>
					{task.number !== undefined && (
						<span className="rounded-lg bg-violet-100 px-2 py-0.5 text-sm font-black text-violet-600">
							{task.number}번
						</span>
					)}
				</div>

				<PageHeader
					title={task.title}
					description="문제를 읽고, 아래에 나만의 답안을 작성해보세요."
					icon="writing"
				/>
				<section className="game-panel p-5 sm:p-6">
					<Markdown>{task.prompt}</Markdown>
					<p className="mt-3 text-sm font-semibold text-muted-foreground">
						{task.maxScore}점{range ? ` · ${range}` : ""}
					</p>
				</section>

				<WritingEditor
					key={`${course}.${task.id}`}
					course={course}
					taskId={task.id}
					blanks={blanksOf(task)}
					minChars={task.minChars ?? null}
					maxChars={task.maxChars ?? null}
				/>

				{history.length > 0 && (
					<section className="mt-6 mb-10">
						<h2 className="mb-4 text-xl font-extrabold">내 답안</h2>
						<ul className="flex flex-col gap-3">
							{history.map((h) => (
								<li
									key={h.id}
									className="game-panel p-5 sm:p-6"
								>
									<div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-muted-foreground">
										<span>
											{fmt.format(h.createdAt)} ·{" "}
											{countChars(h.text)}자
										</span>
										{h.score !== null
											? (
												<span className="rounded-full bg-green-100 px-2 py-0.5 text-sm font-black text-green-700">
													{h.score} / {h.maxScore}
												</span>
											)
											: (
												<span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">
													채점 대기
												</span>
											)}
									</div>
									<p className="whitespace-pre-wrap break-words text-base leading-relaxed text-neutral-800 [word-break:keep-all]">
										{h.text}
									</p>
									{h.feedback && (
										<CompanionFeedback grader={h.grader}>
											<Markdown className="text-sm">
												{h.feedback}
											</Markdown>
										</CompanionFeedback>
									)}
								</li>
							))}
						</ul>
					</section>
				)}
			</FeedWrapper>
		</div>
	);
};

export default WritingTaskPage;
