# Salt & Sun Tours — Progress Log

A running record of the redesign work on this site, so a session (this one or
a fresh one) can pick up exactly where things left off. Update this file at
the end of each work session rather than letting context live only in chat
history.

**Branch:** `claude/modest-tesla-m7moez`
**Last updated:** 2026-09-17 (same session: tour recategorization, then the Adventures section's card grid replaced with a name-index + large-photo interaction)

---

## Where things stand

The site has a defined visual identity ("Overland") and both the homepage
and the tours page have been rebuilt around it. Nothing below is a plan —
it's all built, committed, and pushed.

## Brand identity — "Overland"

Established across a few sessions of audit + design work, documented in full at:

- **`themes/overland.md`** — the complete token reference (colors, type scale,
  spacing, component specs, anti-patterns) — copy-paste-ready `:root {}` block included.
- **`themes/brand-kit.html`** — the same system as a visual style guide (13 sections:
  logo, color, typography, hierarchy, spacing, borders, buttons, cards, badges, nav,
  voice, do's/don'ts, motion).
- **`DESIGN-current.md`** — an earlier audit of the *pre-Overland* baseline identity,
  kept for reference/contrast.

**Quick summary:**
- **Colors:** warm terracotta→ochre on a sand-white base. Primary `#9c4d33`,
  secondary/ochre `#d3a24f`, sand base `#fbf7f1`, earth text `#3a231c`. One hue
  family only — no second chromatic color anywhere except `--color-error` (form
  validation only, never decorative).
- **Type:** Libre Bodoni (serif, headings, 400 weight only) + Public Sans (body,
  400/600). Tokens: `--font-display`, `--font-display-italic`, `--font-body` in
  `src/styles/global.css`.
- **Radius scale:** 4px / 10px / 18px (`--radius-sm/md/lg`) — no other values.
- **Shadows:** always warm-tinted (`rgba(58,35,28,…)`), never neutral/black.
- **Motion signature:** "assembling" entrances (photo settles from a slight scale,
  copy trails ~150ms behind — see `setupAlternatingRows` in `src/scripts/motion.ts`)
  and a hand-drawn connecting-line motif (`setupProgramThreads`, `setupRouteMap`)
  reviving what used to be an orphaned "constellation lines" effect.
- **Shared CSS utilities** (in `src/styles/global.css`, used by both pages):
  `.photo-frame` (hover scale + scrim on images), `.photo-frame--sm` (smaller
  radius variant), `.book-link` (underlined uppercase text CTA).

## What's been built, in order

1. **Motion audit** — `motion-audits/tour-booking-site-2026-09-16.html`. Found 2
   critical + 2 important issues (orphaned motion code from an earlier homepage
   rewrite, a hero-autoplay pause gap). Both fixed during the "apply it" pass.
2. **Overland brand kit** — see above.
3. **Homepage rebuilt** (`src/pages/index.astro`) around "The Route" content
   structure (plan at `themes/the-route.html`, an expedition-dossier concept).
   Current section order:
   - Hero (unchanged split-photo "NAMIBIA" panel)
   - **The Brief** (`#brief`) — manifesto pull-quote + passport-style vitals stub
     (2 basecamps / 31 experiences / 0 middlemen) + one banner photo
   - **The Route** (`#route`) — interactive map: 5 destinations (Sossusvlei,
     Sandwich Harbour, Etosha, Skeleton Coast, Pelican Point) fanning out from
     the two basecamps. Hover/focus a stop → shared preview panel updates
     (photo/copy/booking link); route lines draw in on scroll
     (`setupRouteMap` in `motion.ts`).
   - **The Itinerary** (`#itinerary`) — the 6 tour rows, now filterable by
     category (Desert/Coastal/Adventure/Wildlife/Culture) with a ticket-stub
     duration badge per photo (`setupItineraryFilter`).
   - **The Logbook** (`#logbook`) — gallery as mixed-ratio masonry with a few
     handwritten-style captions.
   - **Passport Stamps** (`#stamps`) — dark stat band, count-up animation
     (`setupStampCountUp`).
   - **Postcards from the Road** (`#postcards`) — testimonials as a cycling
     postcard stack (`setupPostcards`). **Quotes are still placeholder text** —
     see Open Items.
   - **Before You Go** (`#faq`) — native `<details>/<summary>` accordion, no JS.
   - Closing CTA (existing `Section` component, photo theme, heading reframed
     to "Plan your route").
4. **Tours page restructured** (`src/pages/tours.astro`) — see next section.
5. **Moonlandscape Tour, Cape Cross, and Living Desert Tour moved from
   Adventures to Tours** — recategorized in `src/data/tours.ts` (same move
   already made earlier for the Dolphin & Seal Catamaran Cruise), added to
   `TourMapJourney`'s pin set via `src/data/tourRegions.ts` (erongo group,
   clustered near Swakopmund/inland along the Swakop River valley for the
   first two, further north along the coast for Cape Cross), and given
   `highlightsBySlug` entries in `TourMapJourney.astro`. The self-assembling
   map is fully data-driven off `mapJourney`, so no changes to the map
   component itself were needed. Tours is now 10 entries, Adventures 13
   (31 total unchanged). The tours page's "Wildlife & Culture" adventure
   group lost 3 of its 4 items in this move, so it was folded into "Sky &
   Sea" (renamed "Sky, Sea & Culture") to keep both adventure chapters
   substantial — the page now has 2 adventure chapters instead of 3.

