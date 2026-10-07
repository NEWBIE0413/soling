import { PageHeader } from "@/components/page-header";
import { BrandIcon } from "@/components/brand-icon";
import { Mascot } from "@/components/mascot";
import { auth } from "@/lib/session";
import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import db from "@/db/drizzle";
import { userItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { giftTarget } from "@/lib/economy";

import { Items } from "./items";

const ShopPage = async () => {
	const { userId } = await auth.protect().then((s) => ({
		userId: s.user.id,
	}));
	const [userProgress, userSubscription, ownedRows, partner] = await Promise
		.all([
			getUserProgress(),
			getUserSubscription(),
			db.select().from(userItems).where(eq(userItems.userId, userId)),
			giftTarget(userId),
		]);

	if (!userProgress || !userProgress.activeCourse) redirect("/courses");
	const owned = Object.fromEntries(ownedRows.map((r) => [r.itemKey, r.qty]));

	const isPro = !!userSubscription?.isActive;

	return (
		<div className="flex flex-row-reverse gap-8">
			<StickyWrapper>
				<UserProgress
					activeCourse={userProgress.activeCourse}
					hearts={userProgress.hearts}
					points={userProgress.points}
					gems={userProgress.gems}
					hasActiveSubscription={isPro}
				/>
			</StickyWrapper>

			<FeedWrapper>
				<div className="flex w-full flex-col items-center">
					<div className="w-full">
						<PageHeader
							title="상점"
							description="학습으로 모은 젬으로 나만의 아이템을 골라보세요."
							icon="shop"
						/>
					</div>
					<section className="game-panel mb-6 flex w-full flex-wrap items-center gap-5 p-5 sm:p-6">
						<Mascot pose="wave" className="h-24 w-24 shrink-0" />
						<div className="min-w-0 flex-1 basis-48">
							<h2 className="text-xl font-extrabold">
								나의 젬 지갑
							</h2>
							<p className="mt-1 text-sm leading-relaxed text-muted-foreground">
								보유 아이템은 프로필에서 장착할 수 있어요.
							</p>
							<div className="mt-3 flex items-center gap-2 text-xl font-black tabular-nums">
								<BrandIcon name="gem" className="h-7 w-7" />
								{userProgress.gems}{" "}
								<span className="text-sm font-bold text-muted-foreground">
									젬
								</span>
							</div>
						</div>
					</section>

					<Items
						gems={userProgress.gems}
						owned={owned}
						hasActiveSubscription={isPro}
						partner={partner}
					/>
				</div>
			</FeedWrapper>
		</div>
	);
};

export default ShopPage;
