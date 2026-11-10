"use client";

import { useEffect, useMemo, useState } from "react";
import { wedding } from "@/lib/wedding";
import { useLanguage } from "./language-provider";

export function Countdown() {
  const { locale, t, number } = useLanguage();
  const muhurat = useMemo(() => {
    const target = new Date(wedding.countdownTo);
    const language = locale === "mr" ? "mr-IN-u-nu-deva" : "en-IN";
    return {
      date: new Intl.DateTimeFormat(language, { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }).format(target),
      time: new Intl.DateTimeFormat(language, { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }).format(target),
    };
  }, [locale]);
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setRemaining(Math.max(0, new Date(wedding.countdownTo).getTime() - Date.now()));
    update();
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      clearInterval(timer);
      if (!document.hidden) { update(); timer = setInterval(update, 1000); }
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", sync); };
  }, []);
  const values = remaining === null ? [null, null, null, null] : [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60];
  return <div className="countdown-wrap">
    <div className="countdown" role="timer" aria-label={t("countdown.label", muhurat)} aria-live="off">
      {values.map((v, i) => <div className="countdown-unit" key={i}><span className="countdown-value">{v === null ? "––" : number(String(v).padStart(2, "0")).padStart(2, number(0))}</span><span className="countdown-label">{[t("countdown.days"), t("countdown.hours"), t("countdown.minutes"), t("countdown.seconds")][i]}</span></div>)}
    </div>
    <p className="countdown-caption">{t(remaining === 0 ? "countdown.begun" : "countdown.until")}</p>
    <p className="countdown-target">{t("countdown.target", muhurat)}</p>
  </div>;
}
