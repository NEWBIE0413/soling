import { CompanionChooser } from "@/components/companion-chooser";
import { getUserProgress } from "@/db/queries";
import { auth } from "@/lib/session";
import { isCompanion } from "@/public/companions";

export default async function CompanionPage() {
	await auth.protect();
	const progress = await getUserProgress();
	const choice = progress?.equipped?.companion;
	return (
		<CompanionChooser
			initialChoice={isCompanion(choice) ? choice : undefined}
		/>
	);
}
