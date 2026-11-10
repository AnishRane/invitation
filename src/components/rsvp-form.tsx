"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { localizeEvent, wedding, type EventId, type FamilySide } from "@/lib/wedding";
import { localizeError } from "@/lib/i18n";
import { useLanguage } from "./language-provider";
import { receiptSchema, rsvpSchema, type Receipt } from "@/lib/rsvp-schema";
import { Icon } from "./icons";
import { Divider, Ornament, PatternBorder } from "./ornaments";

export function RsvpForm({ side }: { side: FamilySide }) {
  const { locale, t, number } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [events, setEvents] = useState<EventId[]>(["haldi", "wedding"]);
  const [guests, setGuests] = useState(1);
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const receipt = useRef<Receipt | null>(null);
  const status = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submitting = useRef(false);
  const restoreFormFocus = useRef(false);

  useEffect(() => {
    try { const stored = localStorage.getItem("wedding-rsvp-receipt"); if (stored) { const parsed = receiptSchema.safeParse(JSON.parse(stored)); if (parsed.success) receipt.current = parsed.data; } } catch { /* optional */ }
  }, []);
  useEffect(() => { if (error) errorRef.current?.focus({ preventScroll: true }); }, [error]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting.current) return;
    setError("");
    receipt.current ??= { id: crypto.randomUUID(), token: crypto.randomUUID() };
    const result = rsvpSchema.safeParse({ name, phone, attending, events, guests, note, website, side, receipt: receipt.current });
    if (!result.success) { setError(result.error.issues[0]?.message || "Please check your response."); return; }
    submitting.current = true;
    setPending(true);
    try {
      try { localStorage.setItem("wedding-rsvp-receipt", JSON.stringify(receipt.current)); } catch { /* The current tab can still submit and edit. */ }
      const response = await fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json", "Accept-Language": locale }, body: JSON.stringify({ name, phone, attending, events, guests, note, website, side, receipt: receipt.current }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "We couldn’t save your response. Please try again.");
      setSent(true);
    } catch (cause) { setError(cause instanceof Error && cause.message !== "Failed to fetch" && cause.message !== "Load failed" ? cause.message : "Please check your connection and try again."); }
    finally { submitting.current = false; setPending(false); }
  }

  function toggleEvent(id: EventId) { setEvents((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]); }

  return <div className="rsvp-card">
    <div className="rsvp-card-heading"><p className="eyebrow">{t("rsvp.formEyebrow")}</p><h3>{t("rsvp.formHeading")}</h3><p>{wedding.rsvpDeadline ? t("rsvp.deadline", { date: wedding.rsvpDeadline }) : t("rsvp.formDescription")}</p><Divider /></div>
    <AnimatePresence mode="wait" initial={false}>{sent ? <motion.div key="thanks" className="rsvp-success" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onAnimationComplete={() => status.current?.focus({ preventScroll: true })}>
      <div ref={status} role="status" tabIndex={-1}><div className="success-symbol"><Ornament name="mandala" /><Icon name="check" /></div><p className="handwritten">{t("rsvp.thanks")}</p><h4>{name.trim().split(/\s+/)[0]}</h4><p>{t(attending === "yes" ? "rsvp.savedYes" : "rsvp.savedNo", { count: number(guests) })}</p><span className="saved-badge"><Icon name="check" /> {t("rsvp.saved")}</span></div>
      <button type="button" className="button button-outline" onClick={() => { restoreFormFocus.current = true; setSent(false); }}>{t("rsvp.edit")} <Icon name="arrow" /></button>
    </motion.div> : <motion.form key="form" ref={formRef} noValidate onSubmit={submit} className="rsvp-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onAnimationComplete={() => { if (restoreFormFocus.current) { formRef.current?.querySelector("input")?.focus({ preventScroll: true }); restoreFormFocus.current = false; } }}>
      <div className="form-row"><label className="field"><span>{t("rsvp.name")} <span aria-hidden="true">*</span></span><input required name="name" autoComplete="name" placeholder={t("rsvp.namePlaceholder")} maxLength={100} value={name} onChange={(e) => setName(e.target.value)} /></label><label className="field"><span>{t("rsvp.phone")} <small>{t("common.optional")}</small></span><input type="tel" name="phone" autoComplete="tel" inputMode="tel" placeholder={t("rsvp.phonePlaceholder")} maxLength={25} value={phone} onChange={(e) => setPhone(e.target.value)} /></label></div>
      <fieldset><legend>{t("rsvp.attend")}</legend><div className="attendance-options">{[{ value: "yes", label: t("rsvp.accept") }, { value: "no", label: t("rsvp.decline") }].map(({ value, label }) => <label key={value} className={`choice ${attending === value ? "checked" : ""}`}><input type="radio" name="attending" value={value} checked={attending === value} onChange={() => setAttending(value as "yes" | "no")} /><span>{label}</span></label>)}</div></fieldset>
      <AnimatePresence initial={false}>{attending === "yes" && <motion.div className="attendance-details" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .3 }}>
        <fieldset><legend>{t("rsvp.whichEvents")}</legend><div className="event-choices">{wedding.events.map((rawEvent) => { const event = localizeEvent(rawEvent, locale); return <label className={`choice ${events.includes(event.id) ? "checked" : ""}`} key={event.id}><input type="checkbox" name="events" value={event.id} checked={events.includes(event.id)} onChange={() => toggleEvent(event.id)} /><span>{event.title}</span><small>{event.shortDate}</small></label>; })}</div></fieldset>
        <div className="guest-field"><div><span id="guest-label">{t("rsvp.partySize")}</span><small>{t("rsvp.includingYou")}</small></div><div className="guest-stepper" role="group" aria-labelledby="guest-label"><button type="button" className="icon-button" onClick={() => setGuests(Math.max(1, guests - 1))} disabled={guests === 1} aria-label={t("rsvp.removeGuest")}><Icon name="minus" /></button><output aria-live="polite">{number(guests)}</output><button type="button" className="icon-button" onClick={() => setGuests(Math.min(10, guests + 1))} disabled={guests === 10} aria-label={t("rsvp.addGuest")}><Icon name="plus" /></button></div></div>
      </motion.div>}</AnimatePresence>
      <label className="field"><span>{t("rsvp.note")} <small>{t("common.optional")}</small></span><textarea name="note" rows={3} placeholder={t("rsvp.notePlaceholder")} maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} /></label>
      <div className="honeypot" aria-hidden="true"><label>{t("rsvp.leaveEmpty")}<input name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label></div>
      {error && <p role="alert" ref={errorRef} tabIndex={-1} className="form-error">{localizeError(error, locale)}</p>}
      <button className="button button-primary rsvp-submit" type="submit" disabled={pending} aria-busy={pending}>{pending ? <><span className="spinner" /> {t("rsvp.saving")}</> : <>{t("rsvp.send")} <Icon name="heart" /></>}</button><p className="form-footnote">{t(side === "bride" ? "rsvp.footnoteBride" : "rsvp.footnoteGroom")}</p>
    </motion.form>}</AnimatePresence>
    <PatternBorder />
  </div>;
}
