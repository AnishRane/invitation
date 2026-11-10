"use client";

import { useId } from "react";
import { localizeEvent, type WeddingEvent } from "@/lib/wedding";
import { useLanguage } from "./language-provider";
import { EventAccents } from "./event-accents";
import { Icon } from "./icons";
import { Divider, Ornament, PatternBorder } from "./ornaments";
import { AmsTusharText } from "./ams-tushar-text";

export function EventBooklet({ event, index, onOpen }: { event: WeddingEvent; index: number; onOpen: () => void }) {
  const { locale, t } = useLanguage();
  event = localizeEvent(event, locale);
  const titleId = useId();

  return <article className={`event-card event-${event.id} event-booklet`} aria-labelledby={titleId}>
    <div className="booklet-preview" aria-hidden="true"><div className="booklet-preview-rules"><span /><span /><span /></div><Ornament name="mandala" /></div>
    <div className="booklet-cover">
    <div className="event-arch"><Ornament name="arch" /><Ornament name="mandala" className="event-arch-mandala" /></div>
    <div className="event-card-body">
      <EventAccents eventId={event.id} />
      <span className="eyebrow">{t(index === 0 ? "common.dayOne" : "common.dayTwo")} · {event.day}</span>
      <h3 id={titleId}><AmsTusharText text={t(event.id === "haldi" ? "event.haldiShort" : "event.weddingShort")} /><span className="event-ceremony-label"><AmsTusharText text={t("event.ceremony")} /></span></h3>
      <Divider /><p className="event-description">{event.description}</p>
      <div className="event-details"><p><Icon name="calendar" /><span>{event.date}<small>{event.time || t("common.timePending")}</small></span></p><p><Icon name="pin" /><span>{event.venue || t("common.venueComing")}<small>{event.address || t(event.mapsUrl ? "common.locationConfirmed" : "common.venuePending")}</small></span></p></div>
      <PatternBorder />
    </div>
    </div>
    <button type="button" className="booklet-cover-trigger" onClick={onOpen} aria-haspopup="dialog" aria-label={t("booklet.openLabel", { event: event.title })} />
  </article>;
}
