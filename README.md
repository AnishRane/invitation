# Anish & Bhargavi

A Next.js wedding invitation rebuilt from `Anish & Bhargavi Wedding Site.html`. The original mock is preserved. Its original English fonts and SVG motifs are served locally, with the font licenses in `public/fonts/LICENSE.txt`.

## Run locally

Use Node.js 22.13 or newer.

```sh
npm install
npm run dev
```

Open **http://localhost:3000**.

```sh
npm run typecheck
npm test
npm run build
npm start
```

## Invitation flow

- `/en` or `/mr` — English or Marathi sealed invitation on every visit, refresh, and hard refresh. Tap the monogram seal to open it.
- `/en/family` or `/mr/family` — choose the bride’s or groom’s family; the selection is remembered on that browser.
- `/en/celebrations?side=bride` or `/mr/celebrations?side=groom` — personalized name order, countdown, events, venue details, Google Calendar links, and RSVP. Either family is available in either language.

Share `https://your-domain.com/en` for English or `https://your-domain.com/mr` for Marathi. Existing unprefixed page URLs redirect to the remembered language, defaulting to English for new guests. API endpoints and public assets retain their existing root URLs.

Layouts use fluid widths and typography, with adjustments at 374, 767, and 1023 pixels. Narrow phones and short landscape screens can scroll naturally. Navigation uses native scrolling. Motion uses transforms and opacity, spring interactions, and once-only section reveals. The countdown pauses while its tab is hidden. System reduced-motion preferences disable decorative movement and smooth scrolling.

The shared toran alternates warm marigold-gold and rose blossoms, with layered petals, deeper centers, gold beads, and fresh olive-green mango leaves. Its accent palette is scoped to the garland to complement the soft invitation backgrounds. The repeating SVG artwork keeps the same height and joins across both animated halves on every page, including the inverted footer garland.

The countdown targets the wedding muhurat: **29 January 2027, 12:18 PM IST** (`2027-01-29T12:18:00+05:30`). The target date and time are displayed in both languages and use India’s time zone regardless of the guest’s location. The wedding ceremony details show this confirmed time; Haldi timings remain unconfirmed.

The directions dialog uses native modal focus trapping, Escape dismissal, and focus restoration. Form fields have labels, touch targets, and submission feedback. Mobile inputs use 16px text to avoid automatic zoom on iOS.

## English and Marathi

Use the small globe and alternate language name (**मराठी** or **English**) in the bottom-right corner of every page. Inside ceremony booklets, it shares the timeline page’s bottom row with the page number, so both page backgrounds extend to the booklet’s edge without an extra footer strip. Venue dialogs place it at the bottom right after the content. Switching languages updates the existing view, including open booklets and form feedback, without clearing the family choice or an in-progress RSVP.

The control uses muted text with a 44px touch target, keyboard focus outline, and a descriptive tooltip. The page control has a faint paper backing for legibility; extra bottom spacing keeps the end of the page accessible. Dialog controls sit in the content flow to avoid covering actions, and the page control stays behind native modal dialogs. Placement respects device safe areas.

A `wedding-language` cookie remembers the choice for a year. The URL language takes priority over this cookie, so a shared English or Marathi link always opens in that language, including the initial server-rendered content, document language, and metadata. Switching languages changes the URL while keeping the current page, family query, section, open booklet, and in-progress RSVP. The homepage still starts with the sealed invitation in either language.

Marathi copy lives alongside English in `src/lib/i18n.ts`. Dates, countdowns, and guest counts use Devanagari numerals. Names, initials, ceremony titles, and the celebrations heading use the supplied **AMS Tushar** font as locally generated vector lettering. Paragraphs, navigation, forms, and other text use Mukta from Google Fonts with system Devanagari fallbacks. Google Calendar drafts use the selected language while retaining the same dates and family-specific map destinations. Marathi names and notes are accepted by RSVP, and Devanagari phone digits are normalized for storage.

AMS Tushar’s legacy encoding is handled only when generating the lettering assets; Unicode text remains accessible in the page. See `docs/font-review.md` for the rendered proof, source mapping, and regeneration command. Unrecognized or newly customized text safely uses the Unicode font until its lettering is added.

