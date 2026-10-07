"use client";

import { createContext, type ReactNode, useContext } from "react";
import { type CompanionId, COMPANIONS } from "@/public/companions";

const CompanionContext = createContext<CompanionId>("quokka");

export function CompanionProvider({
	companion,
	children,
}: {
	companion: CompanionId;
	children: ReactNode;
}) {
	return (
		<CompanionContext.Provider value={companion}>
			{children}
		</CompanionContext.Provider>
	);
}

export function useCompanion() {
	const id = useContext(CompanionContext);
	return { id, ...COMPANIONS[id] };
}
