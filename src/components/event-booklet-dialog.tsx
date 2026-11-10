"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { directionsUrl, googleCalendarUrl, localizeEvent, type WeddingEvent } from "@/lib/wedding";
import { useLanguage } from "./language-provider";
import { LanguageSwitcher } from "./language-switcher";
import { AmsTusharText } from "./ams-tushar-text";
import { EventAccents } from "./event-accents";
import { Icon } from "./icons";
import { ease } from "./motion";
import { Divider, Ornament, PatternBorder } from "./ornaments";

export function EventBookletDialog({ event, onClose }: { event: WeddingEvent; onClose: () => void }) {
  const { locale, t } = useLanguage();
  event = localizeEvent(event, locale);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reduced = useReducedMotion();
  const [unfolded, setUnfolded] = useState(false);
  const mapsUrl = event.mapsUrl || directionsUrl(event.address);
  const hasTimeline = !!event.timeline?.length;
  const timeline = event.timeline?.length ? event.timeline : [{ title: event.title, time: event.time, description: event.description }];

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = previous; };
  }, []);

  return <motion.dialog ref={dialogRef} className={`booklet-dialog event-${event.id}`} aria-labelledby="booklet-dialog-title" initial={{ opacity: 0, y: reduced ? 0 : 18, scale: reduced ? 1 : .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduced ? 0 : 12 }} transition={{ duration: reduced ? .12 : .4, ease }} onCancel={(e) => { e.preventDefault(); onClose(); }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="booklet-scene">
      <button type="button" className="icon-button booklet-close" onClick={onClose} aria-label={t("booklet.close")} autoFocus><Icon name="close" /></button>
      <div className="booklet-spread" inert={!unfolded}>
        <section className="booklet-page booklet-overview" aria-label={t("booklet.detailsLabel")}>
          <EventAccents eventId={event.id} />
          <PatternBorder /><Ornament name="mandala" className="booklet-page-emblem" />
          <p className="eyebrow">{event.day} · {event.date}</p>
          <h2 id="booklet-dialog-title"><AmsTusharText text={event.title} /></h2>
          <Divider /><p className="booklet-dedication">{event.description}</p>
          <div className="booklet-venue"><Icon name="pin" /><h3>{event.venue || t("common.venueComing")}</h3><p>{event.address || t(mapsUrl ? "booklet.mapReady" : "booklet.venuePending")}</p></div>
          <div className="booklet-actions">
            {mapsUrl && <a className="button button-outline" href={mapsUrl} target="_blank" rel="noopener noreferrer">{t("common.directions")} <Icon name="external" /></a>}
            <a className="button button-primary" href={googleCalendarUrl(event, locale)} target="_blank" rel="noopener noreferrer" aria-label={t("common.calendarLabel", { event: event.title })}>{t("common.saveDate")} <Icon name="calendar" /></a>
          </div>
          <div className="booklet-page-footer"><p className="booklet-page-number" aria-hidden="true">{t("booklet.pageOne")}</p></div>
        </section>

        <section className="booklet-page booklet-timeline" aria-labelledby="booklet-timeline-title">
          <p className="eyebrow">{t("booklet.eyebrow")}</p>
          <h3 id="booklet-timeline-title">{t("booklet.heading")}<br /><span className="script">{t("booklet.headingScript")}</span></h3>
          <Divider />
          {!hasTimeline && <p className="booklet-timeline-note">{t("booklet.timelinePending")}</p>}
          <ol className="booklet-timeline-list">{timeline.map((entry, index) => <li key={`${entry.title}-${index}`}>
            <span className="booklet-timeline-time">{entry.time || t("common.timePending")}</span>
            <div className="booklet-timeline-entry"><h4>{entry.title}</h4>{entry.description && <p>{entry.description}</p>}</div>
          </li>)}</ol>
          {hasTimeline && timeline.some((entry) => !entry.time) && <p className="booklet-timeline-note">{t("booklet.timesPending")}</p>}
          <div className="booklet-timeline-end"><Ornament name="crest" /><p>{t("booklet.endOne")}<br />{t("booklet.endTwo")}</p></div>
          <button type="button" className="text-button booklet-back" onClick={onClose}><Icon name="back" /> {t("booklet.back")}</button>
          <div className="booklet-page-footer"><p className="booklet-page-number" aria-hidden="true">{t("booklet.pageTwo")}</p><LanguageSwitcher className="booklet-language" /></div>
        </section>
      </div>

      {!unfolded && <motion.div className="booklet-turning-cover" aria-hidden="true" initial={{ rotateY: 0, opacity: 1 }} animate={{ rotateY: reduced ? 0 : -112, opacity: reduced ? [1, 0] : [1, 1, 0] }} transition={{ duration: reduced ? .12 : 1.15, delay: reduced ? 0 : .12, ease, opacity: { times: reduced ? [0, 1] : [0, .55, 1], duration: reduced ? .12 : 1.15, delay: reduced ? 0 : .12 } }} onAnimationComplete={() => setUnfolded(true)}>
        <EventAccents eventId={event.id} />
        <Ornament name="mandala" className="booklet-front-mandala" />
        <p className="eyebrow">{t("booklet.coverEyebrow")}</p><p className="booklet-front-title"><AmsTusharText text={event.title} /></p><Divider /><p className="date-line">{event.date}</p><p className="booklet-front-note">{t("booklet.coverNote")}</p>
      </motion.div>}
    </div>
  </motion.dialog>;
}
