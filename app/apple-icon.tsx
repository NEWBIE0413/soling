import { ImageResponse } from "next/og";
import { companionAvatarSvg } from "@/lib/avatars";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
	const image = `data:image/svg+xml;base64,${
		Buffer.from(companionAvatarSvg("quokka")).toString("base64")
	}`;
	return new ImageResponse(
		<div
			style={{
				display: "flex",
				width: "100%",
				height: "100%",
				background: "#faf0e6",
				backgroundImage: `url("${image}")`,
				backgroundSize: "100% 100%",
			}}
		/>,
		size,
	);
}
