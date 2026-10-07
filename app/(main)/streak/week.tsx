import { Snowflake } from "lucide-react";

import { BrandIcon } from "@/components/brand-icon";
import { cn } from "@/lib/utils";
import { weekDays } from "@/lib/streak";

const LABELS = ["월", "화", "수", "목", "금", "토", "일"];

// 이번 주(월~일, KST) 7칸: 출석 ✓(초록) · 보호권 ❄(하늘) · 결석(회색 빈 원) · 오늘 미완(초록 점선).
export const WeekCalendar = async ({ userId }: { userId: string }) => {
	const days = await weekDays(userId);

	return (
		<div className="game-panel mb-6 w-full p-4 sm:p-6">
			<h2 className="mb-4 text-xl font-extrabold">이번 주 출석</h2>
			<div className="grid grid-cols-7 gap-1 sm:gap-2">
				{days.map((d, i) => (
					<div
						key={d.day}
						className="flex flex-col items-center gap-1.5"
					>
						<span
							className={cn(
								"text-sm font-bold",
								d.isToday
									? "font-black text-green-700"
									: "text-muted-foreground",
							)}
						>
							{LABELS[i]}
						</span>
						<span
							className={cn(
								"flex aspect-square w-full max-w-11 items-center justify-center rounded-full border-2 ",
								d.attended &&
									"border-green-500 bg-green-500 text-white shadow-sm",
								d.frozen &&
									"border-sky-300 bg-sky-100 text-sky-500 shadow-sm",
								!d.attended &&
									!d.frozen &&
									(d.isToday
										? "border-dashed border-green-500 bg-green-50/40"
										: "border-slate-200 bg-slate-50"),
							)}
							role="img"
							aria-label={`${d.day}${
								d.frozen
									? " · 보호권 사용"
									: d.attended
									? " · 출석 완료"
									: d.isToday
									? " · 오늘 출석 전"
									: " · 출석 없음"
							}`}
						>
							{d.attended
								? <BrandIcon name="check" className="h-8 w-8" />
								: d.frozen
								? (
									<Snowflake className="h-4 w-4 sm:h-5 sm:w-5" />
								)
								: null}
						</span>
					</div>
				))}
			</div>
			<p className="mt-4 text-sm leading-relaxed text-muted-foreground">
				출석 완료는 체크, 보호권 사용은 눈꽃으로 표시돼요.
			</p>
		</div>
	);
};
