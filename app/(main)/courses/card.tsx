import { Loader2 } from "lucide-react";
import Image from "next/image";

import { BrandIcon } from "@/components/brand-icon";
import { cn } from "@/lib/utils";

type CardProps = {
	title: string;
	id: number;
	imageSrc: string;
	onClick: (id: number) => void;
	disabled?: boolean;
	isActive?: boolean;
	switching?: boolean;
};

export const Card = ({
	title,
	id,
	imageSrc,
	onClick,
	disabled,
	isActive,
	switching,
}: CardProps) => {
	return (
		<button
			type="button"
			disabled={disabled}
			aria-pressed={!!isActive}
			onClick={() => onClick(id)}
			className={cn(
				"game-panel flex h-full min-h-56 w-full min-w-0 flex-col items-center justify-between gap-4 p-6 text-center transition-transform active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transform-none",
				isActive
					? "bg-[var(--game-green-soft)]"
					: "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80",
				disabled && "opacity-60",
			)}
		>
			<div className="flex min-h-[24px] w-full items-center justify-end">
				{switching
					? (
						<div className="flex items-center justify-center rounded-full bg-emerald-600 p-1 shadow-sm">
							<Loader2 className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none stroke-[3] text-white" />
						</div>
					)
					: isActive
					? (
						<div className="flex items-center justify-center rounded-full bg-emerald-500 p-1 shadow-sm">
							<BrandIcon name="check" className="h-6 w-6" />
						</div>
					)
					: null}
			</div>

			<Image
				src={imageSrc}
				alt={title}
				height={64}
				width={85}
				className="rounded-xl border border-slate-200 object-cover shadow-sm"
			/>

			<p className="mt-2.5 text-center text-base font-extrabold leading-relaxed text-neutral-800 [word-break:keep-all] sm:text-base">
				{title}
			</p>
			<span className="text-sm font-bold text-muted-foreground">
				{switching
					? "코스 변경 중…"
					: isActive
					? "학습 이어가기"
					: "이 코스 시작하기"}
			</span>
		</button>
	);
};
