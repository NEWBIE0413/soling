import { companionAvatarSvg } from "@/lib/avatars";

export const size = { width: 180, height: 180 };
export const contentType = "image/svg+xml";

export default function Icon() {
	return new Response(companionAvatarSvg("quokka"), {
		headers: { "Content-Type": contentType },
	});
}
