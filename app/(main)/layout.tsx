import type { PropsWithChildren } from "react";

import { BottomNav } from "@/components/bottom-nav";
import { MobileHeader } from "@/components/mobile-header";
import { Sidebar } from "@/components/sidebar";

export default function MainLayout({ children }: PropsWithChildren) {
	return (
		<>
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-white focus:p-4"
			>
				본문으로 이동
			</a>
			<MobileHeader />
			<Sidebar className="hidden lg:flex" />
			<main
				id="main-content"
				className="min-h-dvh pb-[calc(88px+env(safe-area-inset-bottom))] pt-[calc(64px+env(safe-area-inset-top))] lg:pb-0 lg:pl-[224px] lg:pt-0"
			>
				<div className="mx-auto w-full max-w-[1200px] px-5 py-6 lg:px-8 lg:py-10">
					{children}
				</div>
			</main>
			<BottomNav />
		</>
	);
}
