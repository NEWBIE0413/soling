"use client";

import {
	useEffect,
	useMemo,
	useState,
	useSyncExternalStore,
	useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { BrandIcon } from "@/components/brand-icon";
import { cn } from "@/lib/utils";
import {
	countChars,
	joinBlanks,
	MAX_SUBMISSION_CHARS,
} from "@/lib/writing-shared";

type Props = {
	course: string;
	taskId: string;
	blanks: string[];
	minChars: number | null;
	maxChars: number | null;
};

/*
 Fill-in tasks (blanks) get one input per blank and are submitted as "㉠: …" lines; everything else is a
 textarea with a live count. The draft is kept in this browser until it is submitted — a 700-character
 essay lost to a reload is the one thing that would make someone stop doing these.
*/
// Wait for hydration before reading this browser's draft; never save a blank SSR draft over it.
const subscribeHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export const WritingEditor = (props: Props) => {
	const hydrated = useSyncExternalStore(
		subscribeHydration,
		clientSnapshot,
		serverSnapshot,
	);
	return hydrated
		? <DraftEditor key={`${props.course}.${props.taskId}`} {...props} />
		: (
			<section className="game-panel mt-6 p-6" aria-busy="true">
				<p className="text-base text-muted-foreground">
					저장된 답안을 불러오고 있어요.
				</p>
			</section>
		);
};

const DraftEditor = ({ course, taskId, blanks, minChars, maxChars }: Props) => {
	const router = useRouter();
	const key = `solingo.writing.${course}.${taskId}`;
	const [{ text, answers }, setDraft] = useState(() => {
		const emptyDraft = { text: "", answers: blanks.map(() => "") };
		try {
			const saved: unknown = JSON.parse(
				localStorage.getItem(key) ?? "null",
			);
			if (!saved || typeof saved !== "object") return emptyDraft;
			const savedAnswers =
				"answers" in saved && Array.isArray(saved.answers)
					? saved.answers
					: [];
			return {
				text: "text" in saved && typeof saved.text === "string"
					? saved.text
					: "",
				answers: blanks.map((_, i) =>
					typeof savedAnswers[i] === "string" ? savedAnswers[i] : ""
				),
			};
		} catch {
			// Missing storage permission or a damaged draft must not prevent writing.
			return emptyDraft;
		}
	});
	const [pending, start] = useTransition();

	useEffect(() => {
		try {
			localStorage.setItem(key, JSON.stringify({ text, answers }));
		} catch {}
	}, [key, text, answers]);

	const body = blanks.length ? joinBlanks(blanks, answers) : text;
	const empty = blanks.length
		? answers.every((a) => !a.trim())
		: !text.trim();
	const n = useMemo(() => countChars(text), [text]);
	const tone = minChars && n < minChars
		? "text-amber-600"
		: maxChars && n > maxChars
		? "text-rose-600"
		: n
		? "text-green-700"
		: "text-muted-foreground";

	const submit = () =>
		start(async () => {
			const res = await fetch("/api/writing", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ course, promptId: taskId, text: body }),
			});
			if (!res.ok) {
				toast.error(
					((await res.json().catch(() => ({}))) as { error?: string })
						.error ?? "제출하지 못했어요.",
				);
				return;
			}
			try {
				localStorage.removeItem(key);
			} catch {}
			setDraft({ text: "", answers: blanks.map(() => "") });
			toast.success("제출했어요. 채점되면 여기서 첨삭을 볼 수 있어요.");
			router.refresh();
		});

	return (
		<section className="game-panel mt-6 p-5 sm:p-6">
			<h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold">
				<BrandIcon name="writing" className="h-7 w-7" />내 답안 작성
			</h2>
			{blanks.length
				? (
					<div className="flex flex-col gap-3">
						{blanks.map((b, i) => (
							<label key={b} className="flex items-center gap-2">
								<span className="w-7 flex-none text-center text-lg font-bold text-violet-600">
									{b}
								</span>
								<input
									value={answers[i] ?? ""}
									onChange={(e) =>
										setDraft((draft) => ({
											...draft,
											answers: draft.answers.map((v, j) =>
												j === i ? e.target.value : v
											),
										}))}
									className="h-12 min-w-0 flex-1 rounded-xl border-2 border-slate-200 px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
									placeholder="한 문장으로"
									aria-label={`${b} 답`}
								/>
							</label>
						))}
					</div>
				)
				: (
					<>
						<textarea
							value={text}
							onChange={(e) =>
								setDraft((draft) => ({
									...draft,
									text: e.target.value,
								}))}
							rows={maxChars && maxChars > 400 ? 14 : 9}
							maxLength={MAX_SUBMISSION_CHARS + 500}
							className="w-full resize-y rounded-xl border-2 border-slate-200 p-3 text-base leading-relaxed outline-none [word-break:keep-all] focus-visible:ring-2 focus-visible:ring-ring"
							placeholder="여기에 답안을 쓰세요."
							aria-label="답안"
						/>
						<p
							className={cn(
								"mt-1 text-right text-sm font-bold tabular-nums",
								tone,
							)}
						>
							{n}자{minChars || maxChars
								? ` / ${minChars ?? 0}~${maxChars ?? ""}`
								: ""}
							<span className="ml-1 text-sm font-medium text-muted-foreground">
								(띄어쓰기 포함, 줄바꿈 제외)
							</span>
						</p>
					</>
				)}
			<Button
				type="button"
				variant="secondary"
				onClick={submit}
				disabled={pending || empty}
				className="mt-5 min-h-12 w-full text-base font-bold"
			>
				{pending ? "제출 중…" : "제출하기"}
			</Button>
		</section>
	);
};
