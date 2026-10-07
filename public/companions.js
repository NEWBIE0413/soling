/** @typedef {'quokka' | 'seal' | 'bunny'} CompanionId */

/** @type {readonly CompanionId[]} */
export const COMPANION_IDS = ["quokka", "seal", "bunny"];

export const COMPANIONS = {
	quokka: {
		name: "모카",
		animal: "쿼카",
		theme: "따뜻한 갈색",
		personality: "작은 시도도 놓치지 않는 다정한 친구",
		hello: "반가워! 나는 모카야. 한 걸음씩 같이 가 보자.",
		welcome: "오늘도 와 줬구나. 우리, 조금만 같이 해 볼까?",
		correct: "차곡차곡 쌓이고 있어. 잘했어!",
		encourage: "괜찮아. 틀린 것도 배움이니까, 같이 다시 보자.",
		complete: "끝까지 해냈네! 오늘의 한 걸음, 내가 기억할게.",
		feedback: "첨삭이 도착했어. 잘한 점부터 같이 살펴보자.",
	},
	seal: {
		name: "루미",
		animal: "물범",
		theme: "차분한 파란색",
		personality: "복잡한 것도 차분하게 함께 풀어 가는 친구",
		hello: "안녕, 나는 루미야. 서두르지 말고 하나씩 알아가자.",
		welcome: "준비됐어? 오늘 배울 것도 천천히 풀어 보자.",
		correct: "정확해! 방금 배운 내용을 잘 연결했어.",
		encourage: "잠깐, 함께 살펴보자. 다음에는 더 잘 보일 거야.",
		complete: "오늘 배운 만큼 한 뼘 자랐어. 수고했어!",
		feedback: "첨삭을 하나씩 살펴볼까? 다음 글의 실마리가 있을 거야.",
	},
	bunny: {
		name: "보니",
		animal: "토끼",
		theme: "포근한 보라색",
		personality: "새로운 표현을 발견하는 일이 즐거운 친구",
		hello: "나는 보니야! 우리만의 새로운 표현을 찾아볼까?",
		welcome: "오늘은 어떤 표현을 만나게 될까? 같이 찾아보자!",
		correct: "찾았다! 이제 이 표현도 네 것이야.",
		encourage: "새로운 힌트를 찾았네. 한 번 더 도전해 볼까?",
		complete: "오늘의 발견, 정말 멋졌어! 다음에도 같이 가자.",
		feedback: "새로운 표현의 힌트가 왔어. 첨삭을 함께 읽어 보자!",
	},
};

/** @param {unknown} value @returns {value is CompanionId} */
export function isCompanion(value) {
	return value === "quokka" || value === "seal" || value === "bunny";
}
