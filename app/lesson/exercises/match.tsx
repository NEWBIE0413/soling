"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";

import { challengeOptions } from "@/db/schema";
import { cn } from "@/lib/utils";

import { play } from "../audio";

type Opt = typeof challengeOptions.$inferSelect;
type Meta = { pair: string; side: "left" | "right" };

/* Two columns; tap one from each side. Right pairs lock green, wrong pairs flash rose. Done when every pair is matched. */
export const Match = (
	{ options, onDone, disabled }: {
		options: Opt[];
		onDone: (wrong: number) => void;
		disabled?: boolean;
	},
) => {
	const left = useMemo(
		() => options.filter((o) => (o.meta as Meta)?.side === "left"),
		[options],
	);
	const right = useMemo(
		() => options.filter((o) => (o.meta as Meta)?.side === "right"),
		[options],
	);
	const [sel, setSel] = useState<Opt | null>(null);
	const [done, setDone] = useState<Set<string>>(new Set());
	const [flash, setFlash] = useState<Set<number>>(new Set());
	const [wrong, setWrong] = useState(0);

	const tap = (o: Opt) => {
		if (disabled) return;
		const m = o.meta as Meta;
		if (done.has(m.pair)) return;
		play(o.audioSrc);
		if (!sel) return setSel(o);
		const sm = sel.meta as Meta;
		if (sm.side === m.side) return setSel(o);
		if (sm.pair === m.pair) {
			const next = new Set(done).add(m.pair);
			setDone(next);
			setSel(null);
			if (next.size === left.length) onDone(wrong);
		} else {
			setWrong((w) => w + 1);
			const f = new Set([o.id, sel.id]);
			setFlash(f);
			setSel(null);
			setTimeout(() => setFlash(new Set()), 450);
		}
	};

	const cell = (o: Opt) => {
		const m = o.meta as Meta;
		const isDone = done.has(m.pair);
		const isSel = sel?.id === o.id;
		const isFlash = flash.has(o.id);
		const script = /[぀-ヿ가-힣]/.test(o.text);
		return (
			<button
				key={o.id}
				type="button"
				onClick={() => tap(o)}
				disabled={disabled || isDone}
				aria-pressed={isSel}
				aria-label={`${o.text}${isDone ? ", 연결 완료" : ""}`}
				className={cn(
					"game-choice relative flex min-h-[72px] w-full items-center justify-center gap-2 px-3 py-4 text-foreground",
					script && o.text.length <= 2
						? "text-3xl"
						: "text-lg font-bold",
					isSel && "bg-[var(--game-blue-soft)]",
					isDone && "bg-[var(--game-green-soft)] text-[#3c741d]",
					isFlash &&
						"bg-[#fff0f1] text-[#a1263d] animate-[shake_220ms] motion-reduce:animate-none",
				)}
			>
				{isDone && <Check className="h-4 w-4 shrink-0" aria-hidden />}
				{o.text}
			</button>
		);
	};
	return (
		<div className="grid grid-cols-2 gap-3">
			<div className="flex flex-col gap-3">{left.map(cell)}</div>
			<div className="flex flex-col gap-3">{right.map(cell)}</div>
		</div>
	);
};
