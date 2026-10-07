import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"game-button inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-extrabold tracking-normal focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-sky-600 focus-visible:ring-offset-4",
	{
		variants: {
			variant: {
				default: "",
				locked: "pointer-events-none !bg-[#edf0e9] !text-[#6c7665]",
				primary: "game-button-blue",
				primaryOutline: "game-button-quiet text-sky-700",
				secondary: "game-button-green",
				secondaryOutline: "game-button-quiet text-green-700",
				danger: "game-button-red",
				dangerOutline: "game-button-quiet text-rose-700",
				super: "game-button-purple",
				superOutline: "game-button-quiet text-violet-700",
				ghost: "game-button-quiet",
				sidebar: "game-button-quiet",
				sidebarOutline: "game-button-quiet game-nav-active",
			},
			size: {
				default: "min-h-12 px-5 py-2",
				sm: "min-h-11 px-4 py-2",
				lg: "min-h-14 px-8 py-3 text-base",
				icon: "h-11 w-11",
				rounded: "rounded-full",
			},
		},
		defaultVariants: { variant: "default", size: "default" },
	},
);

export interface ButtonProps
	extends
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
