import Link from "next/link";

import { UserButton } from "@/components/auth/user-button";
import { Mascot } from "@/components/mascot";
import { NAV_ITEMS } from "@/components/navigation";
import { cn } from "@/lib/utils";
import { getUserProgress } from "@/db/queries";

import { SidebarItem } from "./sidebar-item";

export const Sidebar = async ({ className }: { className?: string }) => {
	const progress = await getUserProgress();
	return (
		<aside
			className={cn(
				"fixed inset-y-0 left-0 z-40 flex w-[224px] flex-col border-r-2 border-border bg-white px-4 py-6",
				className,
			)}
		>
			<Link
				href="/learn"
				className="mb-8 flex items-center gap-1 px-2"
				aria-label="솔링 학습 홈"
			>
				<Mascot character="quokka" className="h-14 w-14" />
				<span className="text-[28px] font-black tracking-[-0.04em] text-[#613c27]">
					soling
				</span>
			</Link>
			<nav
				aria-label="주 메뉴"
				className="min-h-0 flex-1 space-y-2 overflow-y-auto"
			>
				{NAV_ITEMS.map((item) => (
					<SidebarItem key={item.href} {...item} />
				))}
			</nav>
			<div className="mt-6 border-t border-border px-2 pt-5">
				<UserButton imageSrc={progress?.userImageSrc} />
			</div>
		</aside>
	);
};
