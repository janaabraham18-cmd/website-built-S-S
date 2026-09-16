# Salt & Sun Tours: Overland Theme

> **Style Origin:** Evolution of the site's existing warm terracotta/sand identity (see `DESIGN-current.md`), sharpened using the "Nature Distilled" and "Editorial Grid / Magazine" style profiles (ui-ux-pro-max) and the "Magazine Style" (Libre Bodoni + Public Sans) typography pairing. Not a replacement — a more confident version of what's already there.
> **Mood:** Warm · Editorial · Hand-guided
> **Reference HTML:** `themes/brand-kit.html`

## 1. Color System

**Primary palette:**

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#fbf7f1` | Page background (sand-50) |
| `--bg-alt` | `#f6ede1` | Alternate/tinted section background (sand-100) |
| `--surface` | `#ffffff` | Cards, form fields |
| `--text` | `#3a231c` | Primary text, headings (earth-900) |
| `--text-muted` | `#6b3a2c` | Body copy, secondary text (earth-700) |
| `--border` | `#e3cba7` | Hairline borders, dividers (beige-300) |
| `--dark-surface` | `#3a231c` | Footer, photo-overlay endpoints |

**Accent colors:**

| Token | Hex | Usage |
|---|---|---|
| `--accent` | `#9c4d33` | Eyebrows, links, primary CTA fill (terracotta-600) |
| `--accent-mid` | `#b5623f` | Secondary accent, borders on interactive elements (terracotta-500) |
| `--accent-soft` | `#d3a24f` | Gradient endpoint, glow, highlight (ochre-400) |
| `--error` | `#8c2f1f` | Form validation failure only — never decorative |

**Color rules:**

1. Never introduce a second chromatic hue (blue, green, purple) anywhere in the system — the brand is one hue family stretched from terracotta to ochre.
2. `--error` exists solely for real destructive/validation states. It must never appear as a decorative accent, badge, or section background.
3. Shadows are always warm-tinted (`rgba(58,35,28, …)`), never neutral or pure black.
4. A section's background is always `--bg`, `--bg-alt`, `--surface`, or `--dark-surface` — never a new one-off color introduced for a single section (this already happened once and was reverted).
5. Only one primary-accent CTA per viewport — competing terracotta buttons dilute the "single loudest action" rule.

## 2. Typography

**Font stack:**

| Role | Font | Fallback | Weight range |
|---|---|---|---|
| Display | Libre Bodoni | Georgia, "Times New Roman", serif | 400 (headings), 600 italic (rare emphasis) |
| Body | Public Sans | -apple-system, "Segoe UI", sans-serif | 400 (body), 600 (labels/buttons) |
| Mono (optional, data/labels) | Geist Mono | ui-monospace, "SF Mono", monospace | 400–500 |

**Google Fonts import:**

