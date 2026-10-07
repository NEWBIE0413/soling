"use client";

import { useEffect } from "react";

import { X } from "lucide-react";
import Image from "next/image";

import { BrandIcon } from "@/components/brand-icon";
import { Mascot } from "@/components/mascot";
import { useCelebrate } from "@/store/use-celebrate";

let audio: AudioContext | null = null;

/** An optional reward cue; browser audio restrictions must never block learning. */
export const chime = (kind: string) => {
	try {
		if (!window.AudioContext) return;
		audio ??= new AudioContext();
		const start = audio.currentTime;
		const notes = kind === "combo"
			? [[784, 0], [1046, .08]]
			: kind === "purchase"
			? [[659, 0], [880, .09], [1174, .18]]
			: [[523, 0], [659, .1], [784, .2], [1046, .32]];
		for (const [frequency, delay] of notes) {
			const oscillator = audio.createOscillator();
			const gain = audio.createGain();
			oscillator.type = "sine";
			oscillator.frequency.value = frequency;
			gain.gain.setValueAtTime(0, start + delay);
			gain.gain.linearRampToValueAtTime(.12, start + delay + .01);
			gain.gain.exponentialRampToValueAtTime(.001, start + delay + .3);
			oscillator.connect(gain);
			gain.connect(audio.destination);
			oscillator.start(start + delay);
			oscillator.stop(start + delay + .35);
		}
		navigator.vibrate?.(kind === "combo" ? 12 : [12, 40, 24]);
	} catch {
		// Audio/haptics are enhancement only; visual state already confirms the action.
		return;
	}
};

export const Celebrate = () => {
	const { event, clear } = useCelebrate();
	useEffect(() => {
		if (!event) return;
		chime(event.kind);
		const timer = setTimeout(
			() => clear(event.id),
			event.light ? 1400 : 3200,
		);
		return () => clearTimeout(timer);
	}, [event, clear]);
	if (!event) return null;
	return (
		<div
			key={event.id}
			className="pointer-events-none fixed inset-x-4 top-[calc(12px+env(safe-area-inset-top))] z-[70] flex justify-center sm:left-auto sm:right-6"
		>
			<div
				role="status"
				className="pointer-events-auto flex max-w-sm animate-[drop-in_180ms_ease-out] items-center gap-3 rounded-[20px] border-2 border-border bg-white p-3 pr-4 shadow-lg motion-reduce:animate-[fade_150ms_ease-out]"
			>
				{event.image
					? (
						<Image
							src={event.image}
							alt=""
							width={64}
							height={64}
							className="rounded-2xl"
						/>
					)
					: (
						<Mascot
							pose={event.light ? "idle" : "celebrate"}
							className="h-16 w-16 shrink-0"
						/>
					)}
				<div className="min-w-0">
					<p className="text-base font-extrabold text-foreground">
						{event.title}
					</p>
					{event.subtitle && (
						<p className="mt-1 text-sm text-muted-foreground">
							{event.subtitle}
						</p>
					)}
					{!!event.gems && (
						<p className="mt-1 flex items-center gap-1 text-sm font-black text-sky-700">
							<BrandIcon name="gem" className="h-5 w-5" />+{event
								.gems}
						</p>
					)}
				</div>
				<button
					type="button"
					aria-label="축하 알림 닫기"
					onClick={() => clear(event.id)}
					className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted"
				>
					<X size={18} />
				</button>
			</div>
		</div>
	);
};
