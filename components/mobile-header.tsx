import Image from "next/image";
import Link from "next/link";

import { BrandIcon } from "@/components/brand-icon";
import { CountUp } from "@/components/count-up";
import { getUserProgress } from "@/db/queries";
import { auth } from "@/lib/session";
import { getStreak } from "@/lib/streak";

export const MobileHeader = async () => {
	const { userId } = await auth();
	const [progress, streak] = userId
		? await Promise.all([getUserProgress(), getStreak(userId)])
		: [null, null];
	const course = progress?.activeCourse;
	const stats = [
		{
			href: "/streak",
			icon: "streak",
			value: streak?.current ?? 0,
			label: "연속 출석",
			key: "hdr-streak",
		},
		{
			href: "/shop",
			icon: "gem",
			value: progress?.gems ?? 0,
			label: "보유 젬",
			key: "hdr-gems",
		},
		{
			href: "/leaderboard",
			icon: "xp",
			value: progress?.points ?? 0,
			label: "누적 XP",
			key: "hdr-xp",
		},
	] as const;
	return (
		<header className="fixed inset-x-0 top-0 z-50 border-b-2 border-border bg-white pt-[env(safe-area-inset-top)] lg:hidden">
			<div className="flex h-16 items-center justify-between gap-3 px-5">
				<Link
					href="/courses"
					aria-label={course
						? `${course.title}, 코스 바꾸기`
						: "코스 선택"}
					className="flex h-11 min-w-11 items-center justify-center rounded-xl bg-muted"
				>
					{course
						? (
							<Image
								src={course.imageSrc}
								alt=""
								className="rounded-md"
								height={30}
								width={30}
							/>
						)
						: <BrandIcon name="course" />}
				</Link>
				{stats.map((stat) => (
					<Link
						key={stat.key}
						href={stat.href}
						aria-label={`${stat.label} ${stat.value}`}
						className="flex min-h-11 items-center gap-1.5 text-sm font-black tabular-nums text-foreground"
					>
						<BrandIcon name={stat.icon} className="h-7 w-7" />
						<CountUp value={stat.value} storageKey={stat.key} />
					</Link>
				))}
			</div>
		</header>
	);
};
