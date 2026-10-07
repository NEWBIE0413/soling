"use client";

import type { ReactNode } from "react";
import { useCompanion } from "@/components/companion-provider";
import { Mascot } from "@/components/mascot";

export function CompanionFeedback(
	{ children, grader }: { children: ReactNode; grader: string | null },
) {
	const companion = useCompanion();
	return (
		<section className="mt-4 rounded-2xl bg-[var(--companion-soft)] p-4">
			<div className="mb-3 flex items-center gap-3">
				<Mascot pose="thinking" className="h-16 w-16 shrink-0" />
				<div>
					<h3 className="text-sm font-extrabold text-[var(--companion-ink)]">
						{companion.name}와 첨삭 살펴보기
					</h3>
					<p className="mt-1 text-xs leading-relaxed text-muted-foreground">
						{companion.feedback}
					</p>
				</div>
			</div>
			{children}
			{grader && (
				<p className="mt-3 text-xs text-muted-foreground">
					채점: {grader}
				</p>
			)}
		</section>
	);
}