## Tours page — current structure

`TourMapJourney` (the self-assembling map component, `src/components/TourMapJourney.astro`)
is **untouched** per explicit request — it's the site's best existing motion
work and stays as the hero + first section.

Below it, in order:

1. **Orientation strip** (`#how-it-works`) — 3-column "01/02/03" explainer of the
   page's own structure (Signature Tours / Adventures / Combos).
2. **Adventures** (`#adventures`) — redesigned again, away from any card grid
   entirely. Each of the two chapters (*On the Dunes*, *Sky, Sea & Culture* —
   see the recategorization note above for why there are only two) is now a
   compact **name index beside one large shared photo**: picking a name
   (hover, focus, or tap) crossfades a big photo + caption in next to it,
   instead of a wall of same-sized tiles. The first name in each list is
   marked "Most requested" and is what's shown before anyone picks anything.
   Implementation: `setupAdventureIndex()` in `src/scripts/motion.ts`
   (per-group crossfade, ~180ms fade-out/350ms fade-in, `power1.in`/
   `power2.out`, matching Jakub Krehel's "small transitions read as more
   polished than instant" guidance from `design-motion-principles`), plus a
   hand-drawn SVG underline beneath the section heading that draws in on
   scroll (same technique as the itinerary threads and Route lines). The
   section heading itself also picked up a short italic hint line ("Pick a
   name, watch the photo change.") so the interaction isn't a surprise.
   Mobile (<860px) reorders via CSS grid-area so the photo stacks above the
   list (DOM order stays list-then-preview for keyboard/screen-reader
   users). `AdventureCard.astro` is no longer used on this page (still used
   by the standalone `/preview-adventure-cards` page) but every tour still
   has a real "Book this →" link — previously adventures/combos had no
   booking path from the card at all.
   - **Follow-up (same session):** the list of names was too easy to miss
     next to the big photo — confirmed against the live Vercel deployment,
     not just local dev. Fixed by wrapping the list in a visible card
     (surface background, border, shadow) with a bold count label above it
     ("6 activities — tap one to preview").
   - **Follow-up 2 (same session):** each chapter's list now auto-advances
     on its own every 5s (`setInterval` in `setupAdventureIndex`) since a
     first-time visitor has no reason to know the names are clickable.
     Pauses on hover/focus anywhere in that chapter's index+preview block,
     resumes when the pointer/focus leaves — but a click (or Enter/Space on
     a focused name) stops it for good, handing control to the visitor.
     Skipped entirely under `prefers-reduced-motion: reduce`, matching the
     hero panel and postcard slideshows elsewhere on the site.
3. **Combos** (`#combos`) — `ComboCard.astro` component: each combo visibly
   shows its actual paired tours/adventures (photo + name per half, joined by
   a "+"), driven by a `pairs: string[]` field added to the 8 combo entries
   in `src/data/tours.ts` (inferred from each combo's own description/note,
   documented inline as such — the source rate sheet has no structural link
   between a combo and its components). Cards also now show an "Includes"
   line (previously data that existed but wasn't rendered here), and the
   "Combo deal" tag was reworded to "Two in one day" — dropping the
   deal/savings framing per the next section.
4. **Create Your Own Combo** (`#build-your-own`) — replaces the old plain
   "Build Your Own" CTA band with a real interactive combo builder, built
   after explicit direction that combos should foreground *freedom of
   choice*, not cost-effectiveness. `categoryLabels.combo` (`src/data/tours.ts`)
   was reworded the same way ("Combo deals" → "Combos", description → "Two
   experiences, one day — or design something entirely your own"). The
   builder: a chip picker spanning every Tour and Adventure (not existing
   combos — combining a combo doesn't make sense), grouped under "Tours"/
   "Adventures" labels; clicking a chip toggles it into a running,
   order-preserving selection; a live preview assembles the picks as
   photo+name pairs joined by "+" (same visual language as `ComboCard`, but
   built from a fixed pool of 8 pre-rendered `hidden` slots that JS
   shows/fills rather than creating new DOM — the scoped-CSS-on-client-
   created-elements pitfall documented below bit us once already this
   session on the itinerary thread lines, not worth repeating). A status
   line ("Pick at least 2…" / "N experiences selected — ready to book") is
   `role="status" aria-live="polite"`. Once 2+ are picked, "Book my combo"
   becomes a real link to `/booking?custom=<names joined by " + ">`.
   `BookingForm.astro` gained a standing "Custom combo (see message below)"
   option and a second deep-link branch (alongside the existing `?tour=`
   one) that reads `?custom=`, selects that option, and pre-fills the
   message textarea — verified end-to-end with Playwright (builder selects
   → CTA href → booking page arrives with the right option selected and
   message pre-filled). Implementation: `setupComboBuilder()` in
   `src/scripts/motion.ts`, wired into both `initMotion()` branches.
   - **Real bug hit and fixed while building this:** giving
     `.combo-builder__pair-slot` its own `display: flex` rule overrode the
     browser's default `[hidden] { display: none }` UA rule (equal
     specificity, author stylesheet wins), so all 8 slots showed as empty
     boxes even with nothing selected. Fixed with an explicit
     `.combo-builder__pair-slot[hidden] { display: none; }` rule (higher
     specificity via the attribute selector, so it wins regardless of
     source order). Worth remembering for any future `hidden`+`display`
     combination on this site.
5. **Closing CTA** band — "Ready to book, or still deciding?"

## Key data model note

`src/data/tours.ts` — `Tour` interface now has an optional `pairs?: string[]`
field (combo entries only), plus a new `tourBySlug(slug)` helper alongside the
existing `toursByCategory(category)`. 31 total entries: 10 `tour`, 13
`adventure`, 8 `combo`. Four entries have been moved from `adventure` to
`tour` since the original rate-sheet transcription (Dolphin & Seal Catamaran
Cruise, then later Moonlandscape Tour, Cape Cross, and Living Desert Tour) —
each move is a proper destination excursion departing from a basecamp, not a
short activity, so it reads better alongside the other Tours. All 10 `tour`
entries have a matching pin in `src/data/tourRegions.ts` and appear in
`TourMapJourney` automatically (it's driven entirely off `mapJourney`).

## Open items / known gaps

Nothing below is broken — these are flagged honestly, not urgent bugs:

- **Placeholder testimonials** — the 3 "Postcards from the Road" quotes on the
  homepage are marked `Placeholder quote — swap in a real review` (same
  convention the old site used). Swap for real guest reviews before full launch.
- **Formspree not wired up** — `src/components/BookingForm.astro:5`,
  `FORMSPREE_ID = 'YOUR_FORM_ID'`. Booking form won't actually submit anywhere
  until a real Formspree endpoint is created and dropped in.
- **Booking form is single-select** — one tour per booking submission. A combo
  can be booked as one line item (it's in the dropdown), but two separate
  non-combo experiences can't be booked together in one submission except via
  the free-text message field. Not changed this round — flagged as a possible
  future upgrade if "combine your own itinerary" should become a literal
  multi-select booking flow rather than a "get in touch" CTA.
- **`src/components/WhyUsSection.astro`** — unused/dead file, not imported
  anywhere. Left alone (out of scope for what was asked); safe to delete
  whenever someone's doing cleanup.
- **Route map geography is stylized**, not literally accurate to real
  lon/lat — same design choice `TourMapJourney`'s pins avoid (those *are*
  real-projected; the homepage's smaller "Route" teaser map is intentionally
  schematic).
- **Sandboxed dev environment can't load `images.unsplash.com`** — org network
  policy blocks it, so screenshots taken during this work show broken image
  icons. This is an environment limitation, not a site bug — confirmed the
  same photos 404 the same way for every section, old and new.

## Where to pick up next

No specific next task is queued — ask the user. Natural candidates based on
open items above: wire up Formspree, replace placeholder testimonials with
real reviews, or a similar structural pass on `/booking` or `/contact` to
match the Overland identity (they haven't been touched yet and likely still
carry the pre-Overland look).

## Useful references for a fresh session

- `themes/overland.md` — read this first for any visual/component work.
- `themes/the-route.html` (homepage) and this file's "Tours page" section
  above — the content-structure rationale, so new sections stay consistent
  with *why* things are organized this way, not just *how*.
- `src/scripts/motion.ts` — every animation on the site lives here, with
  comments explaining intent. Always add a `prefers-reduced-motion` branch
  for any new scroll-triggered effect — the whole file holds this line
  strictly and it's part of the established quality bar.
- Screenshot verification pattern used throughout: local `astro dev`,
  Playwright with `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, and
  **real `page.mouse.wheel()` calls with ~150-200ms settle time between
  ticks** (not `scrollIntoView` or instant `window.scrollTo`) — this site
  uses Lenis smooth-scroll + GSAP ScrollTrigger, and anything else fails to
  trigger reveals/pins reliably in headless testing.
