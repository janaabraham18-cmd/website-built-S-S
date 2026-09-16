---
version: alpha
name: Ochre Trail
description: Salt & Sun Tours' current identity — a warm, photo-forward desert/coast palette layered over a light sand base, as implemented today across the Astro site.
colors:
  primary: "#9c4d33"
  secondary: "#d3a24f"
  tertiary: "#b5623f"
  neutral: "#fbf7f1"
  neutral-alt: "#f6ede1"
  border: "#e3cba7"
  surface: "#ffffff"
  on-surface: "#3a231c"
  on-surface-muted: "#6b3a2c"
  on-dark: "#fbf7f1"
  dark-surface: "#3a231c"
typography:
  display-lg:
    fontFamily: Georgia, "Times New Roman", "Iowan Old Style", serif
    fontSize: 3.6rem
    fontWeight: 400
    lineHeight: 1.1
  display-md:
    fontFamily: Georgia, "Times New Roman", "Iowan Old Style", serif
    fontSize: 2.6rem
    fontWeight: 400
    lineHeight: 1.1
  display-italic:
    fontFamily: "Playfair Display", Georgia, serif
    fontSize: 1.9rem
    fontWeight: 600
    lineHeight: 1.1
  headline-sm:
    fontFamily: Georgia, "Times New Roman", "Iowan Old Style", serif
    fontSize: 1.4rem
    fontWeight: 400
    lineHeight: 1.1
  body-lg:
    fontFamily: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
    fontSize: 1.15rem
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  label-caps:
    fontFamily: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
    fontSize: 0.9rem
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: 0.05em
  caption:
    fontFamily: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
    fontSize: 0.8rem
    fontWeight: 400
    lineHeight: 1.3
rounded:
  none: 0px
  sm: 4px
  md: 10px
  lg: 18px
spacing:
  3xs: 4px
  2xs: 8px
  xs: 12px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  2xl: 96px
  3xl: 144px
  container: 1180px
  container-narrow: 720px
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.md}"
    padding: "16px 40px"
  button-outline:
    backgroundColor: transparent
    textColor: currentColor
    rounded: "{rounded.md}"
    padding: "16px 40px"
  card-photo:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.lg}"
  header-bar:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
  footer-band:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.on-dark}"
---

## Overview

Ochre Trail is a warm, editorial travel-brochure identity built for a two-basecamp Namibian tour operator (Swakopmund/Walvis Bay — desert and coast). The register is unhurried and photo-led: serif display headlines pair with a plain system sans for body copy, generous whitespace (spacing tops out at 144px between major sections), and every section is anchored by a full-bleed or large-format photograph rather than icons or illustration. The emotional target is "warm, trustworthy, lived-in local guide" — not slick startup, not budget-tour-bus. Color does the branding work: a single terracotta/ochre accent family recurs across buttons, eyebrows, and hover states against a soft sand-white base, so the page reads as one continuous warm gradient from top to bottom rather than hard-edged blocks.

