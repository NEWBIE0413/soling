"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { chooseAvatar } from "@/actions/avatar";
import { AVATARS, profileImage } from "@/lib/avatars";
import {
	COMPANION_IDS,
	type CompanionId,
	COMPANIONS,
} from "@/public/companions";
import { cn } from "@/lib/utils";

export function AvatarPicker(
	{ image, onSaved }: { image: string; onSaved: (image: string) => void },
) {
	const [pending, startTransition] = useTransition();
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();
	function choose(id: CompanionId) {
		if (pending || profileImage(image) === AVATARS[id]) return;
		setError("");
		setMessage("");
		startTransition(async () => {
			try {
				const result = await chooseAvatar(id);
				if (!result.ok) {
					setError(result.error);
					return;
				}
				onSaved(result.image);
				setMessage("프로필 이미지를 바꿨어요.");
				router.refresh();
			} catch {
				setError("이미지를 저장하지 못했어요. 다시 시도해 주세요.");
			}
		});
	}
	return (
		<fieldset
			className="mt-4 w-full border-t border-border pt-5"
			disabled={pending}
		>
			<legend className="sr-only">프로필 이미지</legend>
			<p className="text-center text-xs font-bold text-muted-foreground">
				나를 보여줄 프로필 이미지
			</p>
			<div className="mt-3 flex justify-center gap-4" aria-busy={pending}>
				{COMPANION_IDS.map((id) => {
					const selected = profileImage(image) === AVATARS[id];
					return (
						<button
							key={id}
							type="button"
							onClick={() => choose(id)}
							aria-pressed={selected}
							aria-label={`${COMPANIONS[id].name} 프로필 선택`}
							className="group flex min-w-16 flex-col items-center gap-2 rounded-2xl p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--companion-ink)] disabled:cursor-wait"
						>
							<span
								className={cn(
									"relative rounded-full border-[3px] p-0.5 transition-colors",
									selected
										? "border-[var(--companion-primary)]"
										: "border-transparent group-hover:border-border",
								)}
							>
								<Image
									src={AVATARS[id]}
									alt=""
									width={56}
									height={56}
									className="rounded-full"
								/>
								{selected && (
									<span className="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-[var(--companion-primary)] p-0.5 text-white">
										<Check
											size={12}
											strokeWidth={3}
											aria-hidden
										/>
									</span>
								)}
							</span>
							<span className="text-xs font-bold">
								{COMPANIONS[id].name}
							</span>
						</button>
					);
				})}
			</div>
			<p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
				학습 친구와 테마는 그대로 유지돼요.
			</p>
			<p
				className="mt-2 text-center text-xs text-[var(--companion-ink)]"
				role="status"
			>
				{pending ? "저장 중…" : message}
			</p>
			{error && (
				<p
					className="mt-2 text-center text-sm text-[#a1263d]"
					role="alert"
				>
					{error}
				</p>
			)}
		</fieldset>
	);
}
