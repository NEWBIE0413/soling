"use client";

import { useCompanion } from "@/components/companion-provider";
import { companionArt } from "@/public/companion-art";
import type { CompanionId } from "@/public/companions";
import { cn } from "@/lib/utils";

type MascotProps = {
	readonly character?: CompanionId;
	readonly pose?: "idle" | "wave" | "celebrate" | "thinking" | "encourage";
	readonly className?: string;
	readonly label?: string;
};

export function Mascot(
	{ character, pose = "idle", className, label }: MascotProps,
) {
	const companion = useCompanion();
	const id = character ?? companion.id;
	return (
		<svg
			key={`${id}-${pose}`}
			viewBox="0 0 240 220"
			fill="none"
			role={label ? "img" : undefined}
			aria-label={label}
			aria-hidden={label ? undefined : true}
			focusable="false"
			data-character={id}
			data-pose={pose}
			className={cn("solingo-mascot", `mascot-${pose}`, className)}
			// Only fixed local SVG shapes are returned; learner text never enters the markup.
			dangerouslySetInnerHTML={{ __html: companionArt(id, pose) }}
		/>
	);
}
