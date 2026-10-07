import { InfinityIcon, X } from "lucide-react";

import { BrandIcon } from "@/components/brand-icon";
import { Progress } from "@/components/ui/progress";
import { useExitModal } from "@/store/use-exit-modal";

type HeaderProps = {
	hearts: number;
	percentage: number;
	hasActiveSubscription: boolean;
	combo?: number;
};

export const Header = (
	{ hearts, percentage, hasActiveSubscription, combo = 0 }: HeaderProps,
) => {
	const { open } = useExitModal();
	return (
		<header className="mx-auto flex w-full max-w-[1000px] shrink-0 items-center gap-3 px-4 pb-4 pt-[calc(16px+env(safe-area-inset-top))] sm:gap-6 sm:px-8 sm:pb-6 sm:pt-8">
			<button
				type="button"
				onClick={open}
				aria-label="레슨 나가기"
				className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted"
			>
				<X size={24} />
			</button>
			<div className="min-w-0 flex-1">
				<Progress value={percentage} aria-label="레슨 진행률" />
			</div>
			{combo >= 2 && (
				<span className="hidden items-center gap-1 text-sm font-black text-[#a95016] sm:flex">
					<BrandIcon name="streak" className="h-7 w-7" />
					{combo}
				</span>
			)}
			<span
				className="flex items-center gap-1 text-base font-extrabold text-[#b63448]"
				aria-label={hasActiveSubscription
					? "무제한 하트"
					: `남은 하트 ${hearts}`}
			>
				<BrandIcon name="heart" className="h-8 w-8" />
				{hasActiveSubscription ? <InfinityIcon size={22} /> : hearts}
			</span>
		</header>
	);
};
