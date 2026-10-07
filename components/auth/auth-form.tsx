"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Mascot } from "@/components/mascot";
import { Button } from "@/components/ui/button";
import { signIn, signUp } from "@/lib/auth-client";

export const AuthForm = ({ mode }: { mode: "sign-in" | "sign-up" }) => {
	const router = useRouter();
	const params = useSearchParams();
	const next = params.get("next") || "/learn";
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const signingUp = mode === "sign-up";
	const submit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const email = String(data.get("email") ?? "").trim();
		const password = String(data.get("password") ?? "");
		const name = String(data.get("name") ?? "").trim();
		setPending(true);
		setError(null);
		try {
			const response = signingUp
				? await signUp.email({
					email,
					password,
					name: name || email.split("@")[0],
				})
				: await signIn.email({ email, password });
			if (response.error) {
				setError(
					response.error.message ??
						"로그인하지 못했어요. 입력 내용을 확인해 주세요.",
				);
			} else {
				router.push(next);
				router.refresh();
			}
		} catch {
			setError("연결하지 못했어요. 잠시 후 다시 시도해 주세요.");
		} finally {
			setPending(false);
		}
	};
	const field =
		"mt-2 min-h-12 w-full rounded-2xl border-2 border-border bg-muted px-4 py-3 text-base focus-visible:outline-sky-600";
	return (
		<div className="mx-auto grid w-full max-w-[900px] items-center gap-8 px-5 py-8 md:grid-cols-2 md:gap-16 md:py-16">
			<div className="text-center">
				<Mascot
					pose="wave"
					className="mx-auto h-36 w-40 md:h-64 md:w-72"
				/>
				<h1 className="mt-4 text-3xl font-black leading-tight tracking-tight">
					{signingUp
						? "새로운 언어, 새로운 나"
						: "다시 만나서 반가워요!"}
				</h1>
				<p className="mx-auto mt-3 max-w-72 text-base leading-relaxed text-muted-foreground">
					{signingUp
						? "하루 한 걸음. 함께라면 계속할 수 있어요."
						: "지난번에 배우던 곳에서 이어가 볼까요?"}
				</p>
			</div>
			<form
				onSubmit={submit}
				className="game-panel flex w-full flex-col gap-4 sm:p-8"
				aria-label={signingUp ? "계정 만들기" : "로그인"}
			>
				<h2 className="mb-1 text-xl font-extrabold">
					{signingUp ? "계정 만들기" : "로그인"}
				</h2>
				{signingUp && (
					<label className="text-sm font-bold">
						이름<input
							name="name"
							required
							className={field}
							autoComplete="name"
							placeholder="어떻게 불러드릴까요?"
						/>
					</label>
				)}
				<label className="text-sm font-bold">
					이메일<input
						name="email"
						type="email"
						required
						className={field}
						autoComplete="email"
						autoCapitalize="none"
						placeholder="name@example.com"
					/>
				</label>
				<label className="text-sm font-bold">
					비밀번호<input
						name="password"
						type="password"
						required
						minLength={6}
						className={field}
						autoComplete={signingUp
							? "new-password"
							: "current-password"}
						placeholder="6자 이상 입력해 주세요"
					/>
				</label>
				{error && (
					<p
						role="alert"
						className="rounded-xl bg-[#fff0f1] p-3 text-sm text-[#a1263d]"
					>
						{error}
					</p>
				)}
				<Button
					type="submit"
					size="lg"
					variant="secondary"
					disabled={pending}
					className="mt-2 w-full"
				>
					{pending
						? "연결 중…"
						: signingUp
						? "학습 시작하기"
						: "이어서 학습하기"}
				</Button>
				<p className="mt-3 text-center text-sm text-muted-foreground">
					{signingUp
						? "이미 계정이 있나요?"
						: "Solingo가 처음인가요?"}{" "}
					<Link
						href={signingUp ? "/sign-in" : "/sign-up"}
						className="inline-flex min-h-11 items-center font-extrabold text-[#087bb8]"
					>
						{signingUp ? "로그인" : "계정 만들기"}
					</Link>
				</p>
			</form>
		</div>
	);
};
