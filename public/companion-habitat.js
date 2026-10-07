/**
 * Original little environments; fixed compositions keep motion away from copy.
 * @param {'quokka'|'seal'|'bunny'} character
 */
export function habitatMarkup(character) {
	let scene;
	if (character === "seal") {
		scene = `
      <path d="M28 160C28 74 75 28 152 28s120 49 120 130v57H28Z" fill="#edf5f8"/>
      <circle cx="224" cy="65" r="21" fill="#f9f2d9"/>
      <g class="habitat-cloud"><path d="M38 81c0-10 9-16 18-14 4-18 30-18 35-1 13-1 21 6 21 15Z" fill="white"/></g>
      <g class="habitat-cloud habitat-late"><path d="M175 111c1-9 8-14 17-12 6-16 28-15 33 0 10-1 17 3 19 12Z" fill="white" opacity=".7"/></g>
      <path d="M18 178c45-14 81 7 131-1 42-7 86-12 135 1v46H18Z" fill="#d0e4ee"/>
      <path d="M18 191c45-10 89 11 135 0 40-9 84-8 131 2v34H18Z" fill="#bdd7e3"/>
      <ellipse cx="151" cy="224" rx="135" ry="22" fill="#e4dfce"/>
      <ellipse cx="151" cy="220" rx="135" ry="19" fill="#f3eee2"/>
      <g class="habitat-ripple"><path d="M32 182c15 3 31 3 48 0m121 9c18 3 32 3 47 0" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/></g>
      <g class="habitat-ripple habitat-late"><path d="M31 204c9 2 20 2 28 0m155-28c10 2 20 2 30 0" stroke="#9fbfce" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>
      <path d="M33 224c0-7 15-10 20-3 4 7-15 11-20 3Z" fill="#c2c7c4"/>
      <path d="M247 228c-3-7 8-12 15-6 5 6-10 12-15 6Z" fill="#c9bdab"/>`;
	} else if (character === "bunny") {
		scene = `
      <path d="M28 158C28 73 73 28 150 28s122 46 122 131v59H28Z" fill="#f0e9f6"/>
      <path d="M231 52a19 19 0 1 0 18 27c-16 5-29-12-18-27Z" fill="#fff0cb"/>
      <path d="M21 193c47-44 75-42 122-11 44-31 87-32 138 8v41H21Z" fill="#ded4e9"/>
      <path d="M19 211c57-24 106-13 137-1 44-20 85-23 124-6v30H19Z" fill="#d2c6e2"/>
      <ellipse cx="150" cy="231" rx="137" ry="18" fill="#e7ddec"/>
      <g class="habitat-grass"><path d="M38 232c-4-20-1-34 9-44-1 18-1 30-9 44m1 0c-15-11-22-21-22-34 14 8 20 18 22 34m0 0c6-15 15-22 28-24-4 14-13 21-28 24" fill="#a695be"/></g>
      <g class="habitat-grass habitat-late"><path d="M259 231c-1-23-9-38-21-43 4 19 10 33 21 43m-1 0c15-9 23-19 24-31-13 7-20 17-24 31m0 0c-9-13-19-18-31-17 7 11 16 16 31 17" fill="#b6a6c8"/></g>
      <g class="habitat-glint"><path d="m71 66 2 5 5 2-5 2-2 5-2-5-5-2 5-2Zm114 33 1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5Z" fill="#b5a1cc"/></g>
      <g class="habitat-glint habitat-late"><circle cx="41" cy="158" r="2.5" fill="#fff0cb"/><circle cx="262" cy="146" r="3" fill="#fff0cb"/></g>`;
	} else {
		scene = `
      <path d="M28 159C28 76 73 28 149 28s123 47 123 132v59H28Z" fill="#f3ecd9"/>
      <circle cx="212" cy="66" r="23" fill="#f5dba4"/>
      <path class="habitat-light" d="m193 69-64 142h38L230 74Z" fill="#fff9df" opacity=".45"/>
      <path d="M17 204c51-35 99-29 138-6 44-32 91-29 129 6v31H17Z" fill="#e9ead6"/>
      <path d="M54 193V82m0 52-20-20m20 0 25-27" stroke="#c7aa88" stroke-width="8" fill="none" stroke-linecap="round"/>
      <g class="habitat-sway"><path d="M17 96c-5-24 12-46 34-46 19-16 48-3 49 19 14 8 17 28 4 38-29 19-69 18-87-11Z" fill="#b5be96"/><path d="M27 84c0-11 7-19 17-22" stroke="#d7ddbb" stroke-width="6" fill="none" stroke-linecap="round"/></g>
      <path d="M253 204V126m0 22 18-15" stroke="#c7aa88" stroke-width="7" fill="none" stroke-linecap="round"/>
      <g class="habitat-sway habitat-late"><path d="M222 133c-13-17-3-40 16-43 22-16 47 2 44 22 15 18 1 39-20 36-17 9-31 0-40-15Z" fill="#cad0aa"/><path d="M235 111c3-6 7-9 12-10" stroke="#e4e8c9" stroke-width="5" fill="none" stroke-linecap="round"/></g>
      <ellipse cx="150" cy="231" rx="137" ry="18" fill="#daddbf"/>
      <path d="M55 232c0-12-5-21-12-26 0 12 3 21 12 26m0 0c8-12 15-15 22-14-6 10-13 15-22 14m184 1c-7-14-13-20-23-21 4 14 11 20 23 21m0 0c1-15 6-22 14-26 0 13-4 21-14 26" fill="#a8b18c"/>
      <g class="habitat-leaf"><path d="M97 131c-10-2-14 2-14 10 9 1 14-2 14-10m111 39c-7-2-12 2-12 8 8 1 11-2 12-8" fill="#85946e"/></g>`;
	}
	return `<svg class="habitat-background" viewBox="0 0 300 260" fill="none" aria-hidden="true" focusable="false">${scene}</svg>`;
}

/**
 * CSS owns time; this only controls visibility and releases its observers.
 * @param {HTMLElement} root
 */
export function observeHabitat(root) {
	let visible = false;
	const doc = root.ownerDocument;
	const update = () => {
		root.dataset.paused = String(!visible || doc.hidden);
	};
	const observer = new IntersectionObserver(([entry]) => {
		visible = entry.isIntersecting;
		update();
	}, { threshold: 0 });
	root.dataset.paused = "true";
	observer.observe(root);
	doc.addEventListener("visibilitychange", update);
	return () => {
		observer.disconnect();
		doc.removeEventListener("visibilitychange", update);
		root.dataset.paused = "true";
	};
}
