import type { BrandIconName } from "@/components/brand-icon";

export const NAV_ITEMS = [
	{ href: "/learn", label: "학습", icon: "learn" },
	{ href: "/leaderboard", label: "리더보드", icon: "trophy" },
	{ href: "/quests", label: "퀘스트", icon: "quests" },
	{ href: "/shop", label: "상점", icon: "shop" },
	{ href: "/streak", label: "출석", icon: "streak" },
	{ href: "/profile", label: "프로필", icon: "profile" },
] as const satisfies readonly {
	href: string;
	label: string;
	icon: BrandIconName;
}[];
