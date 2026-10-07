"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";

// Avatar + name + sign out; replaces Clerk's <UserButton />.
export const UserButton = ({ compact }: { compact?: boolean }) => {
	const router = useRouter();
	const { data, isPending } = useSession();
	if (isPending || !data) return null;
	const u = data.user;
	return (
		<div className="flex min-w-0 items-center gap-x-2">
			<Image
				src={u.image || "/mascot.svg"}
				alt={u.name}
				width={32}
				height={32}
				className="rounded-full border-2 border-slate-200"
			/>
			{!compact && (
				<span
					className="min-w-0 flex-1 truncate text-sm font-bold text-foreground"
					title={u.name}
				>
					{u.name}
				</span>
			)}
			<Button
				size="icon"
				variant="ghost"
				aria-label="로그아웃"
				title="로그아웃"
				onClick={async () => {
					await signOut();
					router.push("/");
					router.refresh();
				}}
			>
				<LogOut className="h-5 w-5" />
			</Button>
		</div>
	);
};
