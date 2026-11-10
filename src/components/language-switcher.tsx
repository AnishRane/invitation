"use client";

import { useLanguage } from "./language-provider";
import { Icon } from "./icons";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLanguage();
  const alternate = locale === "en" ? "mr" : "en";
  const label = alternate === "mr" ? "मराठीत पहा / Switch to Marathi" : "Switch to English / इंग्रजीत पहा";
  return <button className={`language-switcher ${className}`} type="button" lang={alternate} aria-label={label} title={label} onClick={() => setLocale(alternate)}><Icon name="globe" /><span>{alternate === "mr" ? "मराठी" : "English"}</span></button>;
}

export function LanguageBar() {
  return <div className="language-bar"><div className="language-bar-inner"><LanguageSwitcher /></div></div>;
}
