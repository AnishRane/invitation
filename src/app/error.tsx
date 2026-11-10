"use client";

import Link from "next/link";
import { Divider, Ornament } from "@/components/ornaments";
import { useLanguage } from "@/components/language-provider";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t, href } = useLanguage();
  return <main className="fallback-page"><Ornament name="mandala" /><p className="eyebrow">{t("fallback.errorEyebrow")}</p><h1>{t("fallback.errorTitle")}</h1><Divider /><p>{t("fallback.errorDescription")}</p><button className="button button-primary" type="button" onClick={reset}>{t("fallback.retry")}</button><Link className="text-button" href={href("/")}>{t("fallback.home")}</Link></main>;
}
