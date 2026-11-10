"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { coupleNames, eventsForSide, wedding, weddingDateLabel, type FamilySide, type WeddingEvent } from "@/lib/wedding";
import { formatDate } from "@/lib/i18n";
import { useLanguage } from "./language-provider";
import { Countdown } from "./countdown";
import { DirectionsDialog } from "./directions-dialog";
import { Icon } from "./icons";
import { Reveal } from "./motion";
import { Divider, Ornament, PatternBorder, Toran } from "./ornaments";
import { RsvpForm } from "./rsvp-form";
import { VenueMap } from "./venue-map";
import { EventBooklet } from "./event-booklet";
import { EventBookletDialog } from "./event-booklet-dialog";
import { AmsTusharText } from "./ams-tushar-text";

export function Celebrations({ side }: { side: FamilySide }) {
  const { locale, t, number, href } = useLanguage();
  const [selectedEvent, setSelectedEvent] = useState<WeddingEvent | null>(null);
  const [bookletEvent, setBookletEvent] = useState<WeddingEvent | null>(null);
  const [active, setActive] = useState("");
  const [first, second] = coupleNames(side, locale);
  const events = eventsForSide(side);
  const weddingEvent = events.find((event) => event.id === "wedding") ?? wedding.events[1];
  const hasWeddingLocation = Boolean(weddingEvent.mapsUrl || weddingEvent.address);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: "-20% 0px -55% 0px", threshold: 0 });
    document.querySelectorAll("section[id]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return <div className="celebrations-page">
    <a className="skip-link" href="#main">{t("nav.skip")}</a>
    <header className="site-header"><div className="header-inner">
      <Link href={href("/")} className="monogram" aria-label={t("nav.home")}><AmsTusharText text={t(side === "bride" ? "common.monogramBride" : "common.monogram")} /></Link>
      <nav aria-label={t("nav.label")}>{(["events", "venue", "rsvp"] as const).map((id) => <a key={id} href={`#${id}`} className={active === id ? "active" : ""} aria-current={active === id ? "location" : undefined}>{t(`nav.${id}`)}<span /></a>)}</nav>
      <Link href={href("/family")} className="header-family">{t(side === "bride" ? "family.withBride" : "family.withGroom")} <Icon name="arrow" /></Link>
    </div><motion.div className="scroll-progress" style={{ scaleX: progress }} /></header>

    <main id="main">
      <section className="celebration-hero" aria-label={t("hero.label")}>
        <Toran />
        <div className="lace-edge lace-left" aria-hidden="true" /><div className="lace-edge lace-right" aria-hidden="true" />
        <div className="hero-inner container">
          <div className="hero-copy"><Reveal><p className="eyebrow">{t("hero.families")}</p><p className="handwritten hero-intro">{t("hero.intro")}</p><h1 className="couple-names"><span><AmsTusharText text={first} /></span><span className="ampersand"><AmsTusharText text={t("common.and")} /></span><span><AmsTusharText text={second} /></span></h1><Divider /><p className="hero-invite">{t("hero.invite")}<br />{t("hero.inviteNext")}</p><a href="#events" className="text-button hero-discover">{t("hero.discover")} <Icon name="down" /></a></Reveal></div>
          <Reveal className="hero-art" delay={.15}><div className="date-medallion"><div className="date-mandala"><Ornament name="mandala" /></div><div className="date-medallion-content"><Ornament name="crest" /><p className="eyebrow">{t("hero.saveDates")}</p><span className="date-numbers">{number(28)}<span>{t("common.and")}</span>{number(29)}</span><p className="date-month">{formatDate(wedding.events[0].calendarDate, locale, { month: "long" })}</p><p className="date-year">{number(2027)}</p><Divider /></div></div></Reveal>
        </div>
        <div className="hero-bottom container"><div className="guest-tag"><span className="status-dot" /><span>{t(side === "bride" ? "family.withBride" : "family.withGroom")}</span><Link href={href("/family")}>{t("common.change")} <Icon name="arrow" /></Link></div><Countdown /></div>
        <PatternBorder className="hero-bottom-border" />
      </section>

      <section id="events" className="events-section section-space container">
        <Reveal className="section-heading"><span className="eyebrow">{t("events.eyebrow")}</span><h2><AmsTusharText text={t("events.heading")} /></h2><p className="section-description">{t("events.description")}<br />{t("events.descriptionNext")}</p><Divider /></Reveal>
        <div className="events-grid">{events.map((event, index) => <Reveal key={event.id} delay={index * .12} className="event-reveal"><EventBooklet event={event} index={index} onOpen={() => setBookletEvent(event)} /></Reveal>)}</div>
      </section>

      <section id="venue" className="venue-section section-space"><div className="container venue-layout">
        <Reveal className="venue-copy"><span className="eyebrow">{t("venue.eyebrow")}</span><h2>{t("venue.heading")}<br /><span className="script">{t("venue.headingScript")}</span></h2><Divider /><p className="section-description">{t("venue.description")}</p><p className="venue-description">{t(hasWeddingLocation ? "venue.confirmed" : "venue.pending")}</p><button type="button" className="button button-outline" onClick={() => setSelectedEvent(weddingEvent)}>{t("venue.details")} <Icon name="arrow" /></button></Reveal>
        <Reveal className="venue-art" delay={.15}><button type="button" className="map-card" onClick={() => setSelectedEvent(weddingEvent)} aria-label={t("venue.detailsLabel")}><span className="map-illustration"><VenueMap /><span className="map-badge"><span className="status-dot" /> {t(hasWeddingLocation ? "common.locationConfirmed" : "venue.coming")}</span></span><span className="map-card-caption"><span>{t("venue.mapCaption")}</span><span className="map-caption-icon"><Icon name="arrow" /></span></span></button><p className="map-note">{t(hasWeddingLocation ? "venue.mapNoteConfirmed" : "venue.mapNote")}</p></Reveal>
      </div></section>

      <section id="rsvp" className="rsvp-section section-space container"><div className="rsvp-layout">
        <Reveal className="rsvp-intro"><Ornament name="crest" className="rsvp-crest" /><span className="eyebrow">{t("rsvp.eyebrow")}</span><h2>{t("rsvp.heading")}<br /><span className="script">{t("rsvp.headingScript")}</span></h2><Divider /><p className="section-description">{t("rsvp.description")}<br />{t("rsvp.descriptionNext")}</p><div className="rsvp-love-note"><Ornament name="mandala" /><p>{t("rsvp.loveOne")}<br />{t("rsvp.loveTwo")}<br /><span>{t("rsvp.loveThree")}</span></p></div></Reveal>
        <Reveal className="rsvp-form-wrap" delay={.1}><RsvpForm side={side} /></Reveal>
      </div></section>
    </main>

    <footer className="site-footer"><PatternBorder /><div className="footer-content"><Ornament name="mandala" /><p className="eyebrow">{t("footer.eyebrow")}</p><p className="footer-names"><AmsTusharText text={first} /> <span className="footer-ampersand"><AmsTusharText text={t("common.and")} /></span> <AmsTusharText text={second} /></p><p className="date-line">{weddingDateLabel(locale)}</p><Divider /><p className="footer-note">{t("footer.note")}</p><a href="#main" className="text-button">{t("footer.back")} <Icon name="arrow" style={{ transform: "rotate(-90deg)" }} /></a></div><Toran className="footer-toran" animated={false} /></footer>
    <AnimatePresence>{selectedEvent && <DirectionsDialog event={selectedEvent} onClose={() => setSelectedEvent(null)} />}</AnimatePresence>
    <AnimatePresence>{bookletEvent && <EventBookletDialog event={bookletEvent} onClose={() => setBookletEvent(null)} />}</AnimatePresence>
  </div>;
}
