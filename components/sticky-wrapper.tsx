import type { PropsWithChildren } from "react";

export const StickyWrapper = ({ children }: PropsWithChildren) => (
	<aside className="sticky top-8 hidden w-[280px] shrink-0 self-start space-y-5 xl:block">
		{children}
	</aside>
);
