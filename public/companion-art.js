/**
 * @typedef {'quokka'|'seal'|'bunny'} CompanionCharacter
 * @typedef {'idle'|'wave'|'celebrate'|'thinking'|'encourage'} CompanionPose
 */

/**
 * Trusted SVG inner artwork for a parent-owned viewBox="0 0 240 220".
 * Only fixed shapes and finite palette/face choices are interpolated.
 * Limb roots match the parent's CSS pivots; the parent owns pose motion.
 * No IDs, filters, fonts, external resources, or caller-supplied markup.
 *
 * @param {CompanionCharacter} character
 * @param {CompanionPose} pose
 * @returns {string}
 */
export function companionArt(character, pose) {
	let body;
	let feet;
	let arms;
	let faceBase;
	let ink;
	let blush;
	let eyeY;
	let noseY;

	switch (character) {
		case "seal":
			ink = "#293E65";
			blush = "#F2B8AE";
			eyeY = 88;
			noseY = 102;
			feet = `
        <g class="mascot-foot mascot-foot-left">
          <path d="M76 179c-12 2-17 13-7 18 8 4 28 3 35-3 5-4 2-11-5-14Z" fill="#CEC8BD"/>
          <ellipse cx="86" cy="187" rx="21" ry="9" fill="#EAE4D9"/>
        </g>
        <g class="mascot-foot mascot-foot-right">
          <path d="M164 179c12 2 17 13 7 18-8 4-28 3-35-3-5-4-2-11 5-14Z" fill="#CEC8BD"/>
          <ellipse cx="154" cy="187" rx="21" ry="9" fill="#EAE4D9"/>
        </g>`;
			body = `
        <path d="M169 164c10-13 28-22 37-12 11 14-6 34-29 37l-15-7Z" fill="#527AA5"/>
        <path d="M174 162c10-12 23-18 30-11 9 10-5 26-26 30Z" fill="#83A9CD"/>
        <path d="M190 157l6-3" stroke="#B0CCE2" stroke-width="4" stroke-linecap="round"/>
        <path d="M120 38c-39 0-56 37-62 84-3 24-10 44 7 61 13 13 32 17 55 17s42-4 55-17c17-17 10-37 7-61-6-47-23-84-62-84Z" fill="#CEC8BD"/>
        <path d="M120 32c-37 0-55 36-61 83-4 25-9 44 5 61 12 14 33 19 56 19s44-5 56-19c14-17 9-36 5-61-6-47-24-83-61-83Z" fill="#EEE9DF"/>
        <path d="M120 42c-27 0-43 28-49 65-4 24-6 46 7 61 9 10 23 15 42 15s33-5 42-15c13-15 11-37 7-61-6-37-22-65-49-65Z" fill="#FAF6EE"/>
        <path d="M84 63c7-10 15-15 25-17" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>`;
			arms = limbPair(`
        <path d="M66 106c-13-2-25 19-26 35-1 13 8 20 19 12 13-10 23-35 17-43-2-3-6-4-10-4Z" fill="#527AA5"/>
        <path d="M66 103c-12-1-24 18-25 32-1 12 7 18 17 11 12-9 22-31 17-37-2-4-5-6-9-6Z" fill="#83A9CD"/>
        <path d="M51 120c3-5 6-8 10-10" stroke="#B0CCE2" stroke-width="4" stroke-linecap="round"/>`);
			faceBase = `
        <path d="M75 104l-10-2m10 10-10 4m100-12 10-2m-10 10 10 4" stroke="#999D9E" stroke-width="3" stroke-linecap="round"/>`;
			break;
		case "bunny":
			ink = "#59365E";
			blush = "#F3B8BB";
			eyeY = 99;
			noseY = 113;
			feet = `
        <g class="mascot-foot mascot-foot-left">
          <ellipse cx="88" cy="191" rx="23" ry="10" fill="#9572B5"/>
          <ellipse cx="88" cy="187" rx="22" ry="8" fill="#B695D2"/>
        </g>
        <g class="mascot-foot mascot-foot-right">
          <ellipse cx="152" cy="191" rx="23" ry="10" fill="#9572B5"/>
          <ellipse cx="152" cy="187" rx="22" ry="8" fill="#B695D2"/>
        </g>`;
			body = `
        <circle cx="186" cy="166" r="21" fill="#C9B1DF"/>
        <circle cx="188" cy="162" r="18" fill="#E5D8F0"/>
        <path d="M80 72C65 43 73 11 88 10c22-2 26 28 19 56l-4 16Z" fill="#9572B5"/>
        <path d="M79 66C67 39 75 7 90 8c19 1 21 29 15 54l-4 15Z" fill="#C6A9DF"/>
        <path d="M87 57c-5-17-4-32 2-36 7 6 8 20 5 35" fill="#E4CFEF"/>
        <path d="M132 66c6-29 27-38 43-30 18 9 27 32 10 41-10 5-24-4-32-11l-3 14Z" fill="#9572B5"/>
        <path d="M130 62c8-27 28-34 43-26 16 8 24 26 11 35-10 7-23-2-30-9l-6 14Z" fill="#C6A9DF"/>
        <path d="M153 53c3 8 9 14 17 17" stroke="#AC89C9" stroke-width="4" stroke-linecap="round"/>
        <path d="M120 61c-35 0-59 24-66 65-7 41 8 68 66 70 58-2 73-29 66-70-7-41-31-65-66-65Z" fill="#9572B5"/>
        <path d="M120 55c-34 0-58 24-65 65-7 40 9 68 65 70 56-2 72-30 65-70-7-41-31-65-65-65Z" fill="#C6A9DF"/>
        <path d="M72 93c6-11 13-17 22-21" stroke="#DEC8ED" stroke-width="5" stroke-linecap="round"/>
        <path d="M76 110c0-23 19-39 44-39s44 16 44 39c0 22-20 34-44 34s-44-12-44-34Z" fill="#E6D9DC"/>
        <path d="M76 106c0-23 19-38 44-38s44 15 44 38c0 22-20 34-44 34s-44-12-44-34Z" fill="#FFF7EB"/>
        <path d="M108 173c8 2 16 2 24 0" stroke="#DEC8ED" stroke-width="4" stroke-linecap="round"/>`;
			arms = limbPair(`
        <path d="M65 109c-11 0-15 13-8 25 6 11 17 18 25 11 8-7 1-20-7-30-3-4-6-6-10-6Z" fill="#9572B5"/>
        <path d="M65 105c-10 0-14 12-7 23 6 10 16 17 23 11 7-6 1-18-7-28-3-4-6-6-9-6Z" fill="#B695D2"/>
        <path d="M62 113c-2 4-1 8 1 12" stroke="#D7BDE8" stroke-width="3.5" stroke-linecap="round"/>`);
			faceBase = "";
			break;
		default:
			ink = "#593820";
			blush = "#E59A75";
			eyeY = 88;
			noseY = 102;
			feet = `
        <g class="mascot-foot mascot-foot-left">
          <ellipse cx="88" cy="191" rx="23" ry="10" fill="#80502F"/>
          <ellipse cx="88" cy="187" rx="22" ry="8" fill="#A56B40"/>
        </g>
        <g class="mascot-foot mascot-foot-right">
          <ellipse cx="152" cy="191" rx="23" ry="10" fill="#80502F"/>
          <ellipse cx="152" cy="187" rx="22" ry="8" fill="#A56B40"/>
        </g>`;
			body = `
        <path d="M168 163c16-4 28-20 33-13 10 13-6 34-29 38l-11-8Z" fill="#A56B40"/>
        <path d="M173 165c13-5 22-16 27-15 5 8-5 23-24 29Z" fill="#C8915B"/>
        <ellipse cx="78" cy="49" rx="20" ry="24" transform="rotate(-20 78 49)" fill="#A56B40"/>
        <ellipse cx="78" cy="45" rx="20" ry="23" transform="rotate(-20 78 45)" fill="#C8915B"/>
        <ellipse cx="79" cy="47" rx="11" ry="15" transform="rotate(-20 79 47)" fill="#9B633D"/>
        <ellipse cx="162" cy="49" rx="20" ry="24" transform="rotate(20 162 49)" fill="#A56B40"/>
        <ellipse cx="162" cy="45" rx="20" ry="23" transform="rotate(20 162 45)" fill="#C8915B"/>
        <ellipse cx="161" cy="47" rx="11" ry="15" transform="rotate(20 161 47)" fill="#9B633D"/>
        <path d="M120 40c-26 0-48 14-60 40-10 20-12 34-6 48-12 24-15 46 1 59 13 10 36 14 65 14s52-4 65-14c16-13 13-35 1-59 6-14 4-28-6-48-12-26-34-40-60-40Z" fill="#A56B40"/>
        <path d="M120 34c-26 0-47 14-59 40-10 21-12 34-6 48-12 24-15 45 0 58 13 10 36 14 65 14s52-4 65-14c15-13 12-34 0-58 6-14 4-27-6-48-12-26-33-40-59-40Z" fill="#C8915B"/>
        <path d="M103 39c-3-9 7-20 12-16 3 2 0 8-2 10 9-7 18-7 18-2 0 3-4 5-7 7" fill="#C8915B"/>
        <path d="M70 76c5-10 12-17 20-21" stroke="#E8B883" stroke-width="5" stroke-linecap="round"/>
        <path d="M120 134c-25 0-37 16-35 35 1 17 15 25 35 25s34-8 35-25c2-19-10-35-35-35Z" fill="#EAC9A2"/>
        <path d="M120 131c-24 0-36 15-34 33 1 17 14 24 34 24s33-7 34-24c2-18-10-33-34-33Z" fill="#FFF0D8"/>
        <ellipse cx="120" cy="110" rx="29" ry="23" fill="#EAC9A2"/>
        <ellipse cx="120" cy="107" rx="29" ry="22" fill="#FFF0D8"/>`;
			arms = limbPair(`
        <path d="M65 109c-11-1-16 10-9 22 6 12 19 20 27 13 7-7 0-19-8-29-3-4-6-6-10-6Z" fill="#A56B40"/>
        <path d="M65 105c-10-1-15 9-8 20 6 11 18 18 25 12 6-6 0-17-8-27-3-3-6-5-9-5Z" fill="#D5A06D"/>
        <path d="M62 112c-2 3-1 7 1 10" stroke="#E8B883" stroke-width="3.5" stroke-linecap="round"/>`);
			faceBase = "";
	}

	const eyes = pose === "celebrate"
		? `<path d="M90 ${
			eyeY + 2
		}c1-8 11-8 13 0m34 0c2-8 12-8 13 0" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`
		: pose === "encourage"
		? `<path d="M90 ${
			eyeY + 2
		}c2-6 10-6 13 0" fill="none" stroke="${ink}" stroke-width="3.5" stroke-linecap="round"/><ellipse cx="144" cy="${eyeY}" rx="5.5" ry="7" fill="${ink}"/>`
		: `<ellipse cx="${pose === "thinking" ? 98 : 96}" cy="${
			pose === "thinking" ? eyeY - 2 : eyeY
		}" rx="5.5" ry="7" fill="${ink}"/><ellipse cx="${
			pose === "thinking" ? 146 : 144
		}" cy="${
			pose === "thinking" ? eyeY - 2 : eyeY
		}" rx="5.5" ry="7" fill="${ink}"/>`;
	const mouth = pose === "celebrate"
		? `<path d="M109 ${
			noseY + 9
		}q11 7 22 0c-1 12-6 17-11 17s-10-5-11-17Z" fill="${ink}"/><path d="M114 ${
			noseY + 22
		}q6-7 12 0q-6 6-12 0Z" fill="#EE9C9E"/>`
		: pose === "thinking"
		? `<path d="M120 ${
			noseY + 3
		}v6m0 0c-3 5-7 5-10 1m10-1c3 3 7 3 10 0" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`
		: `<path d="M120 ${
			noseY + 3
		}v6m0 0c-3 7-10 7-13 1m13-1c3 7 10 7 13 1" fill="none" stroke="${ink}" stroke-width="3.5" stroke-linecap="round"/>`;

	return `
    <ellipse class="mascot-ground" cx="120" cy="205" rx="58" ry="8" fill="#324238" opacity=".09"/>
    <g class="mascot-character">
      ${feet}
      ${body}
      ${arms}
      <g class="mascot-face">
        ${faceBase}
        <ellipse cx="83" cy="${
		eyeY + 15
	}" rx="9" ry="7" fill="${blush}" opacity=".65"/>
        <ellipse cx="157" cy="${
		eyeY + 15
	}" rx="9" ry="7" fill="${blush}" opacity=".65"/>
        ${eyes}
        <path d="M113 ${
		noseY - 3
	}c0-4 14-4 14 0 0 4-4 7-7 7s-7-3-7-7Z" fill="${ink}"/>
        ${mouth}
      </g>
    </g>`;
}

/** The mirrored artwork stays inside the right arm's untransformed CSS pivot. */
function limbPair(left) {
	return `
    <g class="mascot-arm mascot-arm-left">${left}</g>
    <g class="mascot-arm mascot-arm-right">
      <g transform="translate(240 0) scale(-1 1)">${left}</g>
    </g>`;
}
