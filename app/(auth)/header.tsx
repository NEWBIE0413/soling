import Link from "next/link";

import { Mascot } from "@/components/mascot";

export const Header = () => (
	<header className="w-full px-5 pt-[env(safe-area-inset-top)]">
		<div className="mx-auto flex h-20 max-w-[1080px] items-center">
			<Link
				href="/"
				aria-label="Solingo 홈"
				className="flex items-center gap-1"
			>
				<Mascot className="h-12 w-12" />
				<span className="text-2xl font-black tracking-[-.04em] text-[#409309]">
					solingo
				</span>
			</Link>
		</div>
	</header>
);
