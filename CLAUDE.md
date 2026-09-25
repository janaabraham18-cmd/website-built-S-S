# Working on this site

## Test the full device range, not just mobile + one desktop size

The client views this site two ways that sit at opposite ends of the
screen-size spectrum: a TV used as a monitor (very wide, e.g. 1920–2560px+)
and a laptop in meetings (commonly 1280–1440px, sometimes narrower if the
browser window isn't maximized). Both count as "desktop" but can render very
differently. When building or changing any layout:

- Check mobile (~375–430px), tablet (~768–900px), laptop (~1024–1440px),
  and a large/TV-size viewport (~1920–2560px) — not just the two extremes.
  Bugs hide in the middle of that range.
- Don't rely on a single viewport-relative unit (`vw`) alone to size
  something that sits next to text — pair it with `clamp()` so it has a
  sane floor, and remember JS that measures actual available width (see
  `setupTourPhotoBleed` in `src/scripts/motion.ts`) can override the CSS
  value at runtime, so test the *rendered* result, not just the CSS.
- In a flex row pairing a fixed-aspect-ratio photo with a variable-height
  text column, use `align-items: flex-start` (or `stretch`, if the photo
  should fill the row), not `center` — `center` looks fine only when both
  children happen to be the same height, and silently misaligns the top
  edges the moment one wraps to more lines than the other. This exact bug
  shipped once on the Tours page (`.tour-reveal__inner` in
  `TourMapJourney.astro`) and only showed up at laptop widths, because
  that's where the description text wrapped more while the photo (sized
  off `vw`) shrank — the two heights diverged just enough to be visible.
- Verify with Playwright at a few widths in that range (1024, 1280, 1440,
  1920 are a reasonable spread) before calling a layout done, the same way
  this codebase already screenshots mobile and one desktop size.

## The one-accent-word-per-heading device

Every real heading sitewide (h1-h4, including dynamic ones like tour/journey
names and journey day titles) gets exactly one word rendered in the accent
orange (`--color-heading-accent`, `.accent-word` class, both in
`src/styles/global.css`) via `hl(text, word)` from `src/utils/text.ts`. This
is the site's deliberate "personal touch" — do this for any new heading
rather than leaving it plain. Selection rules:

- Exactly 2 words → the last word.
- The Journeys day-by-day titles (`src/data/journeys.ts`, `JourneyDay.
  accentWord`) → a place name or a distinctive activity/feature word, never
  the same *kind* of choice two days running within one journey, and never
  the literal same word twice in a row.
- Everything else → whatever's most distinctive/evocative in that specific
  heading. Never a filler word ("and", "the", "a", "day", etc.) — the point
  is a word with real content, not whichever one happens to be short.
- A single-word heading (e.g. a page's own `<h1>Adventures</h1>`) stays
  plain black — pass `''` as `word` (or just render the text with no `hl()`
  call for a static heading) rather than coloring the whole word. The
  accent only reads as "one word picked out of several"; on a single word
  it just looks like the whole heading changed color.

`hl()` only wraps the *first* occurrence of the exact substring passed as
`word`, is used via `set:html` (safe here since every caller passes our own
static/data-driven copy, never user input), needs an exact-case substring
match — pass the word precisely as it appears in the string — and returns
`text` unchanged when `word` is falsy/empty.

## Never put a heading in a card/bubble over a photo

Explicitly banned by the client as "a very AI generic thing to have": a
semi-transparent dark rounded box (`background: rgba(58, 35, 28, 0.72)`,
`border-radius`, `box-shadow`) sitting behind heading/eyebrow/body text on
top of a background photo. Every page used to do this (About Us, every
hero header on Contact/FAQ/Booking/Adventures/Journeys, the Tours combo
section, the Journeys route-map intro) and it's been removed everywhere —
do not reintroduce it on any new section.

Instead, when text needs to sit on a photo: add a separate gradient-scrim
element (a sibling `<div>` after the `__bg` photo layer, e.g.
`.about-block__scrim`, `.adventures-hero__scrim`) with a `linear-gradient`
that darkens only the zone behind the text and clears elsewhere, plus
`text-shadow` on the text itself as backup. Pick the gradient direction to
match where the text sits:
- Text at the top of a photo that continues behind other content below →
  `180deg` (dark at 0%, clearing by ~55-65%) — see `.about-block__scrim`,
  `.contact-page__scrim`, `.faq-page__scrim`, `.booking-page__scrim`,
  `.journeys-map-section__scrim`.
- Text at the bottom of a bottom-aligned hero → `0deg` (dark at 0%,
  clearing by ~80%) — see `.adventures-hero__scrim`.
- Text at the top of a top-aligned hero, where the photo doesn't continue
  behind other content below → `180deg` (dark at 0%, clearing by ~80%,
  flatter than the "photo continues below" case since nothing below needs
  to stay clear) — see `.journeys-hero__scrim` (client asked for this
  hero's heading/copy in the top-left corner specifically).
- Centered text on a photo with opaque content below it (nothing needs
  the photo to stay clear) → a flatter, more uniform wash — see
  `.build-combo__scrim`, `.adventures-closing__scrim`.

This does not apply to genuine functional UI cards (a form panel, the FAQ
accordion items, the combo builder, the route-map canvas+legend panel) —
those keep their card styling. The rule is specifically: no card wrapping
just a heading/eyebrow/body-text block.
