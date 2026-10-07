import type { PropsWithChildren } from "react";

export default function PracticeLayout({ children }: PropsWithChildren) {
	return <main className="lesson-shell">{children}</main>;
}
