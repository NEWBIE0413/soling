import { PageHeader } from "@/components/page-header";
import { Mascot } from "@/components/mascot";
import { auth } from "@/lib/session";

import { getCourses, getUserProgress } from "@/db/queries";

import { List } from "./list";

const CoursesPage = async () => {
	await auth.protect();

	const coursesData = getCourses();
	const userProgressData = getUserProgress();

	const [courses, userProgress] = await Promise.all([
		coursesData,
		userProgressData,
	]);

	return (
		<div className="mx-auto w-full max-w-5xl pb-8">
			<PageHeader
				title="언어 코스"
				description="배우고 싶은 언어를 고르면, 나만의 학습 여정이 시작돼요."
				icon="course"
			/>
			<section className="game-panel mb-6 flex flex-wrap items-center gap-4 p-5 sm:p-6">
				<Mascot pose="wave" className="h-24 w-24 shrink-0" />
				<div className="min-w-0 flex-1 basis-48">
					<h2 className="text-xl font-extrabold">
						어떤 언어로 시작할까요?
					</h2>
					<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
						코스를 바꿔도 지금까지의 학습 기록은 그대로 남아요.
					</p>
				</div>
			</section>

			<List
				courses={courses}
				activeCourseId={userProgress?.activeCourseId}
			/>
		</div>
	);
};

export default CoursesPage;
