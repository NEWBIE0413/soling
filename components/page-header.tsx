import type { ReactNode } from "react";

import { BrandIcon, type BrandIconName } from "@/components/brand-icon";

export function PageHeader({
	title,
	description,
	icon,
	children,
}: {
	readonly title: string;
	readonly description?: string;
	readonly icon?: BrandIconName;
	readonly children?: ReactNode;
}) {
	return (
		<header className="mb-8 flex flex-wrap items-center justify-between gap-4">
			<div className="flex min-w-0 items-center gap-4">
				{icon && (
					<span className="game-icon-tile">
						<BrandIcon name={icon} className="h-10 w-10" />
					</span>
				)}
				<div className="min-w-0">
					<h1 className="game-page-title">{title}</h1>
					{description && (
						<p className="mt-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
							{description}
						</p>
					)}
				</div>
			</div>
			{children}
		</header>
	);
}
