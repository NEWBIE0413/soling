"use client";

import { useState, useTransition } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandIcon } from "@/components/brand-icon";
import { PageHeader } from "@/components/page-header";
import { Mascot } from "@/components/mascot";
import { useCompanion } from "@/components/companion-provider";
import { AvatarPicker } from "@/components/avatar-picker";
import { profileImage } from "@/lib/avatars";
import { toast } from "sonner";

import { equipItemAction, updateUserNameAction } from "@/actions/economy";
import { Button } from "@/components/ui/button";
import type { AchievementView } from "@/lib/achievements-defs";
import { shopItem } from "@/lib/economy-defs";
import { cn } from "@/lib/utils";

import { LevelView } from "../level/level-view";

type Report = Parameters<typeof LevelView>[0]["report"];

export const ProfileView = ({
	selfUserId,
	targetUserId,
	targetName,
	imageSrc,
	points,
	gems,
	equipped: initialEquipped,
	owned,
	streak,
	couple,
	isAdmin,
	report,
	users,
	createdLabel,
	completedLessons,
	achievements,
}: {
	selfUserId: string;
	targetUserId: string;
	targetName: string;
	imageSrc: string;
	points: number;
	gems: number;
	equipped: { frame?: string; title?: string; mascot?: string };
	owned: Record<string, number>;
	streak: { current: number; longest: number; todayDone: boolean };
	couple: {
		partner?: { name: string; image: string } | null;
		partnerTodayDone?: boolean;
	} | null;
	isAdmin: boolean;
	report: NonNullable<Parameters<typeof LevelView>[0]["report"]> | null;
	users: { userId: string; userName: string; points: number }[];
	createdLabel: string;
	completedLessons: number;
	achievements: AchievementView[];
}) => {
	const router = useRouter();
	const [pending, startTransition] = useTransition();
	const [equipped, setEquipped] = useState(initialEquipped);
	const [name, setName] = useState(targetName);
	const [avatar, setAvatar] = useState(imageSrc);
	const isSelf = targetUserId === selfUserId;
	const companion = useCompanion();

	const equip = (slot: "frame" | "title" | "mascot", key: string | null) => {
		if (!isSelf || pending) return;
		startTransition(() => {
			equipItemAction(slot, key)
				.then((r) => {
					if (r.ok) {
						setEquipped((prev) => ({
							...prev,
							[slot]: key ?? undefined,
						}));
						toast.success("장착했어요!");
					} else toast.error("장착에 문제가 생겼어요.");
				})
				.catch(() => toast.error("장착에 문제가 생겼어요."));
		});
	};

	const equippedTitle = equipped.title
		? shopItem(equipped.title)?.name
		: null;

	return (
		<div className="flex w-full min-w-0 flex-col items-stretch pb-8">
			<PageHeader
				title="프로필"
				description={isAdmin && !isSelf
					? `${targetName}의 학습 기록`
					: "내가 쌓은 노력과 나만의 모습을 한눈에."}
				icon="profile"
			/>

			{/* the things a phone can't reach from the tabs: rank, shop, the level-test report */}
			<div className="mb-4 grid w-full grid-cols-3 gap-2 sm:gap-3">
				<Link
					href="/leaderboard"
					prefetch
					className="flex h-11 items-center justify-center gap-1.5 rounded-2xl border-2 border-b-4 border-amber-200 bg-amber-50 text-sm font-black text-amber-700 transition-transform active:translate-y-0.5 motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				>
					<BrandIcon name="trophy" className="h-6 w-6" /> 순위
				</Link>
				<Link
					href="/shop"
					prefetch
					className="flex h-11 items-center justify-center gap-1.5 rounded-2xl border-2 border-b-4 border-sky-200 bg-sky-50 text-sm font-black text-sky-700 transition-transform active:translate-y-0.5 motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				>
					<BrandIcon name="shop" className="h-6 w-6" /> 상점
				</Link>
				<Link
					href={isSelf ? "/level" : `/level?user=${targetUserId}`}
					prefetch
					className="flex h-11 items-center justify-center gap-1.5 rounded-2xl border-2 border-b-4 border-violet-200 bg-violet-50 text-sm font-black text-violet-700 transition-transform active:translate-y-0.5 motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				>
					<BrandIcon name="practice" className="h-6 w-6" /> 시험 결과
				</Link>
			</div>

			<div className="game-panel flex w-full flex-col items-center gap-2 p-6 sm:p-8">
				<AvatarFrame frame={equipped.frame}>
					<Image
						src={profileImage(isSelf ? avatar : imageSrc)}
						alt={targetName}
						className="rounded-full"
						height={68}
						width={68}
					/>
				</AvatarFrame>
				{isSelf
					? (
						<input
							value={name}
							onChange={(e) => setName(e.target.value)}
							onBlur={() => {
								if (name.trim() && name !== targetName) {
									void saveName(name.trim());
								}
							}}
							className="mt-2.5 w-full max-w-[12rem] rounded-lg border-2 border-transparent bg-transparent text-center text-lg font-black text-neutral-800 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
							aria-label="이름"
						/>
					)
					: (
						<p className="mt-2 text-lg font-black text-neutral-800">
							{targetName}
						</p>
					)}
				{equippedTitle && (
					<p className="mt-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-0.5 text-sm font-black text-amber-700">
						{equippedTitle}
					</p>
				)}
				{isSelf && <AvatarPicker image={avatar} onSaved={setAvatar} />}
			</div>

			{isSelf && (
				<section className="mt-4 flex items-center gap-3 rounded-2xl bg-[var(--companion-soft)] p-4 sm:gap-5">
					<Mascot pose="wave" className="h-20 w-24 shrink-0" />
					<div className="min-w-0 flex-1">
						<p className="text-xs font-bold text-[var(--companion-ink)]">
							나의 학습 친구
						</p>
						<h2 className="mt-1 text-lg font-extrabold">
							{companion.name}와 함께
						</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							{companion.theme}
						</p>
					</div>
					<Button asChild variant="ghost" size="sm">
						<Link href="/companion">친구 변경</Link>
					</Button>
				</section>
			)}
			<div className="mt-4 grid w-full grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
				<Stat label="XP" value={points} />
				<Stat label="젬" value={gems} />
				<Stat
					label="연속 출석"
					value={`${streak.current}일`}
					sub={`최고 ${streak.longest}일`}
				/>
				<Stat label="완료 문항" value={completedLessons} />
				<Stat label="가입일" value={createdLabel} />
			</div>

			<div className="mt-3.5 w-full game-panel p-5 sm:p-6">
				<div className="mb-3 flex items-baseline justify-between">
					<h2 className="text-xl font-extrabold text-neutral-800">
						업적
					</h2>
					<span className="text-sm font-bold text-muted-foreground">
						{achievements.filter((a) => a.unlocked).length}/
						{achievements.length}
					</span>
				</div>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
					{achievements.map((a) => (
						<div
							key={a.key}
							title={a.desc}
							className={cn(
								"flex min-w-0 flex-col items-center rounded-2xl border border-border p-4 text-center",
								a.unlocked
									? "bg-amber-50"
									: "border-slate-200 bg-slate-50/50",
							)}
						>
							<div
								className={cn(
									"flex h-11 w-11 items-center justify-center rounded-full text-2xl shadow-inner",
									a.unlocked
										? "bg-white"
										: "bg-slate-200 opacity-50 grayscale",
								)}
							>
								<BrandIcon
									name={a.unlocked ? "trophy" : "lock"}
									className="h-10 w-10"
								/>
							</div>
							<div
								className={cn(
									"mt-3 text-sm font-bold leading-relaxed",
									a.unlocked
										? "text-neutral-800"
										: "text-muted-foreground",
								)}
							>
								{a.name}
							</div>
							{!a.unlocked && (
								<>
									<div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
										<div
											className="h-full rounded-full bg-amber-400"
											style={{
												width: `${
													Math.min(
														100,
														Math.round(
															(100 * a.progress) /
																a.goal,
														),
													)
												}%`,
											}}
										/>
									</div>
									<div className="mt-0.5 text-sm font-semibold text-muted-foreground">
										{a.progress}/{a.goal}
									</div>
								</>
							)}
						</div>
					))}
				</div>
			</div>

			{couple?.partner && (
				<div className="mt-3.5 flex w-full items-center gap-3.5 rounded-2xl border-2 border-rose-200 bg-rose-50/60 p-3.5 shadow-sm sm:p-4">
					<Image
						src={profileImage(couple.partner.image)}
						alt=""
						height={44}
						width={44}
						className="flex-none rounded-full border-2 border-rose-200"
					/>
					<div className="min-w-0 flex-1">
						<p className="truncate text-xl font-extrabold text-neutral-800">
							{couple.partner.name}
						</p>
						<p className="mt-0.5 text-sm text-muted-foreground">
							{couple.partnerTodayDone
								? "오늘 출석 완료"
								: "오늘은 아직이에요"}
						</p>
					</div>
					<BrandIcon name="heart" className="h-10 w-10 shrink-0" />
				</div>
			)}

			{isSelf && (
				<div className="mt-3.5 w-full game-panel p-5 sm:p-6">
					<h2 className="mb-3 text-xl font-extrabold text-neutral-800">
						보유 아이템
					</h2>
					{Object.keys(owned).length === 0
						? (
							<div className="game-empty">
								<BrandIcon
									name="shop"
									className="mx-auto mb-3 h-12 w-12"
								/>
								<p className="text-sm leading-relaxed text-muted-foreground">
									아직 보유 아이템이 없어요. 퀘스트로 젬을
									모아보세요.
								</p>
								<Link
									href="/shop"
									className="mt-3 inline-flex min-h-11 items-center font-bold text-sky-700 underline"
								>
									상점 둘러보기
								</Link>
							</div>
						)
						: (
							<div className="flex flex-wrap gap-2">
								{Object.entries(owned).map(([key, qty]) => {
									const item = shopItem(key);
									if (!item) return null;
									const isEquipped = equipped.frame === key ||
										equipped.title === key ||
										equipped.mascot === key;
									return (
										<Button
											key={key}
											variant={isEquipped
												? "default"
												: "secondary"}
											size="sm"
											className={cn(
												"min-h-11 max-w-full whitespace-normal text-sm font-bold",
												isEquipped &&
													"border-green-500 bg-green-50 text-green-700",
											)}
											disabled={pending}
											onClick={() =>
												equip(
													item.kind === "frame"
														? "frame"
														: item.kind === "title"
														? "title"
														: item.kind === "mascot"
														? "mascot"
														: "frame",
													isEquipped ? null : key,
												)}
										>
											{item.name}
											{item.kind === "consumable"
												? ` ×${qty}`
												: ""}
										</Button>
									);
								})}
							</div>
						)}
				</div>
			)}
		</div>
	);

	function saveName(n: string) {
		startTransition(() => {
			updateUserNameAction(n)
				.then((r) => {
					if (r?.ok) toast.success("이름을 바꿨어요!");
					else toast.error("이름 변경에 문제가 생겼어요.");
				})
				.catch(() => toast.error("이름 변경에 문제가 생겼어요."));
		});
	}
};

function Stat({
	label,
	value,
	sub,
}: {
	label: string;
	value: string | number;
	sub?: string;
}) {
	return (
		<div className="game-panel min-w-0 p-5 text-left">
			<div
				className={cn(
					"font-black tabular-nums text-foreground [word-break:keep-all]",
					typeof value === "string" && value.length > 8
						? "text-base leading-relaxed"
						: "text-2xl",
				)}
			>
				{value}
			</div>
			<div className="mt-2 text-sm font-bold text-muted-foreground">
				{label}
				{sub ? ` · ${sub}` : ""}
			</div>
		</div>
	);
}

function AvatarFrame({
	frame,
	children,
}: {
	frame?: string;
	children: React.ReactNode;
}) {
	const color = frame?.split("_")[1] ?? "";
	const map: Record<string, string> = {
		sky: "#38bdf8",
		rose: "#fb7185",
		gold: "#f59e0b",
	};
	return (
		<div
			className="rounded-full p-1"
			style={frame
				? { border: `4px solid ${map[color] ?? "#38bdf8"}` }
				: undefined}
		>
			{children}
		</div>
	);
}
