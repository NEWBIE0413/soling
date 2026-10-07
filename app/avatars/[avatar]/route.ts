import { companionAvatarSvg } from "@/lib/avatars";
import { COMPANION_IDS } from "@/public/companions";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
	return COMPANION_IDS.map((id) => ({ avatar: `${id}.svg` }));
}

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ avatar: string }> },
) {
	const { avatar } = await params;
	const character = COMPANION_IDS.find((id) => `${id}.svg` === avatar);
	if (!character) return new Response("Not found", { status: 404 });
	return new Response(companionAvatarSvg(character), {
		headers: {
			"Content-Type": "image/svg+xml",
			"Cache-Control": "public, max-age=86400",
		},
	});
}
