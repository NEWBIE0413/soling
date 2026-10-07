"use server";

import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import db from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { currentUser } from "@/lib/session";
import { isCompanion } from "@/public/companions";

export async function chooseCompanion(
	value: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
	if (!isCompanion(value)) {
		return { ok: false, error: "함께할 친구를 선택해 주세요." };
	}
	const user = await currentUser();
	if (!user) return { ok: false, error: "다시 로그인한 뒤 선택해 주세요." };

	await db.insert(userProgress).values({
		userId: user.id,
		userName: user.name || "학습자",
		userImageSrc: user.image || "/mascot.svg",
		equipped: { companion: value },
	}).onConflictDoUpdate({
		target: userProgress.userId,
		// Update only this preference; concurrent rewards and cosmetic slots stay intact.
		set: {
			equipped:
				sql`coalesce(${userProgress.equipped}, '{}'::jsonb) || jsonb_build_object('companion', ${value}::text)`,
		},
	});
	revalidatePath("/", "layout");
	return { ok: true };
}
