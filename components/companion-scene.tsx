"use client";

import { useEffect, useRef } from "react";
import { useCompanion } from "@/components/companion-provider";
import { Mascot } from "@/components/mascot";
import { habitatMarkup, observeHabitat } from "@/public/companion-habitat";

export function CompanionScene({ mode = "home", label }: {
	mode?: "home" | "celebrate";
	label?: string;
}) {
	const companion = useCompanion();
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (ref.current) return observeHabitat(ref.current);
	}, [companion.id]);
	return (
		<div
			ref={ref}
			className="companion-scene"
			data-habitat={companion.id}
			data-scene={mode}
			data-paused="true"
		>
			<div
				className="habitat-drawing"
				aria-hidden="true"
				dangerouslySetInnerHTML={{
					__html: habitatMarkup(companion.id),
				}}
			/>
			<Mascot
				pose={mode === "celebrate" ? "celebrate" : "wave"}
				label={label}
			/>
		</div>
	);
}
