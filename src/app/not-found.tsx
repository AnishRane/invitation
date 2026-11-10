"use client";

import Link from "next/link";
import { Divider, Ornament } from "@/components/ornaments";
import { useLanguage } from "@/components/language-provider";

export default function NotFound() {
  const { t, href } = useLanguage();
  return <main className="fallback-page"><Ornament name="mandala" /><p className="eyebrow">{t("fallback.notFoundEyebrow")}</p><h1>{t("fallback.notFoundTitle")}</h1><Divider /><p>{t("fallback.notFoundDescription")}</p><Link className="button button-primary" href={href("/")}>{t("fallback.home")}</Link></main>;
}

