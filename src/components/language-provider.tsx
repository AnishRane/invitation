"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { formatNumber, languageCookie, translate, type Locale, type TranslationKey } from "@/lib/i18n";
import { coupleNames } from "@/lib/wedding";
import { localeFromPath, localizedPath, withoutLocale } from "@/lib/locale-routing";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  href: (path: string) => string;
  t: (key: TranslationKey, values?: Record<string, string | number>) => string;
  number: (value: number | string) => string;
};
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children, initialLocale }: { children: ReactNode; initialLocale: Locale }) {
  const [preferredLocale, setLocaleState] = useState(initialLocale);
  const pathname = usePathname();
  const locale = localeFromPath(pathname) ?? preferredLocale;
  useEffect(() => {
    document.documentElement.lang = locale;
    const names = coupleNames("groom", locale).join(` ${translate(locale, "common.and")} `);
    const pagePath = withoutLocale(pathname);
    const page = translate(locale, pagePath === "/family" ? "family.chooseLabel" : pagePath === "/celebrations" ? "events.heading" : "welcome.beginning");
    document.title = `${page} | ${names}`;
  }, [locale, pathname]);
  function setLocale(next: Locale) {
    setLocaleState(next);
    document.documentElement.lang = next;
    try { document.cookie = `${languageCookie}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`; } catch { /* The current page can still switch when cookies are disabled. */ }
    // Native history integrates with Next navigation without resetting forms or open booklets.
    window.history.replaceState(null, "", localizedPath(`${window.location.pathname}${window.location.search}${window.location.hash}`, next));
  }
  return <LanguageContext.Provider value={{ locale, setLocale, href: (path) => localizedPath(path, locale), t: (key, values) => translate(locale, key, values), number: (value) => formatNumber(value, locale) }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("LanguageProvider is required.");
  return context;
}
