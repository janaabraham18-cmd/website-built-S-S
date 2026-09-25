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
- A single-word heading (e.g. a page's own `<h1>Adventures</h1>`) just gets
  that whole word colored.

`hl()` only wraps the *first* occurrence of the exact substring passed as
`word`, is used via `set:html` (safe here since every caller passes our own
static/data-driven copy, never user input), and needs an exact-case
substring match — pass the word precisely as it appears in the string.