```html
<link href="https://fonts.googleapis.com/css2?family=Libre+Bodoni:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Public+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

**Display font rules:** 400 weight for all headings regardless of size; never bold. Reserve 600-weight italic for one "special occasion" element per page (currently the closing CTA heading). Never set body paragraphs, form labels, or UI chrome in this font.

**Body font rules:** 400 for paragraphs (line-height 1.6–1.7), 600 for eyebrows/labels/buttons — always paired with `text-transform: uppercase` and 0.03–0.12em letter-spacing at that weight. Never use 700 in running body copy.

**Type scale:**

| Element | Font | Size | Weight | Letter-spacing | Line-height | Color |
|---|---|---|---|---|---|---|
| Hero headline | Libre Bodoni | `clamp(2.75rem, 6vw, 5.5rem)` | 400 | normal | 1.1 | `--text` (on photo: `--bg`) |
| Display-lg | Libre Bodoni | 3.6rem | 400 | normal | 1.1 | `--text` |
| Section title | Libre Bodoni | 2.6rem | 400 | normal | 1.1 | `--text`, max-width 700px |
| Row/card title | Libre Bodoni | 1.6rem–2rem | 400 | normal | 1.1 | `--text` |
| Headline-sm | Libre Bodoni | 1.5rem | 400 | normal | 1.1 | `--text` |
| Body-lg | Public Sans | 1.15rem | 400 | normal | 1.6 | `--text-muted` |
| Body | Public Sans | 1rem | 400 | normal | 1.7 | `--text-muted` |
| Eyebrow | Public Sans | 0.8–0.9rem | 600 | 0.12em | 1.1 | `--accent`, uppercase |
| Label/button | Public Sans | 0.85rem | 600 | 0.03em | 1.1 | varies, uppercase |
| Stat number | Libre Bodoni | 2.6rem | 400 | normal | 1.1 | `--accent` (on dark: `--bg`) |
| Caption | Public Sans | 0.8rem | 400 | normal | 1.3 | `--text-muted` |

## 3. Spacing System

| Token | Value | Usage |
|---|---|---|
| `--space-3xs` | 4px | Icon-to-label gaps |
| `--space-2xs` | 8px | Tight inline gaps |
| `--space-xs` | 12px | Chip padding, small gaps |
| `--space-sm` | 16px | Form field padding, card internal gaps |
| `--space-md` | 24px | Container gutter, default row gap |
| `--space-lg` | 40px | Component-to-component spacing |
| `--space-xl` | 64px | Section intro-to-content spacing |
| `--space-2xl` | 96px | Default section padding-block |
| `--space-3xl` | 144px | Max section padding, pinned/scroll-jacked moments |

## 4. Borders & Surfaces

**Border treatments:**

| Type | Spec | Usage |
|---|---|---|
| Hairline | `1px solid var(--border)` | Card outlines, dividers, form fields |
| Accent | `1px solid var(--accent)` | Hover/focus states only |
| Heavy | `2px solid var(--text)` | Reserved, rarely used |

**Border behavior:** never increase border width on hover — hover response is shadow/scale, not border weight. Radius never changes on interaction.

**Surface elevation:**

| Level | Background | Border/Shadow | Trigger |
|---|---|---|---|
| Ground | `--bg` | none | Page base |
| Card | `--surface` | `--shadow-sm` | Resting content block |
| Elevated | `--surface` | `--shadow-md` | Hover/active card, popover |
| Glass | `rgba(251,247,241,0.6)` + `backdrop-filter: blur(8px)` | `--shadow-md` | Header, CTA card — nowhere else |

**Radius scale:** `--radius-sm: 4px` (chips, form fields) · `--radius-md: 10px` (cards, buttons) · `--radius-lg: 18px` (full-bleed photo cards). No fourth value — the 2px radius used on one recent section's photos is an error to fix, not a new tier.

## 5. Component Patterns

### Buttons
- **Primary:** `padding: 14px 32px`, `border-radius: var(--radius-md)`, `background: linear-gradient(135deg, var(--accent-soft) 0%, var(--accent-mid) 55%, var(--accent) 100%)`, text `--bg`, `box-shadow: var(--shadow-md)`. Hover: `box-shadow: var(--shadow-lg)`, `translateY(-2px)`. Focus: `2px solid var(--accent)` outline, 3px offset. Disabled: `opacity: 0.4`, no shadow, `cursor: not-allowed`.
- **Outline:** transparent fill, `border: 1px solid currentColor`, text inherits. Hover: fills to `--dark-surface`.

### Cards (photo-forward)
Full-bleed photo, two-layer scrim (`linear-gradient` soft + strong toward the bottom edge) for text legibility, title pinned to the bottom edge, `--radius-lg`. Hover: `scale(1.02)` + `--shadow-lg`. Featured: `3px solid var(--accent)` outline at 3px offset, spans 2 grid columns.

### Alternating editorial row
Two-column grid (photo/copy), flipping `order` every other instance. Photo entrance: `scale(1.04) → 1`. Copy entrance: `translateY(14px) → 0`, starting ~150ms after the photo. This is the site's signature layout — used for About and Tour Programs, and should stay the template for any future list-of-things section rather than a generic card grid.

### Badges/tags
Eyebrow: no background/border, `--accent` text, uppercase, 0.12em tracking. Category tag: `--accent` text, uppercase, 0.1em tracking, no fill. Duration chip: `--bg-alt` fill, `--radius-sm`, mono or Public Sans.

### Footer
`--dark-surface` background, `--bg` text, 3-column layout (brand/nav/contact), circular social icons with `--accent-soft` hover state.

## 6. Interaction States

| Element | Default | Hover |
|---|---|---|
| Link/eyebrow text | `--text-muted` or `--accent` | `--accent`, underline animates in |
| Primary button | gradient fill, `--shadow-md` | `--shadow-lg`, `translateY(-2px)` |
| Photo card | static | `scale(1.02–1.06)`, scrim deepens |
| Nav link | `--text-muted` | `--accent`, underline scaleX 0→1 |

**Focus:** `outline: 2px solid var(--accent); outline-offset: 3px` on every interactive element — never removed, never replaced with `:focus` alone (must be `:focus-visible`).
**Disabled:** `opacity: 0.4`, `cursor: not-allowed`, no hover transition.
**Loading:** button text swaps to `LOADING…` (Public Sans, same weight/case as resting label).
**Error:** `--error` text + border on the specific field only, inline beneath it — never a top-of-form-only summary.
**Empty:** no section renders with zero items silently; always a fallback message in `--text-muted`.

## 7. Imagery & Icons

- **Icons:** no icon library needed for now — the site uses one custom SVG mark (sun-over-dunes) and otherwise relies on photography and typography for visual interest. If icons are ever added, they must be single-stroke `currentColor` SVGs matching the mark's line weight (1.6px stroke), never filled/multicolor, never emoji.
- **Images:** always full-bleed within their container (`object-fit: cover`), `--radius-lg` on card-shaped photos, `--radius-sm`–`--radius-md` elsewhere — never the 2px near-sharp corner used in one recent section. Every photo carries a visible Unsplash credit line per the site's existing convention.
- **Decorative elements:** the hand-drawn connecting line (`stroke-dashoffset` draw-in between sequential items) is the one recurring decorative motif — no other illustrative/decorative graphics.

## 8. Voice & Copy Style

- **Headlines:** fragment sentences, periods not exclamation marks. *"Two home bases, one stretch of coast and desert."*
- **Eyebrows:** 2–3 word section labels, uppercase. *"Tour Programs"*
- **Body copy:** second-person or first-person-plural "we," specific place names and numbers over vague claims. *"We run every tour out of Swakopmund and Walvis Bay — no call center, no middleman."*
- **CTA buttons:** imperative verb first, states what happens next, never "Learn More"/"Continue." *"Start Booking"*, *"Book this tour"*
- **Trust/FAQ answers:** answer the anxiety directly before any feature claim. *"No call center. Reach out and you'll hear back from someone who actually knows the dunes."*
- **Stat labels:** number leads, no article. *"31 tours, adventures & combos"*, not *"A total of 31…"*

## 9. Layout Principles

- Single centered container (`max-width: 1180px`; `720px` for narrow/prose intros) repeats down the page — no page-level sidebar or asymmetric grid.
- Section rhythm: `--space-2xl` (96px) default padding-block, `--space-xl` (64px) for tighter sections, up to `--space-3xl` (144px) only around a pinned/scroll-jacked moment to give it breathing room.
- Section intro (eyebrow + heading) is always centered, max-width 720px; body content beneath it is always left-aligned, even inside a centered container.
- Responsive breakpoints: 640px (mobile), 860px (alternating rows collapse to single column), 960px (grid collapses).

## 10. Animation & Motion

- **Signature entrance:** alternating rows — photo settles from `scale(1.04)`, copy trails ~150ms behind with a small `translateY` rise. Duration 600–900ms, `power2.out`.
- **Connective motif:** hand-drawn `stroke-dashoffset` line linking sequential items (revives the site's retired constellation effect) — use for the Tour Programs list and any future sequential list.
- **Hover/click feedback:** 150–300ms, never longer — this is the one place Emil's "under 300ms" rule applies directly.
- **Forbidden:** motion invented fresh for a single new section instead of reused/extended from an existing technique; any animation without a `prefers-reduced-motion` fallback that renders the final state directly; animating `width`/`height`/`top`/`left` instead of `transform`.
- **Reduced motion:** every effect must have a matching branch — this codebase already does this rigorously everywhere except it needs backporting to any new entrance work.

## 11. Anti-Patterns

| Don't | Why |
|---|---|
| Introduce a corner radius outside 4/10/18px | Reads as a different, colder design decision (already happened once) |
| Use a neutral/black shadow | Instantly reads as generic UI chrome, not this brand |
| Add a second chromatic hue | Breaks the single-warm-gradient read that ties the whole page together |
| Give a new section its own one-off dark/light theme | Fragments the page into unrelated blocks (the dark-brown section mistake, already reverted) |
| Set body copy in Libre Bodoni | Slows reading, feels precious instead of warm |
| Ship more than one primary-accent CTA per view | Nothing reads as "the" action |
| Build a new entrance animation from scratch for one section | Fragments the motion language instead of extending it |
| Skip the `prefers-reduced-motion` branch on a new effect | The rest of the site holds this line everywhere; one exception erodes trust in the pattern |

## 12. CSS Custom Properties

```css
:root {
  --sand-50: #fbf7f1;
  --sand-100: #f6ede1;
  --sand-200: #eeddc7;
  --beige-300: #e3cba7;
  --ochre-400: #d3a24f;
  --terracotta-500: #b5623f;
  --terracotta-600: #9c4d33;
  --earth-700: #6b3a2c;
  --earth-900: #3a231c;
  --error: #8c2f1f;

  --bg: var(--sand-50);
  --bg-alt: var(--sand-100);
  --surface: #ffffff;
  --text: var(--earth-900);
  --text-muted: var(--earth-700);
  --accent: var(--terracotta-600);
  --accent-mid: var(--terracotta-500);
  --accent-soft: var(--ochre-400);
  --border: var(--beige-300);
  --dark-surface: var(--earth-900);

  --font-display: "Libre Bodoni", Georgia, "Times New Roman", serif;
  --font-body: "Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  --radius-sm: 4px;
  --radius-md: 10px;
  --radius-lg: 18px;

  --shadow-sm: 0 2px 8px rgba(58,35,28,0.08);
  --shadow-md: 0 8px 30px rgba(58,35,28,0.14);
  --shadow-lg: 0 20px 60px rgba(58,35,28,0.22);

  --space-3xs: 4px;  --space-2xs: 8px;  --space-xs: 12px;  --space-sm: 16px;
  --space-md: 24px;  --space-lg: 40px;  --space-xl: 64px;
  --space-2xl: 96px; --space-3xl: 144px;
}
```

## 13. Quick Reference Cheat Sheet

- **Background:** sand-50 base, sand-100 for tinted sections, never a one-off color
- **Accent:** terracotta-600, one hue family only, one primary CTA per view
- **Fonts:** Libre Bodoni (headings, 400 only) + Public Sans (body 400, labels/buttons 600)
- **Borders:** hairline beige-300; accent only on hover/focus
- **Radius:** 4 / 10 / 18px — no exceptions
- **Shadows:** always warm-tinted, never neutral/black
- **Gradients:** one warm terracotta→ochre gradient, used sparingly (buttons, page glow)
- **Buttons:** one primary (gradient) + one outline, nothing else
- **Motion:** assembling entrances + hand-drawn connective lines, 600–900ms narrative / 150–300ms feedback, reduced-motion always
- **Copy:** direct, specific, second-person, imperative CTAs
- **Icons:** none beyond the one brand mark; no emoji, ever
- **Images:** full-bleed, credited, radius from the scale only
