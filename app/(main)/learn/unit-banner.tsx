import { BrandIcon } from "@/components/brand-icon";

type UnitBannerProps = {
	order?: number;
	title: string;
	description: string;
	done: number;
	total: number;
	grownFrom?: number;
};

export const UnitBanner = (
	{ order, title, description, done, total }: UnitBannerProps,
) => {
	const percentage = total ? Math.round(100 * done / total) : 0;
	return (
		<div className="flex w-full items-start gap-4 rounded-[20px] bg-muted p-5">
			<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-lg font-black text-[var(--game-green-depth)]">
				{done >= total && total > 0
					? <BrandIcon name="check" />
					: order}
			</span>
			<div className="min-w-0 flex-1">
				<div className="flex items-center justify-between gap-3 text-xs font-bold text-muted-foreground">
					<span>유닛 {order}</span>
					<span>{done} / {total} 레슨</span>
				</div>
				<h2 className="mt-1 text-lg font-black leading-snug text-foreground">
					{title}
				</h2>
				<p className="mt-1 text-sm leading-relaxed text-muted-foreground">
					{description}
				</p>
				<div
					role="progressbar"
					aria-label={`${title} 진행률`}
					aria-valuenow={percentage}
					aria-valuemin={0}
					aria-valuemax={100}
					className="mt-3 h-2 overflow-hidden rounded-full bg-[#dce3d7]"
				>
					<div
						className="h-full origin-left rounded-full bg-[var(--game-green)] transition-transform duration-300 motion-reduce:transition-none"
						style={{ transform: `scaleX(${percentage / 100})` }}
					/>
				</div>
			</div>
		</div>
	);
};