For custom ceremony descriptions or timeline entries, add `translations: { mr: { title: "…", description: "…", time: "…" } }` alongside the English content. An event can also provide its own Marathi `venue`, `address`, or entire `timeline` under `translations.mr`. Keep real addresses and map URLs accurate in both languages.

## Update wedding details

Edit **`src/lib/wedding.ts`** for the couple’s names, dates, RSVP deadline, and each event’s time, venue, and address. Unconfirmed details are intentionally displayed as coming soon; Google Maps is offered when a confirmed map link or address exists. “Save the date” opens a prefilled Google Calendar event in a new tab for the guest to review and save. Calendar drafts remain all-day save-the-date reminders, with confirmed ceremony times included in the description. Existing `/api/calendar/[event]` links also redirect to Google Calendar.

Family-specific venue details live in `eventDetailsByFamily` in the same file. The bride’s and groom’s Haldi ceremonies each use their respective supplied Google Maps links. Both families share the confirmed wedding location: https://maps.app.goo.gl/PspSdBakpxtFuPzt7. The wedding cards, booklets, venue section, directions dialog, and Google Calendar drafts all use this shared event record. A confirmed map link works without a written venue name or address; add those to the event once available. Calendar endpoint links accept `?side=bride` or `?side=groom`.

## Ceremony booklets

Tap anywhere on a Haldi or wedding cover to open its booklet. A hinged cover reveals ceremony details and the event timeline, arranged as two pages on desktop and a scrollable column on phones. The booklet supports keyboard activation, Escape dismissal, focus trapping/restoration, and reduced motion. Directions and Google Calendar links are inside the booklet.

Layered paper edges suggest that each card is a booklet without visible instructions. On mouse hover or keyboard focus, its cover opens slightly along the left spine to reveal a glimpse of the page beneath. Touch screens retain the static page edges. Reduced-motion settings disable the preview movement. The entire cover remains clickable, with an explicit opening label for screen readers and a visible keyboard focus outline.

Haldi cards use turmeric-yellow washes. Wedding cards use soft rose washes, rose petals, and antique-gold foliage. Each theme continues through the opening cover and ceremony details page, with decorative SVG artwork kept behind the text.

Add the confirmed running order to each event’s `timeline` array in `src/lib/wedding.ts`. Each entry takes `title`, `time` (or `null` while unconfirmed), and an optional `description`. Family-specific Haldi timelines can override this array in `eventDetailsByFamily`. Empty timelines show the ceremony itself and a notice that the full running order is coming soon.

```ts
timeline: [
  { title: "Ceremony", time: null, description: "Add the confirmed details here." },
]
```

## RSVP storage

`POST /api/rsvp` validates responses on the server and appends them to **`.data/rsvps.jsonl`**. An edit adds a new entry with the same ID; the latest entry per ID is the current response. A receipt stored in the guest’s browser authorizes edits; raw receipt tokens are never stored on the server. Personal form fields are not persisted in browser storage. Success is shown only after the server saves the response.

This adapter is intended for local development or **one Node.js server with persistent disk**. For self-hosting, set `RSVP_DATA_DIR` to a private persistent volume and back it up. Before using a serverless host or multiple server instances, replace `src/lib/rsvp-store.ts` with a shared database adapter. The current app does not send email or WhatsApp notifications and has no organizer dashboard.

## Verification

Run the production build, TypeScript check, and automated tests using the commands above. Tests cover language route selection and redirects, translation completeness, interpolation, Marathi dates and numbers, family-specific map and calendar links, custom timelines, Marathi RSVP text, validation, authenticated edits, secret handling, and concurrent saves.

Browser verification could not run in the build sandbox: starting the local server was denied with `listen EPERM`. Before sharing the invitation, check the complete flow at 320, 390, 768, 1024, and 1440px, including a short landscape viewport. Check keyboard navigation, dialog dismissal and focus restoration, reduced motion, RSVP acceptance and decline, editing, and offline submission errors. Safari and actual-device animation performance still need review.
