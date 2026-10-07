import { redirect } from "next/navigation";

import { auth } from "@/lib/session";

export default async function HomePage() {
	const { userId } = await auth();
	redirect(userId ? "/learn" : "/sign-in");
}
