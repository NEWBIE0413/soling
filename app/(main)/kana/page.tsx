import { auth } from "@/lib/session";
import { KanaHome } from "../learn/kana-home";

// The Solingo engine (public/kana) runs inside the platform shell. Same origin, so the
// session cookie reaches /api/kana/state and progress belongs to the account.
const KanaPage = async () => {
	await auth.protect();
	return <KanaHome />;
};

export default KanaPage;
