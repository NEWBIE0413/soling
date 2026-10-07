import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";

import { Celebrate } from "@/components/celebrate";
import { ExitModal } from "@/components/modals/exit-modal";
import { HeartsModal } from "@/components/modals/hearts-modal";
import { PracticeModal } from "@/components/modals/practice-modal";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config";

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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko">
			<body className={font.className}>
				<Toaster theme="light" richColors closeButton />
				<Celebrate />
				<ExitModal />
				<HeartsModal />
				<PracticeModal />
				{children}
			</body>
		</html>
	);
}
