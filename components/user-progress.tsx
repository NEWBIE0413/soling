import { InfinityIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { BrandIcon } from "@/components/brand-icon";
import { CountUp } from "@/components/count-up";
import { courses } from "@/db/schema";

type UserProgressProps = {
	activeCourse: typeof courses.$inferSelect;
	hearts: number;
	points: number;
	gems: number;
	hasActiveSubscription: boolean;
};

export const UserProgress = (
	{ activeCourse, hearts, points, gems, hasActiveSubscription }:
		UserProgressProps,
) => (
	<section className="game-panel">
		<Link
			href="/courses"
			className="mb-5 flex items-center gap-3 text-sm font-extrabold"
		>
			<Image
				src={activeCourse.imageSrc}
				alt=""
				className="rounded-lg"
				width={36}
				height={36}
			/>
			<span className="min-w-0 flex-1">{activeCourse.title}</span>
			<span className="text-xs font-bold text-muted-foreground">
				변경
			</span>
		</Link>
		<div className="grid grid-cols-3 gap-2 border-t border-border pt-4">
			<Link
				href="/leaderboard"
				aria-label={`누적 XP ${points}`}
				className="flex min-h-14 flex-col items-center gap-1 text-sm font-black"
			>
				<BrandIcon name="xp" />
				<CountUp value={points} storageKey="side-xp" />
			</Link>
			<Link
				href="/shop"
				aria-label={`보유 젬 ${gems}`}
				className="flex min-h-14 flex-col items-center gap-1 text-sm font-black"
			>
				<BrandIcon name="gem" />
				<CountUp value={gems} storageKey="side-gems" />
			</Link>
			<Link
				href="/shop"
				aria-label={hasActiveSubscription
					? "무제한 하트"
					: `하트 ${hearts}`}
				className="flex min-h-14 flex-col items-center gap-1 text-sm font-black"
			>
				<BrandIcon name="heart" />
				{hasActiveSubscription
					? <InfinityIcon className="h-5 w-5" />
					: hearts}
			</Link>
		</div>
	</section>
);
