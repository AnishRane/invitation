import { formatDate, formatNumber, translate, type Locale } from "./i18n.ts";

export type FamilySide = "bride" | "groom";
export type EventId = "haldi" | "wedding";

export interface EventTimelineEntry {
  title: string;
  time: string | null;
  description?: string;
  translations?: Partial<Record<Locale, { title?: string; time?: string | null; description?: string }>>;
}

export interface WeddingEvent {
  id: EventId;
  title: string;
  day: string;
  date: string;
  shortDate: string;
  calendarDate: string;
  description: string;
  time: string | null;
  venue: string | null;
  address: string | null;
  mapsUrl?: string;
  timeline?: EventTimelineEntry[];
  translations?: Partial<Record<Locale, { title?: string; description?: string; time?: string | null; venue?: string | null; address?: string | null; timeline?: EventTimelineEntry[] }>>;
}

type FamilyEventDetails = Partial<Pick<WeddingEvent, "venue" | "address" | "mapsUrl" | "timeline">>;

const eventDetailsByFamily: Record<FamilySide, Partial<Record<EventId, FamilyEventDetails>>> = {
  bride: {
    haldi: {
      venue: "Bride’s Haldi venue",
      mapsUrl: "https://maps.app.goo.gl/cKBq8HpMbZVHQqT19",
    },
  },
  groom: {
    haldi: {
      venue: "Groom’s Haldi venue",
      mapsUrl: "https://maps.app.goo.gl/BfgygFdgmvVqiMTU7",
    },
  },
};

// Keep invitation details here. Unconfirmed details remain explicit throughout the app.
export const wedding = {
  groom: "Anish",
  bride: "Bhargavi",
  dateLabel: "28 & 29 January 2027",
  countdownTo: "2027-01-29T12:18:00+05:30",
  rsvpDeadline: null as string | null,
  eventDetailsByFamily,
  events: [
    {
      id: "haldi",
      title: "Haldi Ceremony",
      day: "Thursday",
      date: "28 January 2027",
      shortDate: "28 JAN",
      calendarDate: "20270128",
      description: "A little turmeric, a lot of laughter, and the people we love. Let the celebrations begin.",
      time: null,
      venue: null,
      address: null,
      timeline: [] as EventTimelineEntry[],
    },
    {
      id: "wedding",
      title: "Wedding Ceremony",
      day: "Friday",
      date: "29 January 2027",
      shortDate: "29 JAN",
      calendarDate: "20270129",
      description: "With your blessings, we begin our forever. Join us for the moment that brings two families together.",
      time: "12:18 PM IST",
      translations: { mr: { time: "दुपारी १२:१८ वाजता (भारतीय प्रमाणवेळ)", venue: "विवाहस्थळ" } },
      venue: "Wedding venue",
      address: null,
      mapsUrl: "https://maps.app.goo.gl/PspSdBakpxtFuPzt7",
      timeline: [] as EventTimelineEntry[],
    },
  ] satisfies WeddingEvent[],
};

export function eventsForSide(side: FamilySide): WeddingEvent[] {
  return wedding.events.map((event) => ({ ...event, ...wedding.eventDetailsByFamily[side][event.id] }));
}

export function coupleNames(side: FamilySide = "groom", locale: Locale = "en") {
  const groom = locale === "mr" ? translate(locale, "common.groom") : wedding.groom;
  const bride = locale === "mr" ? translate(locale, "common.bride") : wedding.bride;
  return side === "bride"
    ? [bride, groom]
    : [groom, bride];
}

export function weddingDateLabel(locale: Locale) {
  if (locale === "en") return wedding.dateLabel;
  return `${formatNumber(wedding.events[0].calendarDate.slice(6), locale)} ${translate(locale, "common.and")} ${formatDate(wedding.events[1].calendarDate, locale)}`;
}

export function localizeEvent(event: WeddingEvent, locale: Locale): WeddingEvent {
  const custom = event.translations?.[locale];
  const timeline = (custom?.timeline || event.timeline)?.map((entry) => ({ ...entry, ...entry.translations?.[locale] }));
  if (locale === "en") return { ...event, ...custom, timeline };
  const venue = event.venue === "Bride’s Haldi venue" ? translate(locale, "event.brideHaldiVenue") : event.venue === "Groom’s Haldi venue" ? translate(locale, "event.groomHaldiVenue") : event.venue;
  return {
    ...event,
    title: translate(locale, event.id === "haldi" ? "event.haldi" : "event.wedding"),
    description: translate(locale, event.id === "haldi" ? "event.haldiDescription" : "event.weddingDescription"),
    venue,
    ...custom,
    date: formatDate(event.calendarDate, locale),
    shortDate: formatDate(event.calendarDate, locale, { day: "numeric", month: "short" }),
    day: formatDate(event.calendarDate, locale, { weekday: "long" }),
    timeline,
  };
}

export function directionsUrl(address: string | null) {
  return address?.trim()
    ? `https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=${encodeURIComponent(address.trim())}`
    : null;
}

export function googleCalendarUrl(event: WeddingEvent, locale: Locale = "en") {
  event = localizeEvent(event, locale);
  const t = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values);
  const [groom, bride] = coupleNames("groom", locale);
  const year = Number(event.calendarDate.slice(0, 4));
  const month = Number(event.calendarDate.slice(4, 6)) - 1;
  const day = Number(event.calendarDate.slice(6, 8));
  // An all-day event ends exclusively on the following date.
  const end = new Date(Date.UTC(year, month, day + 1)).toISOString().slice(0, 10).replaceAll("-", "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${groom} ${t("common.and")} ${bride} — ${event.title}`,
    dates: `${event.calendarDate}/${end}`,
    stz: "Asia/Kolkata",
    etz: "Asia/Kolkata",
    hl: locale,
    details: `${event.description}\n\n${t("calendar.reminder")} ${event.time ? t("calendar.time", { time: event.time }) : t("calendar.timePending")}${event.venue || event.address || event.mapsUrl ? "" : ` ${t("calendar.venuePending")}`}${event.mapsUrl ? `\n\n${t("calendar.maps")}: ${event.mapsUrl}` : ""}`,
  });
  const location = event.address ? [event.venue, event.address].filter(Boolean).join(", ") : event.mapsUrl || event.venue;
  if (location) params.set("location", location);
  return `https://calendar.google.com/calendar/r/eventedit?${params.toString()}`;
}

