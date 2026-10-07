"use client";

import { useState, useTransition } from "react";

import Image from "next/image";
import { BrandIcon } from "@/components/brand-icon";
import { toast } from "sonner";

import { buyItemAction } from "@/actions/economy";
import { Button } from "@/components/ui/button";
import { useCelebrate } from "@/store/use-celebrate";
import { SHOP_ITEMS, type ShopItem } from "@/lib/economy-defs";
import { cn } from "@/lib/utils";

type Owned = Record<string, number>;

const KIND_LABEL: Record<string, string> = {
	consumable: "소모품",
	frame: "아바타 테두리",
	title: "칭호",
	mascot: "마스코트 스킨",
	gift: "선물",
};

export const Items = ({
	gems,
	owned,
	hasActiveSubscription,
	partner,
}: {
	gems: number;
	owned: Owned;
	hasActiveSubscription: boolean;
	partner: { name: string; freezes: number } | null; // linked couple: the gift goes to them
}) => {
	const [partnerFreezes, setPartnerFreezes] = useState(partner?.freezes ?? 0);
	const [pending, startTransition] = useTransition();
	const [ownedQty, setOwnedQty] = useState<Owned>(owned);
	const [busy, setBusy] = useState<string | null>(null);
	const celebrate = useCelebrate((s) => s.fire);

	const onBuy = (key: string) => {
		if (pending) return;
		setBusy(key);
		startTransition(() => {
			buyItemAction(key)
				.then((r) => {
					if (r.ok) {
						const item = SHOP_ITEMS.find((i) => i.key === key);
						const qty = ("qty" in r && r.qty) || 1;
						if (item?.kind === "gift") setPartnerFreezes(qty);
						else setOwnedQty((prev) => ({ ...prev, [key]: qty }));
						celebrate({
							kind: "purchase",
							title: item?.name ?? "구매 완료",
							subtitle: item?.kind === "gift"
								? `${
									partner?.name ?? "상대"
								}에게 보호권을 보냈어요`
								: item?.kind === "consumable"
								? "연속 출석을 지켜줄게요"
								: "프로필에서 장착해 보세요",
							image:
								item && item.kind === "mascot" && "icon" in item
									? item.icon
									: undefined,
						});
					} else {
						const msg: Record<string, string> = {
							"not-enough-gems": "젬이 부족해요.",
							"max-qty": "이미 최대 개수를 보유하고 있어요.",
							"already-owned": "이미 보유 중이에요.",
							"partner-max":
								"상대가 이미 보호권을 2개 갖고 있어요.",
							"no-partner":
								"커플로 연결돼 있어야 선물할 수 있어요.",
						};
						toast.error(msg[r.error ?? ""] ?? "문제가 생겼어요.");
					}
				})
				.catch(() => toast.error("문제가 생겼어요."))
				.finally(() => setBusy(null));
		});
	};

	return (
		<ul className="grid w-full gap-4 pb-8">
			{SHOP_ITEMS.filter((item) => item.kind !== "gift" || partner).map(
				(item) => {
					const qty = ownedQty[item.key] ?? owned[item.key] ?? 0;
					const isOwned = item.kind !== "consumable" &&
						item.kind !== "gift" && qty > 0;
					const maxed =
						(item.kind === "consumable" && qty >= item.maxQty) ||
						(item.kind === "gift" && partnerFreezes >= 2);
					const canAfford = gems >= item.gems;
					const disabled = pending || busy === item.key || isOwned ||
						maxed || !canAfford;
					return (
						<li
							key={item.key}
							className={cn(
								"game-panel grid w-full grid-cols-[48px_minmax(0,1fr)] items-start gap-4 p-5 sm:grid-cols-[48px_minmax(0,1fr)_auto] sm:p-6",
								isOwned
									? "border-slate-200 bg-slate-50/50"
									: "border-slate-200 bg-white",
							)}
						>
							<ItemIcon item={item} />
							<div className="min-w-0 flex-1">
								<div className="flex flex-wrap items-center gap-2">
									<p className="break-words text-base font-extrabold text-neutral-800 sm:text-base">
										{item.name}
									</p>
									<span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-sm font-bold text-neutral-500">
										{KIND_LABEL[item.kind]}
									</span>
								</div>
								<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
									{("desc" in item ? item.desc : undefined) ??
										KIND_LABEL[item.kind]}
								</p>
								{item.kind === "consumable" && qty > 0 && (
									<span className="mt-1 inline-block text-sm font-bold text-sky-700">
										현재 {qty}개 보유
									</span>
								)}
								{item.kind === "gift" && partner && (
									<span className="mt-1 inline-block text-sm font-bold text-rose-500">
										{partner.name} 보유 {partnerFreezes}/2
									</span>
								)}
							</div>
							<Button
								size="sm"
								onClick={() => onBuy(item.key)}
								disabled={disabled}
								variant={isOwned
									? "ghost"
									: maxed
									? "locked"
									: canAfford
									? "default"
									: "locked"}
								className={cn(
									"col-span-2 min-h-11 w-full text-sm font-black sm:col-span-1 sm:w-auto",
									isOwned &&
										"font-bold text-muted-foreground",
									!isOwned &&
										!maxed &&
										canAfford &&
										"hover:border-sky-300 hover:bg-sky-50",
								)}
							>
								{isOwned
									? (
										"보유 중"
									)
									: maxed
									? (
										"최대"
									)
									: (
										<span className="flex items-center gap-1">
											<BrandIcon
												name="gem"
												className="h-5 w-5"
											/>
											<span className="sr-only">젬</span>
											<span>{item.gems}</span>
										</span>
									)}
							</Button>
						</li>
					);
				},
			)}
			{hasActiveSubscription && (
				<li className="game-panel flex w-full flex-wrap items-center gap-4 bg-muted p-5 sm:p-6">
					<div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl border border-indigo-100 bg-white p-1 shadow-inner">
						<Image
							src="/unlimited.svg"
							alt="무제한 하트"
							height={36}
							width={36}
							className="object-contain"
						/>
					</div>
					<div className="min-w-0 flex-1">
						<p className="text-sm font-bold text-neutral-800 sm:text-base">
							무제한 하트
						</p>
						<p className="mt-0.5 text-sm font-medium text-indigo-700/80">
							슈퍼 요금제에 포함돼 있어요
						</p>
					</div>
					<Button
						size="sm"
						disabled
						variant="super"
						className="min-h-11 text-sm font-black"
					>
						이용 중
					</Button>
				</li>
			)}
		</ul>
	);
};

const ItemIcon = ({ item }: { item: ShopItem }) => {
	const icon = "icon" in item ? item.icon : undefined;
	if (icon && (item.kind === "mascot" || item.kind === "frame")) {
		return (
			<div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-1 shadow-inner">
				<Image
					src={icon}
					alt={item.name}
					height={40}
					width={40}
					className="object-contain"
				/>
			</div>
		);
	}
	if (item.kind === "title") {
		return (
			<div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 text-2xl shadow-inner">
				<BrandIcon name="star" className="h-10 w-10" />
			</div>
		);
	}
	return (
		<div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-2xl shadow-inner">
			<BrandIcon
				name={item.kind === "gift" ? "heart" : "streak"}
				className="h-10 w-10"
			/>
		</div>
	);
};
