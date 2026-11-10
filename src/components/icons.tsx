import type { CSSProperties } from "react";

export type IconName = "arrow" | "back" | "down" | "pin" | "calendar" | "check" | "close" | "menu" | "plus" | "minus" | "heart" | "external" | "book" | "globe";
const paths: Record<IconName, React.ReactNode> = {
  arrow: <><path d="M4 12h15M13 5l7 7-7 7" /></>,
  back: <><path d="M20 12H5m6-7-7 7 7 7" /></>,
  down: <><path d="m5 9 7 7 7-7M12 3v13" /></>,
  pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 11h18m-13 5h2m4 0h2" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  plus: <path d="M5 12h14M12 5v14" />,
  minus: <path d="M5 12h14" />,
  heart: <path d="m12 21-8.5-8.5a5.3 5.3 0 0 1 7.5-7.5L12 6l1-1a5.3 5.3 0 0 1 7.5 7.5Z" />,
  external: <><path d="M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" /></>,
  book: <><path d="M12 6C9 3 5 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 2Zm0 0v15" /><path d="M5 8c1.5-.2 3 0 4 .6M5 12c1.5-.2 3 0 4 .6m6-4c1-.6 2.5-.8 4-.6m-4 4.6c1-.6 2.5-.8 4-.6" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z" /></>,
};

export function Icon({ name, className, style }: { name: IconName; className?: string; style?: CSSProperties }) {
  return <svg className={`icon ${className || ""}`} style={style} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}
