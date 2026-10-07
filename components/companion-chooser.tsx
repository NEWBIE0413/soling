"use client";

import { useState, useTransition } from "react";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { chooseCompanion } from "@/actions/companion";
import { Mascot } from "@/components/mascot";
import { Button } from "@/components/ui/button";
import {
	COMPANION_IDS,
	type CompanionId,
	COMPANIONS,
} from "@/public/companions";
import { cn } from "@/lib/utils";

export function CompanionChooser({ initialChoice, onboarding = false }: {
	initialChoice?: CompanionId;
	onboarding?: boolean;
}) {
	const [selected, setSelected] = useState<CompanionId | null>(
		initialChoice ?? null,
	);
	const [error, setError] = useState("");
	const [pending, startTransition] = useTransition();
	const router = useRouter();
	const friend = selected ? COMPANIONS[selected] : null;

	function confirm() {
		if (!selected || pending) return;
		setError("");
		startTransition(async () => {
			try {
				const result = await chooseCompanion(selected);
				if (!result.ok) {
					setError(result.error);
					return;
				}
				router.push(onboarding ? "/learn" : "/profile");
				router.refresh();
			} catch {
				setError("선택을 저장하지 못했어요. 다시 시도해 주세요.");
			}
		});
	}

	return (
		<div
			role={onboarding ? "main" : undefined}
			data-companion={selected ?? "quokka"}
			className={cn(
				"companion-chooser mx-auto w-full max-w-[1000px] [word-break:keep-all]",
				onboarding && "min-h-dvh px-5 py-8 sm:px-8 sm:py-12",
			)}
		>
			<header className="mb-8">
				{onboarding
					? (
						<p className="mb-8 text-2xl font-black tracking-tight text-[#613c27]">
							soling
						</p>
					)
					: (
						<Link
							href="/profile"
							className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold"
						>
							<ArrowLeft size={18} />프로필로
						</Link>
					)}
				<p className="mb-2 text-sm font-bold text-[var(--companion-ink)]">
					{onboarding ? "우리의 첫 만남" : "나의 학습 친구"}
				</p>
				<h1 className="text-2xl font-black tracking-tight sm:text-4xl">
					누구와 함께 배워볼까요?
				</h1>
				<p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
					매일 반겨 주고, 어려운 순간에는 곁에서 응원하는 친구예요.
					친구를 고르면 솔링의 색도 함께 바뀌어요.
				</p>
			</header>
			<fieldset disabled={pending}>
				<legend className="sr-only">함께할 캐릭터</legend>
				<div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
					{COMPANION_IDS.map((id) => {
						const character = COMPANIONS[id];
						const chosen = selected === id;
						return (
							<label
								key={id}
								data-companion={id}
								className={cn(
									"companion-option relative flex cursor-pointer items-center gap-4 rounded-3xl border-2 p-4 transition-colors sm:flex-col sm:p-6 sm:text-center",
									chosen
										? "border-[var(--companion-primary)] bg-[var(--companion-soft)]"
										: "border-border bg-white",
									pending && "cursor-wait",
								)}
							>
								<input
									type="radio"
									name="companion"
									value={id}
									checked={chosen}
									onChange={() => setSelected(id)}
									className="peer sr-only"
								/>
								<span className="pointer-events-none absolute inset-[-5px] rounded-[28px] peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--companion-ink)]" />
								<span
									className={cn(
										"absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border-2",
										chosen
											? "border-[var(--companion-primary)] bg-[var(--companion-primary)] text-white"
											: "border-border",
									)}
								>
									{chosen && (
										<Check
											size={15}
											strokeWidth={3}
											aria-hidden
										/>
									)}
								</span>
								<Mascot
									character={id}
									pose={chosen ? "wave" : "idle"}
									className="h-24 w-28 shrink-0 sm:h-40 sm:w-44"
								/>
								<span className="min-w-0 pr-5 sm:pr-0">
									<span className="block text-xs font-bold text-[var(--companion-ink)]">
										{character.animal} · {character.theme}
									</span>
									<span className="mt-1 block text-xl font-black">
										{character.name}
									</span>
									<span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
										{character.personality}
									</span>
								</span>
							</label>
						);
					})}
				</div>
			</fieldset>
			<div
				className="mt-6 rounded-2xl bg-[var(--companion-soft)] px-5 py-4 text-sm leading-relaxed text-[var(--companion-ink)] sm:text-center"
				aria-live="polite"
			>
				{friend
					? (
						<>
							<strong>{friend.name}</strong>
							<span className="mx-2" aria-hidden>·</span>
							{friend.hello}
						</>
					)
					: "마음이 가는 친구를 골라 보세요."}
			</div>
			<div className="mt-6 flex flex-col items-center gap-3">
				{error && (
					<p
						role="alert"
						className="text-sm font-bold text-[#a1263d]"
					>
						{error}
					</p>
				)}
				<Button
					disabled={!selected || pending}
					onClick={confirm}
					variant="secondary"
					size="lg"
					className="w-full sm:w-auto sm:min-w-72"
				>
					{pending
						? "함께할 준비 중…"
						: friend
						? `${friend.name}와 함께하기`
						: "친구를 선택해 주세요"}
				</Button>
				<p className="text-xs leading-relaxed text-muted-foreground">
					나중에 프로필에서 친구를 바꿀 수 있어요. 학습 기록은 그대로
					유지돼요.
				</p>
			</div>
		</div>
	);
}
