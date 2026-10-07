"use client";

import { useEffect } from "react";

import { Volume2 } from "lucide-react";

import { play } from "../audio";

// Big speaker that auto-plays on mount; the option grid is rendered by the parent below it.
export const ListenPrompt = ({ audioSrc }: { audioSrc: string | null }) => {
	useEffect(() => {
		play(audioSrc);
	}, [audioSrc]);
	return (
		<div className="flex justify-center">
			<button
				type="button"
				onClick={() => play(audioSrc)}
				className="game-button game-button-blue flex h-28 w-28 items-center justify-center rounded-[28px] sm:h-32 sm:w-32"
				aria-label="다시 듣기"
			>
				<Volume2 className="h-16 w-16" strokeWidth={2.5} />
			</button>
		</div>
	);
};