The system is not fully consistent today. It was built up section-by-section over multiple passes, and at least one recent addition (the About/Gallery/Tour Programs block) was authored with hardcoded hex values instead of the shared CSS custom properties, and at a different corner radius (2px vs. the site's 4/10/18px scale) — see Do's and Don'ts.

## Colors

The palette is a single warm hue family (terracotta → ochre) stretched across a sand-white base, with a dark earth tone reserved for high-contrast bands (Footer, photo overlays, Hero).

- **Primary (#9c4d33 — "Terracotta Strong"):** The workhorse accent — headline eyebrows, link hovers, active states. Used wherever the design needs to say "look here" without shouting.
- **Secondary (#d3a24f — "Ochre"):** A lighter, warmer accent used in gradients (`--gradient-warm`) and as the glow behind the page background. Softer and more decorative than primary; rarely carries text.
- **Tertiary (#b5623f — "Terracotta"):** The base accent color (`--color-accent`) — primary-button fills, focus rings, borders on interactive elements.
- **Neutral (#fbf7f1 — "Sand"):** The page's base background (`--color-bg`), used almost everywhere as the canvas color.
- **Surface (#ffffff):** Pure white, used sparingly — form fields, and now the About/Gallery/Program block's background.
- **On-surface (#3a231c — "Earth"):** Primary text color and the site's one "dark" surface color (Footer background, photo-overlay-strong endpoints).
- **On-surface-muted (#6b3a2c):** Body copy in a muted register — the color most paragraph text actually renders in.
- **Border (#e3cba7 — "Beige"):** Hairline borders, form-field outlines.

## Typography

Two families carry the whole system: a serif (Georgia, falling back to Times/Iowan) for anything that needs weight and warmth, and a plain system sans for anything that needs to be read quickly. A third, Playfair Display (italic, semi-bold), is reserved for a handful of "special occasion" headings — the closing CTA card's `Plan your journey`.

- **Display (36–58px, serif, regular weight):** Section titles and the Hero's giant split-letter treatment. Never bold — the serif's natural warmth carries the weight instead of font-weight.
- **Headline (22–24px, serif):** Sub-headings inside a section (About row headings, tour program headings).
- **Body (15–18px, system sans):** All paragraph copy. Line-height 1.6–1.7 throughout — generous, brochure-like.
- **Label/eyebrow (13–14px, sans, uppercase, 600 weight, wide tracking):** The one recurring "shout" element — every section has an uppercase eyebrow in the accent color above its heading.
- **Caption (11–13px):** Photo-credit lines, footer legal text.

## Layout

A single centered container (1180px max-width, 720px for narrow/prose blocks) repeats down the page — no sidebar, no asymmetric grid at the page level. Section rhythm is vertical and generous: `--space-2xl` (96px) is the default section padding-block, sometimes tightened to 64px, occasionally stretched to 144px around scroll-jacked moments (the tours-teaser pinned slider). Inside a section, content is either a centered narrow intro (eyebrow + heading, max 720px, always centered) followed by a full-width grid/row layout, or a two-column 1fr/1fr row that alternates left/right on successive rows (About, Tour Programs) — the site's signature "alternating editorial row" pattern, seen in at least three different sections.

## Elevation & Depth

The system is mostly flat — depth comes from photography and color, not shadow. Where shadow exists, it's a warm-tinted, low-contrast one (`rgba(58,35,28, 0.08–0.22)`, never pure black) so it reads as "soft light" rather than "UI chrome." The one recurring elevation trick is glassmorphism: the sticky header and the closing CTA card both use `backdrop-filter: blur(8px)` over a translucent sand or cream fill — a floating-glass-over-photo effect used exactly twice, in the two places something needs to sit on top of an image and still feel light.

## Shapes

Corners are consistently soft but never fully rounded: 4px on small chips/inputs, 10px on cards and buttons, 18px on large photo cards (AdventureCard, TourCard media). Circles appear only for true circular elements — the footer's social icons, the (now-removed) philosophy photo cluster. The new About/Gallery/Tour-Programs images break this scale with a near-sharp 2px radius, which reads as a different, colder design decision next to the 10–18px radius used everywhere else on the page.

## Components

- **Buttons:** `btn-primary` uses the warm gradient (terracotta → ochre) fill with cream text and a soft warm shadow; `btn-outline` is transparent with a `currentColor` border. Both are uppercase, medium-weight, generously padded (16px/40px), never small.
- **Photo cards (AdventureCard/TourCard):** Full-bleed photo, a two-layer scrim (soft + strong gradient) for text legibility, content pinned to the bottom edge, 18px radius. This is the site's dominant "unit of content" — most tours are represented this way.
- **Header:** Sticky, translucent sand-cream fill with a soft ochre glow at the top edge, blurred backdrop. Always light, regardless of what's scrolling underneath it.
- **Footer:** The one section that is unconditionally dark (earth-900 fill, cream text) — three-column layout (brand/nav/contact), circular social icons with a hover-to-ochre state.
- **Alternating editorial row:** photo (or photo pair) + copy block, two-column, flipping order every other instance. Used in About and Tour Programs; a lighter-weight version (single image + caption) drives the Gallery grid.

## Do's and Don'ts

- Do keep every accent color traceable to the terracotta/ochre family — a second hue (blue, green) has never appeared and would break the "single warm gradient" read.
- Do write eyebrows in uppercase, accent-colored, 600-weight, above every section heading — it's the one consistent wayfinding device on the page.
- Do use the serif for anything that needs warmth (headings) and the sans for anything that needs speed (body, labels) — never mix the two roles.
- Don't introduce a new corner radius outside the 4/10/18px scale — the new sections' 2px images are already an inconsistency to fix, not a precedent to extend.
- Don't hardcode hex colors in a new component — every color used elsewhere in the system exists as a CSS custom property in `global.css`; the new sections' literal `#2b1b12`/`#6b3a2c`/`#b15a34` values should be tokenized back to `var(--color-*)` equivalents.
- Don't add a shadow with pure black — depth is always warm-tinted (`rgba(58,35,28,…)`).
- Don't center text outside of section intros — body/copy blocks are always left-aligned, even when their container is centered.
