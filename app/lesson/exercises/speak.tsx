"use client";

import { useEffect, useRef, useState } from "react";

import { Mic, Volume2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { play, restorePlayback } from "../audio";

type RecognitionEvent = {
	results: ArrayLike<
		ArrayLike<{ transcript: string }> & { isFinal: boolean }
	>;
};
type Recognition = {
	lang: string;
	maxAlternatives: number;
	interimResults: boolean;
	continuous: boolean;
	onstart: (() => void) | null;
	onresult: ((event: RecognitionEvent) => void) | null;
	onerror: ((event: { error: string }) => void) | null;
	onend: (() => void) | null;
	start: () => void;
	stop: () => void;
	abort: () => void;
};
type RecognitionConstructor = new () => Recognition;

const norm = (text: string) =>
	text.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
		.replace(/[\s。、．，.!?！？ー]/g, "").toLowerCase();
const similar = (first: string, second: string) => {
	const a = norm(first), b = norm(second);
	if (!a || !b) return 0;
	if (a === b || a.includes(b) || b.includes(a)) return 1;
	const m = a.length, n = b.length;
	const distances = Array.from(
		{ length: m + 1 },
		(_, i) => [i, ...Array<number>(n).fill(0)],
	);
	for (let j = 1; j <= n; j++) distances[0][j] = j;
	for (let i = 1; i <= m; i++) {
		for (let j = 1; j <= n; j++) {
			distances[i][j] = Math.min(
				distances[i - 1][j] + 1,
				distances[i][j - 1] + 1,
				distances[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
			);
		}
	}
	return 1 - distances[m][n] / Math.max(m, n);
};

export const Speak = ({ target, reading, meaning, audioSrc, lang, onResult }: {
	target: string;
	reading?: string;
	meaning?: string;
	audioSrc: string | null;
	lang: string;
	onResult: (result: { ok: boolean; heard: string } | { skip: true }) => void;
}) => {
	const [listening, setListening] = useState(false);
	const [heard, setHeard] = useState("");
	const [verdict, setVerdict] = useState<"" | "ok" | "no">("");
	const rec = useRef<Recognition | null>(null);
	useEffect(() => {
		play(audioSrc);
	}, [audioSrc]);
	useEffect(() => {
		const release = () => {
			if (document.visibilityState === "hidden") {
				rec.current?.abort();
				rec.current = null;
				setListening(false);
			}
		};
		document.addEventListener("visibilitychange", release);
		return () => {
			document.removeEventListener("visibilitychange", release);
			rec.current?.abort();
			restorePlayback();
		};
	}, []);
	const start = () => {
		const browser: Window & {
			SpeechRecognition?: RecognitionConstructor;
			webkitSpeechRecognition?: RecognitionConstructor;
		} = window;
		const Constructor = browser.SpeechRecognition ??
			browser.webkitSpeechRecognition;
		if (!Constructor) {
			setHeard(
				"이 브라우저는 음성 인식을 지원하지 않아요. 건너뛰기로 계속할 수 있어요.",
			);
			return;
		}
		if (rec.current) {
			rec.current.stop();
			return;
		}
		const recognition = new Constructor();
		rec.current = recognition;
		recognition.lang = lang;
		recognition.maxAlternatives = 5;
		recognition.interimResults = true;
		recognition.continuous = false;
		recognition.onstart = () => {
			setListening(true);
			setHeard("");
			setVerdict("");
		};
		recognition.onresult = (event) => {
			const alternatives = Array.from(event.results).flatMap((result) =>
				Array.from(result).map((alternative) => alternative.transcript)
			);
			const text = alternatives[0] ?? "";
			setHeard(text);
			if (!event.results[event.results.length - 1].isFinal) return;
			const best = Math.max(
				...alternatives.map((alternative) =>
					similar(alternative, target)
				),
				0,
			);
			const ok = best >= .6 ||
				/[一-龯]/.test(text) && text.length <= target.length + 1;
			setVerdict(ok ? "ok" : "no");
			recognition.abort();
			onResult({ ok, heard: text });
		};
		recognition.onerror = (event) => {
			setListening(false);
			restorePlayback();
			rec.current = null;
			setHeard(
				event.error === "not-allowed"
					? "마이크 권한을 허용하거나 건너뛰기로 계속해 주세요."
					: event.error === "no-speech"
					? "소리가 들리지 않았어요. 다시 말해 주세요."
					: "인식하지 못했어요. 다시 시도하거나 건너뛰어 주세요.",
			);
		};
		recognition.onend = () => {
			setListening(false);
			rec.current = null;
			restorePlayback();
		};
		recognition.start();
	};
	return (
		<div className="flex flex-col items-center gap-5">
			<p
				className={cn(
					"text-center font-extrabold text-foreground",
					target.length <= 2
						? "text-6xl"
						: "text-3xl leading-relaxed",
				)}
			>
				{target}
			</p>
			<div className="text-center">
				<p className="text-lg text-muted-foreground">{reading}</p>
				{meaning && (
					<p className="mt-1 text-base text-muted-foreground">
						{meaning}
					</p>
				)}
			</div>
			<Button
				type="button"
				onClick={() => play(audioSrc)}
				variant="primary"
				size="icon"
				aria-label="다시 듣기"
			>
				<Volume2 size={24} />
			</Button>
			<Button
				type="button"
				onClick={start}
				variant={listening ? "danger" : "primary"}
				size="lg"
				className="w-full"
			>
				<Mic size={24} />
				{listening
					? "듣는 중 · 누르면 멈춰요"
					: verdict === "ok"
					? "잘했어요"
					: verdict === "no"
					? "다시 말하기"
					: "눌러서 말하기"}
			</Button>
			<p
				role="status"
				className={cn(
					"min-h-8 text-center text-base",
					verdict === "ok"
						? "text-green-700"
						: verdict === "no"
						? "text-rose-700"
						: "text-muted-foreground",
				)}
			>
				{heard}
			</p>
			<Button
				type="button"
				variant="ghost"
				onClick={() => {
					rec.current?.abort();
					onResult({ skip: true });
				}}
			>
				지금은 말하기 건너뛰기
			</Button>
		</div>
	);
};
