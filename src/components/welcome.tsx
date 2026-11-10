"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Countdown } from "./countdown";
import { Divider, Ornament, PatternBorder, Toran } from "./ornaments";
import { Icon } from "./icons";
import { ease } from "./motion";
import { coupleNames, weddingDateLabel } from "@/lib/wedding";
import { useLanguage } from "./language-provider";
import { AmsTusharText } from "./ams-tushar-text";

export function Welcome() {
  const { locale, t, href } = useLanguage();
  const [groom, bride] = coupleNames("groom", locale);
  const reduced = useReducedMotion();
  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(false);
  const cta = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (opened) cta.current?.focus({ preventScroll: true });
  }, [opened]);

  function open() {
    setOpening(true);
  }

  function finishOpening() {
    if (!opening) return;
    setOpened(true);
  }

  const duration = reduced ? 0 : 1.65;

  return <main className="welcome-page">
    <div className="welcome-outside" aria-hidden="true"><span>{t("welcome.topline")}</span><span>{t("welcome.monthYear")}</span></div>
    <div className="invitation-frame">
      <Toran />
      <div className="lace-edge lace-left" aria-hidden="true" /><div className="lace-edge lace-right" aria-hidden="true" />
      <div className={`welcome-art ${opening ? "is-revealed" : ""}`} aria-hidden="true"><Ornament name="sprig" className="sprig-left" /><Ornament name="sprig" className="sprig-right" /><Ornament name="crest" className="welcome-crest" /></div>
      <div className="welcome-watermark" aria-hidden="true"><Ornament name="mandala" /></div>
      <motion.div className="welcome-content" inert={!opened} initial={false} animate={{ opacity: opening ? 1 : 0, y: opening || reduced ? 0 : 18 }} transition={{ duration: .9, delay: reduced ? 0 : .55, ease }}>
        <p className="eyebrow">{t("welcome.families")}</p>
        <p className="handwritten welcome-intro">{t("welcome.beginning")}</p>
        <h1 className="couple-names welcome-names"><span><AmsTusharText text={groom} /></span><span className="ampersand"><AmsTusharText text={t("common.and")} /></span><span><AmsTusharText text={bride} /></span></h1>
        <p className="welcome-invite">{t("welcome.invite")}</p>
        <Divider />
        <p className="date-line">{weddingDateLabel(locale)}</p>
        <Countdown />
        <Link ref={cta} href={href("/family")} className="button button-primary invitation-cta">{t("welcome.enter")} <Icon name="arrow" /></Link>
        <span className="welcome-note">{t("welcome.note")}</span>
      </motion.div>
      <PatternBorder className="welcome-bottom-border" />

      {!opened && <>
        {(["left", "right"] as const).map((side) => <motion.div key={side} aria-hidden="true" className={`invitation-door door-${side}`} initial={false} animate={{ x: opening ? (side === "left" ? "-102%" : "102%") : "0%" }} transition={{ duration, ease: [.65, 0, .2, 1] }} onAnimationComplete={side === "left" ? finishOpening : undefined}>
          <div className="door-mandala"><Ornament name="mandala" /></div>
          <div className="door-inset"><div className="door-arch"><Ornament name="paisley" /><Ornament name="crest" /></div><div className="door-lower"><Ornament name="mandala" /></div></div>
        </motion.div>)}
        <motion.div className="invitation-seal-wrap" initial={false} animate={{ opacity: opening ? 0 : 1, scale: opening && !reduced ? .9 : 1 }} transition={{ duration: .35 }} style={{ pointerEvents: opening ? "none" : "auto" }}>
          <p className="seal-title">{t("welcome.youAreInvited")}</p>
          <button type="button" className="invitation-seal" onClick={open} disabled={opening} aria-label={t("welcome.openLabel")}><span><AmsTusharText text={t("common.sealFirst")} /><span className="seal-amp"><AmsTusharText text={t("common.and")} /></span><AmsTusharText text={t("common.sealSecond")} /></span><Ornament name="mandala" /></button>
          <span className="eyebrow seal-hint">{t("welcome.tapSeal")}</span>
        </motion.div>
      </>}
    </div>
    <div className="welcome-outside welcome-outside-bottom" aria-hidden="true"><span>{t("welcome.madeWithLove")}</span><Icon name="heart" /><span>{t("welcome.people")}</span></div>
  </main>;
}
