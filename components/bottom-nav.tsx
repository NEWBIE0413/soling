"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandIcon } from "@/components/brand-icon";
import { NAV_ITEMS } from "@/components/navigation";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
	const pathname = usePathname();
	return (
		<nav
			aria-label="주 메뉴"
			className="fixed inset-x-0 bottom-0 z-50 flex border-t-2 border-border bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
		>
			{NAV_ITEMS.map(({ href, label, icon }) => {
				const active = pathname === href ||
					(href === "/learn" &&
						["/courses", "/writing", "/level", "/kana"].some((p) =>
							pathname.startsWith(p)
						));
				return (
					<Link
						key={href}
						href={href}
						aria-current={active ? "page" : undefined}
						className="flex min-h-[72px] min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-2"
					>
						<span
							className={cn(
								"flex h-10 w-12 items-center justify-center rounded-xl transition-[background-color,transform] duration-100 active:scale-95 motion-reduce:active:scale-100",
								active && "bg-[var(--game-green-soft)]",
							)}
						>
							<BrandIcon
								name={icon}
								className={cn(
									"h-8 w-8",
									!active && "opacity-65",
								)}
							/>
						</span>
						<span
							className={cn(
								"text-[10px] font-bold sm:text-xs",
								active
									? "text-[var(--game-green-ink)]"
									: "text-muted-foreground",
							)}
						>
							{label}
						</span>
					</Link>
				);
			})}
		</nav>
	);
};
