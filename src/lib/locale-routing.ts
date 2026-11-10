import type { Locale } from "./i18n.ts";

export const localeHeader = "x-wedding-locale";

export function localeFromPath(path: string): Locale | null {
  const match = /^\/(en|mr)(?=\/|\?|#|$)/.exec(path);
  return match ? match[1] as Locale : null;
}

export function withoutLocale(path: string): string {
  if (!localeFromPath(path)) return path;
  const rest = path.slice(3);
  return !rest || rest.startsWith("?") || rest.startsWith("#") ? `/${rest}` : rest;
}

export function localizedPath(path: string, locale: Locale): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const plain = withoutLocale(path);
  return `/${locale}${plain === "/" ? "" : plain.startsWith("/?") || plain.startsWith("/#") ? plain.slice(1) : plain}`;
}

export function isInvitationPage(path: string): boolean {
  return path === "/" || path === "/family" || path === "/celebrations";
}
