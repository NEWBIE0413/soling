import { lessons, units } from "@/db/schema";

import { LessonButton } from "./lesson-button";
import { UnitBanner } from "./unit-banner";

type UnitProps = {
	id: number;
	order: number;
	title: string;
	description: string;
	lessons: (typeof lessons.$inferSelect & {
		completed: boolean;
	})[];
	activeLesson:
		| (typeof lessons.$inferSelect & {
			unit: typeof units.$inferSelect;
		})
		| undefined;
	activeLessonPercentage: number;
	justDone?: number; // lesson finished just now (first completion) — see learn/page.tsx
	opened?: number; // the lesson that finish opened
};

export const Unit = ({
	order,
	title,
	description,
	lessons,
	activeLesson,
	activeLessonPercentage,
	justDone,
	opened,
}: UnitProps) => {
	const done = lessons.filter((l) => l.completed).length;
	return (
		<>
			<UnitBanner
				order={order}
				title={title}
				description={description}
				done={done}
				total={lessons.length}
				grownFrom={lessons.some((l) => l.id === justDone)
					? done - 1
					: undefined}
			/>

			<div className="relative mx-auto flex w-full max-w-[480px] flex-col items-center gap-2 py-6">
				{lessons.map((lesson, i) => {
					const isCurrent = lesson.id === activeLesson?.id;
					const isLocked = !lesson.completed && !isCurrent;

					return (
						<LessonButton
							key={lesson.id}
							id={lesson.id}
							title={lesson.title}
							index={i}
							totalCount={lessons.length - 1}
							current={isCurrent}
							locked={isLocked}
							percentage={activeLessonPercentage}
							moment={lesson.id === justDone
								? "done"
								: lesson.id === opened
								? "opened"
								: undefined}
						/>
					);
				})}
			</div>
		</>
	);
};
