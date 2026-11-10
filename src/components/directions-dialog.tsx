"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { directionsUrl, localizeEvent, type WeddingEvent } from "@/lib/wedding";
import { useLanguage } from "./language-provider";
import { LanguageSwitcher } from "./language-switcher";
import { AmsTusharText } from "./ams-tushar-text";
import { Divider, Ornament, PatternBorder } from "./ornaments";
import { Icon } from "./icons";

export function DirectionsDialog({ event, onClose }: { event: WeddingEvent; onClose: () => void }) {
  const { locale, t } = useLanguage();
  event = localizeEvent(event, locale);
  const ref = useRef<HTMLDialogElement>(null);
  const reduced = useReducedMotion();
  const url = event.mapsUrl || directionsUrl(event.address);

  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = previous; };
  }, []);

  return <motion.dialog ref={ref} className="directions-dialog" aria-labelledby="directions-title" initial={{ opacity: 0, y: reduced ? 0 : 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : 20 }} transition={{ type: "spring", stiffness: 300, damping: 32 }} onCancel={(e) => { e.preventDefault(); onClose(); }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="dialog-content">
      <span className="sheet-handle" aria-hidden="true" />
      <button className="icon-button dialog-close" onClick={onClose} aria-label={t("directions.close")} autoFocus><Icon name="close" /></button>
      <PatternBorder />
      <div className="dialog-heading">
        <Ornament name="mandala" className="dialog-mandala" />
        <p className="eyebrow">{t("directions.eyebrow")}</p>
        <h2 id="directions-title"><AmsTusharText text={event.title} /></h2>
        <Divider /><p className="date-line">{event.date}</p>
      </div>
      <div className="venue-status"><Icon name="pin" /><h3>{event.venue || t("common.venueComing")}</h3><p>{event.address || t(url ? "directions.confirmed" : "directions.pending")}</p></div>
      {url ? <a className="button button-primary" href={url} target="_blank" rel="noopener noreferrer">{t("directions.openMaps")} <Icon name="external" /></a> : <p className="status-note"><span className="status-dot" /> {t("common.venuePending")}</p>}
      <button type="button" className="text-button" onClick={onClose}>{t("directions.back")} <Icon name="arrow" /></button>
      <LanguageSwitcher className="directions-language" />
    </div>
  </motion.dialog>;
}
