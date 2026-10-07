"use client";

import { useState, useTransition } from "react";

import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	createCoupleAction,
	joinCoupleAction,
	leaveCoupleAction,
} from "@/actions/streak";

type Couple = {
	code: string;
	partner: { id: string; name: string; image: string } | null;
	partnerTodayDone: boolean;
} | null;

export const CoupleCard = ({ couple }: { couple: Couple }) => {
	const [pending, start] = useTransition();
	const [code, setCode] = useState("");

	if (couple?.partner) {
		return (
			<div className="w-full game-panel p-5 sm:p-6">
				<div className="flex flex-wrap items-center gap-4">
					<Image
						src={couple.partner.image}
						alt={couple.partner.name}
						width={44}
						height={44}
						className="flex-none rounded-full border-2 border-slate-200 shadow-inner"
					/>
					<div className="min-w-0 flex-1">
						<div className="truncate text-sm font-bold text-neutral-800 sm:text-base">
							{couple.partner.name}
						</div>
						<div className="mt-0.5 text-sm text-muted-foreground">
							{couple.partnerTodayDone
								? "오늘 출석 완료"
								: "오늘 아직 출석 전"}
						</div>
					</div>
					<Button
						variant="dangerOutline"
						size="sm"
						className="min-h-11 text-sm font-bold"
						disabled={pending}
						onClick={() => {
							if (
								confirm(
									"커플 연결을 끊을까요? 커플 연속 출석 기록이 사라져요.",
								)
							) {
								start(() => leaveCoupleAction());
							}
						}}
					>
						연결 끊기
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="mb-8 flex w-full flex-col gap-3.5 game-panel p-5 sm:p-6">
			<div>
				<div className="text-sm font-bold text-neutral-800 sm:text-base">
					커플 연결하기
				</div>
				<p className="mt-0.5 text-sm text-muted-foreground">
					한 사람이 코드를 만들고, 다른 사람이 그 코드를 입력하면
					연결돼요.
				</p>
			</div>
			{couple
				? (
					<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
						<div className="text-sm font-black tracking-normal text-neutral-500">
							내 초대 코드
						</div>
						<div className="mt-1 font-mono text-2xl font-black tracking-widest break-all text-sky-500 sm:text-3xl">
							{couple.code}
						</div>
						<div className="mt-1 text-sm text-muted-foreground">
							상대가 로그인해서 이 코드를 입력하면 돼요
						</div>
					</div>
				)
				: (
					<Button
						variant="secondary"
						className="h-11 text-sm font-black"
						disabled={pending}
						onClick={() =>
							start(async () => {
								await createCoupleAction();
								toast.success("초대 코드를 만들었어요");
							})}
					>
						내 초대 코드 만들기
					</Button>
				)}
			<div className="flex gap-2">
				<input
					value={code}
					onChange={(e) => setCode(e.target.value.toUpperCase())}
					placeholder="상대의 코드 입력"
					maxLength={6}
					aria-label="상대의 초대 코드"
					autoComplete="off"
					className="h-12 min-w-0 flex-1 rounded-xl border-2 border-slate-200 px-3.5 font-mono text-base uppercase tracking-widest outline-none transition-colors focus:border-sky-400"
				/>
				<Button
					variant="primary"
					className="h-11 px-5 text-sm font-black"
					disabled={pending || code.length < 6}
					onClick={() =>
						start(async () => {
							const r = await joinCoupleAction(code);
							if (r?.error) toast.error(r.error);
							else toast.success("연결됐어요!");
						})}
				>
					연결
				</Button>
			</div>
		</div>
	);
};
