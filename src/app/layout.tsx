import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { MotionProvider } from "@/components/motion";
import { LanguageProvider } from "@/components/language-provider";
import { LanguageBar } from "@/components/language-switcher";
import { getRequestLocale } from "@/lib/server-language";
import { coupleNames, weddingDateLabel } from "@/lib/wedding";
import { translate } from "@/lib/i18n";
import "./globals.css";

const script = localFont({ src: "../../public/fonts/great-vibes.woff2", variable: "--font-script", display: "swap" });
const display = localFont({ src: "../../public/fonts/montserrat.woff2", variable: "--font-sans", display: "swap", weight: "100 900" });
const lead = localFont({ src: "../../public/fonts/tangerine.woff2", variable: "--font-lead", display: "swap", weight: "700" });

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const names = coupleNames("groom", locale).join(` ${translate(locale, "common.and")} `);
  const description = `${translate(locale, "welcome.invite")}. ${weddingDateLabel(locale)}. ${translate(locale, "family.continue")}.`;
  return {
    title: { default: `${names} | ${translate(locale, "welcome.beginning")}`, template: `%s | ${names}` },
    description,
    applicationName: names,
    robots: { index: false, follow: false },
    openGraph: { title: `${names} — ${translate(locale, "welcome.youAreInvited")}`, description, type: "website", locale: locale === "mr" ? "mr_IN" : "en_IN", alternateLocale: locale === "mr" ? ["en_IN"] : ["mr_IN"] },
  };
}

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f6e8e7" };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getRequestLocale();
  return <html lang={locale} className={`${script.variable} ${display.variable} ${lead.variable}`}><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;500;600;700&display=swap" /></head><body><LanguageProvider initialLocale={locale}><MotionProvider><LanguageBar />{children}</MotionProvider></LanguageProvider></body></html>;
}
