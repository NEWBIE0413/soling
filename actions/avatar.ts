"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import db from "@/db/drizzle";
import { user, userProgress } from "@/db/schema";
import { AVATARS } from "@/lib/avatars";
import { currentUser } from "@/lib/session";
import { isCompanion } from "@/public/companions";

export async function chooseAvatar(value: unknown): Promise<
	{ ok: true; image: string } | { ok: false; error: string }
> {
	if (!isCompanion(value)) {
		return { ok: false, error: "프로필 이미지를 선택해 주세요." };
	}
	const viewer = await currentUser();
	if (!viewer) return { ok: false, error: "다시 로그인한 뒤 선택해 주세요." };
	const image = AVATARS[value];
	await db.transaction(async (tx) => {
		await tx.update(user).set({ image, updatedAt: new Date() }).where(
			eq(user.id, viewer.id),
		);
		await tx.insert(userProgress).values({
			userId: viewer.id,
			userName: viewer.name || "학습자",
			userImageSrc: image,
		}).onConflictDoUpdate({
			target: userProgress.userId,
			set: { userImageSrc: image },
		});
	});
	revalidatePath("/", "layout");
	return { ok: true, image };
}
