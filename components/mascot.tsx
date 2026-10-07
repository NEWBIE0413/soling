import { cn } from "@/lib/utils";

type MascotProps = {
	readonly pose?: "idle" | "wave" | "celebrate" | "thinking";
	readonly className?: string;
	readonly label?: string;
};

/** Solingo's square face, with separate limbs so a reward is an acted scene. */
export function Mascot({ pose = "idle", className, label }: MascotProps) {
	const happy = pose === "celebrate";
	return (
		<svg
			viewBox="0 0 240 220"
			fill="none"
			role={label ? "img" : undefined}
			aria-label={label}
			aria-hidden={label ? undefined : true}
			className={cn("solingo-mascot", `mascot-${pose}`, className)}
		>
			<ellipse
				className="mascot-ground"
				cx="120"
				cy="205"
				rx="61"
				ry="9"
				fill="#324238"
				opacity=".09"
			/>
			<g className="mascot-character">
				<g className="mascot-foot mascot-foot-left">
					<path
						d="M80 173h23v24c0 7-6 9-15 9H65c-9 0-10-7-4-12l19-10Z"
						fill="#409309"
					/>
					<path d="M80 174h23v15H80Z" fill="#58c900" />
				</g>
				<g className="mascot-foot mascot-foot-right">
					<path
						d="M137 173h23v11l19 10c6 5 5 12-4 12h-23c-9 0-15-2-15-9Z"
						fill="#409309"
					/>
					<path d="M137 174h23v15h-23Z" fill="#58c900" />
				</g>
				<g className="mascot-arm mascot-arm-left">
					<path
						d="M64 103c-20 5-34 16-35 34-1 14 13 20 22 9l21-29Z"
						fill="#409309"
					/>
					<path
						d="M63 100c-19 4-33 14-34 30-1 13 12 19 21 8l20-25Z"
						fill="#58c900"
					/>
					<path
						d="M39 126c3-6 7-10 12-12"
						stroke="#8ee244"
						strokeWidth="6"
						strokeLinecap="round"
					/>
				</g>
				<g className="mascot-arm mascot-arm-right">
					<path
						d="M176 103c20 5 34 16 35 34 1 14-13 20-22 9l-21-29Z"
						fill="#409309"
					/>
					<path
						d="M177 100c19 4 33 14 34 30 1 13-12 19-21 8l-20-25Z"
						fill="#58c900"
					/>
					<path
						d="M201 126c-3-6-7-10-12-12"
						stroke="#8ee244"
						strokeWidth="6"
						strokeLinecap="round"
					/>
				</g>
				<path
					d="M57 63c0-21 12-31 33-31h61c21 0 33 10 33 31v95c0 23-11 34-33 34H90c-22 0-33-11-33-34Z"
					fill="#409309"
				/>
				<path
					d="M55 55c0-21 12-31 33-31h64c21 0 33 10 33 31v95c0 23-11 34-33 34H88c-22 0-33-11-33-34Z"
					fill="#58c900"
				/>
				<path
					d="M70 51c0-10 7-15 20-15h58"
					stroke="#8ee244"
					strokeWidth="9"
					strokeLinecap="round"
				/>
				<path
					d="M99 25c-6-11-1-18 7-12l15 12c-1-16 7-22 12-12l5 12"
					fill="#58c900"
				/>
				<g className="mascot-face">
					<path
						d={pose === "thinking"
							? "M77 65l24-5m38 4 22 5"
							: "M78 64c6-5 14-6 21-3m42 0c7-3 15-2 21 3"}
						stroke="#214708"
						strokeWidth="5"
						strokeLinecap="round"
					/>
					{happy
						? (
							<g className="mascot-happy-eyes">
								<path
									d="M78 93c2-17 22-17 24 0m36 0c2-17 22-17 24 0"
									stroke="white"
									strokeWidth="14"
									strokeLinecap="round"
								/>
								<path
									d="M80 94c3-12 17-12 20 0m40 0c3-12 17-12 20 0"
									stroke="#324238"
									strokeWidth="6"
									strokeLinecap="round"
								/>
							</g>
						)
						: (
							<g className="mascot-eyes">
								<ellipse
									cx="91"
									cy="88"
									rx="18"
									ry="23"
									fill="white"
								/>
								<ellipse
									cx="149"
									cy="88"
									rx="18"
									ry="23"
									fill="white"
								/>
								<ellipse
									cx={pose === "thinking" ? 97 : 95}
									cy="91"
									rx="8"
									ry="12"
									fill="#324238"
								/>
								<ellipse
									cx={pose === "thinking" ? 155 : 153}
									cy="91"
									rx="8"
									ry="12"
									fill="#324238"
								/>
								<circle cx="97" cy="85" r="3" fill="white" />
								<circle cx="155" cy="85" r="3" fill="white" />
							</g>
						)}
					<ellipse cx="73" cy="117" rx="10" ry="6" fill="#8ee244" />
					<ellipse cx="167" cy="117" rx="10" ry="6" fill="#8ee244" />
					{happy
						? (
							<>
								<path
									d="M100 121h40c-1 23-11 30-20 30s-19-7-20-30Z"
									fill="#214708"
								/>
								<path d="M104 122h32v7h-32Z" fill="white" />
								<path
									d="M108 145c4-10 20-10 24 0-7 7-17 7-24 0"
									fill="#ff8f98"
								/>
							</>
						)
						: (
							<path
								d={pose === "thinking"
									? "M111 130c7-3 12-3 18 0"
									: "M107 125c8 9 19 9 27-1"}
								stroke="#214708"
								strokeWidth="5"
								strokeLinecap="round"
							/>
						)}
				</g>
				<path
					d="M106 165h28"
					stroke="#8ee244"
					strokeWidth="6"
					strokeLinecap="round"
				/>
			</g>
		</svg>
	);
}
