"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandIcon, type BrandIconName } from "@/components/brand-icon";
import { Button } from "@/components/ui/button";

export const SidebarItem = (
	{ label, icon, href }: { label: string; icon: BrandIconName; href: string },
) => {
	const pathname = usePathname();
	const active = pathname === href ||
		(href === "/learn" &&
			["/courses", "/writing", "/level", "/kana"].some((p) =>
				pathname.startsWith(p)
			));
	return (
		<Button
			variant={active ? "sidebarOutline" : "sidebar"}
			className="h-16 w-full justify-start gap-4 px-4"
			asChild
		>
			<Link href={href} aria-current={active ? "page" : undefined}>
				<BrandIcon name={icon} className="h-9 w-9 shrink-0" />
				<span className="game-nav-label">{label}</span>
			</Link>
		</Button>
	);
};
