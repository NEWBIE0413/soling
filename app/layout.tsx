import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";

import { Celebrate } from "@/components/celebrate";
import { ExitModal } from "@/components/modals/exit-modal";
import { HeartsModal } from "@/components/modals/hearts-modal";
import { PracticeModal } from "@/components/modals/practice-modal";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config";
import { CompanionProvider } from "@/components/companion-provider";
import { CompanionChooser } from "@/components/companion-chooser";
import { getUserProgress } from "@/db/queries";
import { currentUser } from "@/lib/session";
import { isCompanion } from "@/public/companions";

import "./globals.css";

const font = Nunito({
	subsets: ["latin"],
	display: "swap",
	fallback: [
		"ui-rounded",
		"Apple SD Gothic Neo",
		"Malgun Gothic",
		"sans-serif",
	],
});

export const viewport: Viewport = {
	themeColor: "#ffffff",
	viewportFit: "cover",
};

export const metadata: Metadata = siteConfig;

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [user, progress] = await Promise.all([
		currentUser(),
		getUserProgress(),
	]);
	const choice = progress?.equipped?.companion;
	const companion = isCompanion(choice) ? choice : null;
	return (
		<html lang="ko" data-companion={companion ?? "quokka"}>
			<body className={font.className}>
				<CompanionProvider companion={companion ?? "quokka"}>
					<Toaster theme="light" richColors closeButton />
					<Celebrate />
					<ExitModal />
					<HeartsModal />
					<PracticeModal />
					{user && !companion
						? <CompanionChooser onboarding />
						: children}
				</CompanionProvider>
			</body>
		</html>
	);
}
