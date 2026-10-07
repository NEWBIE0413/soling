import type { SVGProps } from "react";

export type BrandIconName =
  | "learn" | "quests" | "streak" | "shop" | "profile" | "trophy"
  | "gem" | "xp" | "heart" | "practice" | "writing" | "check"
  | "lock" | "star" | "course";

type BrandIconProps = SVGProps<SVGSVGElement> & {
  name: BrandIconName;
};

/** The same little objects live in the phone tabs, desktop rail and rewards. */
export function BrandIcon({ name, className, ...props }: BrandIconProps) {
  const art = (() => {
    switch (name) {
      case "learn":
      case "course":
        return <>
          <path d="M8 10c5-3 11-2 16 1 5-3 11-4 16-1v29c-6-2-11-2-16 1-5-3-10-3-16-1Z" fill="#409309" />
          <path d="M8 7c5-2 11-1 16 2 5-3 11-4 16-2v28c-6-2-11-1-16 2-5-3-10-4-16-2Z" fill="#8ee244" />
          <path d="M24 9c5-3 11-4 16-2v28c-6-2-11-1-16 2Z" fill="#58c900" />
          <path d="M13 15l6 1m-6 6 6 1m10-7 6-1m-6 8 6-1" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <path d="M24 10v26" stroke="#409309" strokeWidth="2" />
        </>;
      case "quests":
      case "writing":
        return <>
          <rect x="10" y="8" width="28" height="35" rx="6" fill="#dc9416" />
          <rect x="8" y="5" width="28" height="35" rx="6" fill="#ffc83d" />
          <rect x="12" y="10" width="20" height="25" rx="3" fill="#fff5d8" />
          <path d="M17 18h10m-10 6h10m-10 6h5" stroke="#dc9416" strokeWidth="3" strokeLinecap="round" />
          {name === "writing" ? <path d="m28 32 10-19 5 3-10 19-6 4Z" fill="#9061cf" /> : <path d="m26 31 4 4 9-11" stroke="#409309" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />}
        </>;
      case "streak":
        return <>
          <path d="M26 3c3 10 0 11 5 16l5-7c5 8 7 14 4 21-3 8-10 12-18 11C5 42 3 28 13 17c-1 6 2 7 4 8C15 13 22 12 26 3Z" fill="#d65d18" />
          <path d="M25 3c3 10 0 11 5 16l5-7c4 8 6 13 3 19-3 7-9 11-16 10C7 40 5 28 14 18c-1 6 2 7 4 8C16 13 22 12 25 3Z" fill="#ff9633" />
          <path d="M25 23c0 5 6 7 5 12-1 6-12 7-14 0-1-4 2-7 4-9 0 5 3 5 3 3Z" fill="#ffe58d" />
        </>;
      case "shop":
        return <>
          <path d="M9 22h30v20H9Z" fill="#087bb8" />
          <path d="M11 20h26v19H11Z" fill="#63d3fa" />
          <path d="M8 8h32l4 12H4Z" fill="#1ca7e8" />
          <path d="m14 8-2 12h8l1-12m7 0 1 12h8L34 8" fill="white" />
          <path d="M4 20h8a4 4 0 0 1-8 0m16 0h9a4.5 4.5 0 0 1-9 0m17 0h7a3.5 3.5 0 0 1-7 0" fill="#087bb8" />
          <rect x="21" y="27" width="10" height="15" rx="2" fill="#087bb8" />
          <path d="M14 28h3v5h-3Z" fill="white" />
        </>;
      case "profile":
        return <>
          <circle cx="24" cy="24" r="21" fill="#eaf7ff" />
          <path d="M8 42c0-11 6-16 16-16s16 5 16 16" fill="#1ca7e8" />
          <circle cx="24" cy="18" r="11" fill="#ffbc70" />
          <path d="M13 18C9 4 34 0 35 17c-4 0-8-2-10-6-2 4-6 6-12 7" fill="#9061cf" />
          <path d="M21 22c2 2 4 2 6 0" stroke="#b66b35" strokeWidth="2" strokeLinecap="round" />
        </>;
      case "trophy":
        return <>
          <path d="M14 11H6v8c0 7 6 10 13 10m15-18h8v8c0 7-6 10-13 10" fill="none" stroke="#dc9416" strokeWidth="5" />
          <path d="M21 28h6v10h-6Z" fill="#dc9416" />
          <path d="M12 6h24v11c0 10-6 15-12 15S12 27 12 17Z" fill="#ffc83d" />
          <path d="M16 9v8c0 4 1 6 3 8" fill="none" stroke="#ffe58d" strokeWidth="4" strokeLinecap="round" />
          <path d="M16 37h16l3 6H13Z" fill="#dc9416" />
          <path d="m24 12 2 4 5 1-4 3 1 5-4-2-4 2 1-5-4-3 5-1Z" fill="white" />
        </>;
      case "gem":
        return <>
          <path d="m4 18 9-11h22l9 11-20 26Z" fill="#087bb8" />
          <path d="m4 16 9-11h22l9 11-20 26Z" fill="#1ca7e8" />
          <path d="m13 5 4 11h14l4-11m-31 11h40M17 16l7 26 7-26" fill="#63d3fa" />
          <path d="m24 5-7 11h14Z" fill="#c2efff" />
        </>;
      case "xp":
        return <>
          <path d="m27 3-19 24h13l-2 18 22-27H28l4-15Z" fill="#dc9416" />
          <path d="M24 2 6 24h14l-2 18 22-27H26l5-13Z" fill="#ffc83d" />
          <path d="m24 7-9 13h6l-1 8 12-10h-9l3-11Z" fill="#ffe58d" />
        </>;
      case "heart":
        return <>
          <path d="M24 43 6 26C-7 12 11-1 24 12 37-1 55 12 42 26Z" fill="#b63448" transform="translate(3 3) scale(.88)" />
          <path d="M24 40 6 23C-7 9 11-4 24 9 37-4 55 9 42 23Z" fill="#df5260" transform="translate(3 3) scale(.88)" />
          <path d="M11 16c0-5 5-7 9-4" fill="none" stroke="#ff8f98" strokeWidth="4" strokeLinecap="round" />
        </>;
      case "practice":
        return <>
          <circle cx="24" cy="25" r="19" fill="#087bb8" />
          <circle cx="24" cy="22" r="19" fill="#63d3fa" />
          <circle cx="24" cy="22" r="12" fill="white" />
          <circle cx="24" cy="22" r="6" fill="#1ca7e8" />
          <path d="m25 21 13-13m-1 1 1-6 6 1-1 6-6 1" stroke="#dc9416" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </>;
      case "check":
        return <>
          <circle cx="24" cy="25" r="20" fill="#409309" />
          <circle cx="24" cy="22" r="20" fill="#58c900" />
          <path d="m14 22 7 7 13-15" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>;
      case "lock":
        return <>
          <path d="M15 23v-9a9 9 0 0 1 18 0v9" stroke="#a7b2a5" strokeWidth="5" fill="none" />
          <rect x="8" y="20" width="32" height="24" rx="7" fill="#b7c1b3" />
          <rect x="8" y="18" width="32" height="23" rx="7" fill="#dce3d7" />
          <path d="M24 27v6" stroke="#96a28f" strokeWidth="5" strokeLinecap="round" />
        </>;
      case "star":
        return <>
          <path d="m24 4 6 13 14 2-10 10 2 14-12-7-12 7 2-14L4 19l14-2Z" fill="#dc9416" />
          <path d="m24 1 6 13 14 2-10 10 2 14-12-7-12 7 2-14L4 16l14-2Z" fill="#ffc83d" />
          <path d="m24 8 3 9 9 1-7 6 1 8-6-4-6 4 1-8-7-6 9-1Z" fill="#ffe58d" />
        </>;
    }
  })();
  return <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false" className={className ?? "h-8 w-8 shrink-0"} {...props}>{art}</svg>;
}
