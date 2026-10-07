import { companionArt } from "@/public/companion-art";
import type { CompanionId } from "@/public/companions";

export const AVATARS: Record<CompanionId, string> = {
	quokka: "/avatars/quokka.svg",
	seal: "/avatars/seal.svg",
	bunny: "/avatars/bunny.svg",
};

export function profileImage(src: string | null | undefined) {
	return !src || src === "/mascot.svg" ? AVATARS.quokka : src;
}

export function companionAvatarSvg(character: CompanionId) {
	const background =
		{ quokka: "#faf0e6", seal: "#edf4fb", bunny: "#f4effa" }[character];
	return `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="30 0 180 180">
    <defs><clipPath id="portrait"><circle cx="120" cy="90" r="90"/></clipPath></defs>
    <g clip-path="url(#portrait)">
      <circle cx="120" cy="90" r="90" fill="${background}"/>
      ${companionArt(character, "idle")}
    </g>
  </svg>`;
}
