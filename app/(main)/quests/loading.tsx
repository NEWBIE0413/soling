import { Loader } from "lucide-react";

const Loading = () => {
	return (
		<div
			role="status"
			className="game-empty flex min-h-64 w-full flex-col items-center justify-center gap-4"
		>
			<Loader
				aria-hidden="true"
				className="h-6 w-6 animate-spin text-muted-foreground motion-reduce:animate-none"
			/>
			<p className="text-base text-muted-foreground">
				학습 화면을 불러오고 있어요.
			</p>
		</div>
	);
};

export default Loading;
