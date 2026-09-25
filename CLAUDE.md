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
