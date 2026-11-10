import { test } from "node:test";
import assert from "node:assert/strict";
import { english, marathi, translate, formatNumber, formatDate, localizeError, parseLocale } from "../src/lib/i18n.ts";
import { coupleNames, eventsForSide, googleCalendarUrl, localizeEvent, weddingDateLabel } from "../src/lib/wedding.ts";
import { rsvpSchema } from "../src/lib/rsvp-schema.ts";
import { randomUUID } from "node:crypto";

test("both languages cover every UI message and preserve interpolation placeholders", () => {
  assert.deepEqual(Object.keys(marathi).sort(), Object.keys(english).sort());
  for (const key of Object.keys(english)) {
    assert.ok(marathi[key].trim(), `Missing Marathi message: ${key}`);
    assert.deepEqual((english[key].match(/\{\w+\}/g) || []).sort(), (marathi[key].match(/\{\w+\}/g) || []).sort(), key);
  }
});

test("formats Marathi dates, numbers, names, and family ordering", () => {
  assert.equal(formatNumber(2027, "mr"), "२०२७");
  assert.match(formatDate("20270128", "mr"), /२८.*जानेवारी.*२०२७/);
  assert.match(weddingDateLabel("mr"), /२८ व २९/);
  assert.deepEqual(coupleNames("bride", "mr"), ["भार्गवी", "अनीश"]);
  assert.deepEqual(coupleNames("groom", "en"), ["Anish", "Bhargavi"]);
  assert.equal(parseLocale("mr"), "mr");
  assert.equal(parseLocale("unknown"), "en");
});

test("localizes both families' ceremony details without changing dates or map destinations", () => {
  for (const side of ["bride", "groom"]) {
    const original = eventsForSide(side)[0];
    const localized = localizeEvent(original, "mr");
    assert.equal(localized.title, "हळदी समारंभ");
    assert.equal(localized.day, "गुरुवार");
    assert.equal(localized.calendarDate, original.calendarDate);
    assert.equal(localized.mapsUrl, original.mapsUrl);
    assert.equal(original.title, "Haldi Ceremony");
    const url = new URL(googleCalendarUrl(original, "mr"));
    assert.match(url.searchParams.get("text"), /अनीश व भार्गवी.*हळदी समारंभ/);
    assert.equal(url.searchParams.get("dates"), "20270128/20270129");
    assert.equal(url.searchParams.get("location"), original.mapsUrl);
  }
});

test("uses configured Marathi timeline entries without mutating English content", () => {
  const original = eventsForSide("bride")[0];
  const custom = { ...original, timeline: [{ title: "Ceremony", time: null, description: "Details", translations: { mr: { title: "हळदीचा सोहळा", description: "कार्यक्रमाचे तपशील" } } }] };
  assert.equal(localizeEvent(custom, "mr").timeline[0].title, "हळदीचा सोहळा");
  assert.equal(localizeEvent(custom, "en").timeline[0].title, "Ceremony");
  assert.equal(custom.timeline[0].title, "Ceremony");
});

test("localizes validation errors in either direction and interpolates messages", () => {
  assert.equal(localizeError(english["error.name"], "mr"), marathi["error.name"]);
  assert.equal(localizeError(marathi["error.name"], "en"), english["error.name"]);
  assert.equal(translate("mr", "rsvp.deadline", { date: "१० जानेवारी" }), "कृपया १० जानेवारी पर्यंत कळवा");
});

test("accepts Marathi RSVP text and normalizes Devanagari phone numbers", () => {
  const result = rsvpSchema.parse({ name: "अनीश पाटील", phone: "+९१ ९८७६५ ४३२१०", side: "groom", attending: "yes", guests: 2, events: ["haldi"], note: "हार्दिक शुभेच्छा!", website: "", receipt: { id: randomUUID(), token: randomUUID() } });
  assert.equal(result.name, "अनीश पाटील");
  assert.equal(result.phone, "+91 98765 43210");
  assert.equal(result.note, "हार्दिक शुभेच्छा!");
});
