"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Divider, Ornament, PatternBorder, Toran } from "./ornaments";
import { Icon } from "./icons";
import { coupleNames, type FamilySide } from "@/lib/wedding";
import { useLanguage } from "./language-provider";
import { AmsTusharText } from "./ams-tushar-text";

export function FamilySelector() {
  const { locale, t, number, href } = useLanguage();
  const [groom, bride] = coupleNames("groom", locale);
  const [side, setSide] = useState<FamilySide | null>(null);
  useEffect(() => {
    try { const saved = localStorage.getItem("wedding-family"); if (saved === "bride" || saved === "groom") setSide(saved); } catch { /* optional */ }
  }, []);
  function pick(next: FamilySide) {
    setSide(next);
    try { localStorage.setItem("wedding-family", next); } catch { /* optional */ }
  }

  return <main className="family-page">
    <Toran />
    <div className="family-topbar"><Link href={href("/")} className="text-button"><Icon name="back" /> {t("family.back")}</Link><span className="eyebrow">{t("common.monogram")} · {number(2027)}</span></div>
    <div className="family-content">
      <Ornament name="crest" className="family-crest" />
      <p className="eyebrow">{t("family.eyebrow")}</p>
      <h1>{t("family.heading")}<br /><span className="script">{t("family.headingScript")}</span></h1>
      <p className="section-description">{t("family.description")}<br />{t("family.descriptionNext")}</p>
      <Divider />
      <div className="family-options" role="group" aria-label={t("family.chooseLabel")}>
        {([{ id: "bride", person: bride, family: t("family.bride"), number: 1 }, { id: "groom", person: groom, family: t("family.groom"), number: 2 }] as const).map((option, i) => <motion.button type="button" key={option.id} className={`family-card ${side === option.id ? "is-selected" : ""}`} aria-pressed={side === option.id} onClick={() => pick(option.id)} whileHover={{ y: -5 }} whileTap={{ scale: .985 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 + i * .1, duration: .5 }}>
          <span className="family-card-number">{number(option.number).padStart(2, number(0))}</span><span className="family-card-check">{side === option.id && <Icon name="check" />}</span>
          <Ornament name="mandala" className="family-card-mandala" />
          <span className="eyebrow">{option.family}</span><span className="family-person"><AmsTusharText text={option.person} /></span>
          <span className="family-card-status">{t(side === option.id ? "family.selected" : "family.choose")}<Icon name={side === option.id ? "check" : "arrow"} /></span>
          {side === option.id && <motion.span layoutId="family-selection" className="selection-outline" transition={{ type: "spring", stiffness: 320, damping: 32 }} />}
        </motion.button>)}
      </div>
      <div className="family-continue"><AnimatePresence mode="wait">{side ? <motion.div key="continue" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><Link className="button button-primary" href={href(`/celebrations?side=${side}`)}>{t("family.continue")} <Icon name="arrow" /></Link><p>{t("family.changeLater")}</p></motion.div> : <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{t("family.hint")}</motion.p>}</AnimatePresence></div>
    </div>
    <PatternBorder className="family-bottom-border" />
  </main>;
}
