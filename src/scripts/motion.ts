import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// Staggered scroll-tied rise/fade for a `.reveal` section and its
// `.reveal-item` children (falls back to animating the section itself
// when it has no marked children). The per-item stagger is capped by a
// total cascade budget so a long list (e.g. 17 tour cards) still fully
// resolves in about a second instead of dragging out linearly with count.
function setupReveals(opts: {
  y: number;
  duration: number;
  ease: string;
  stagger: number;
  maxCascade: number;
}) {
  const sections = gsap.utils.toArray<HTMLElement>('.reveal');

  for (const section of sections) {
    const items = section.querySelectorAll<HTMLElement>('.reveal-item');
    const targets: HTMLElement[] = items.length ? Array.from(items) : [section];
    const perItemStagger = items.length
      ? Math.min(opts.stagger, opts.maxCascade / items.length)
      : 0;

    gsap.set(targets, { opacity: 0, y: opts.y });

    gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration: opts.duration,
      ease: opts.ease,
      stagger: perItemStagger,
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }
}

// Editorial tour rows (TourCard): the info panel slides out from behind
// its image once, on scroll — desktop slides horizontally into its own
// grid column, mobile expands downward instead since there's no second
// column to slide into. Under reduced motion, both fall back to a plain
// opacity fade with no transform.
function setupTourRows(reduceMotion: boolean) {
  const rows = gsap.utils.toArray<HTMLElement>('.tour-row');
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  for (const row of rows) {
    const panel = row.querySelector<HTMLElement>('.tour-row__panel');
    if (!panel) continue;

    if (reduceMotion) {
      gsap.set(panel, { opacity: 0 });
      ScrollTrigger.create({
        trigger: row,
        start: 'top 85%',
        once: true,
        onEnter: () => gsap.to(panel, { opacity: 1, duration: 0.3, ease: 'power1.out' }),
      });
      continue;
    }

    if (isMobile) {
      gsap.set(panel, { height: 0, opacity: 0, overflow: 'hidden' });
      ScrollTrigger.create({
        trigger: row,
        start: 'top 75%',
        once: true,
        onEnter: () =>
          gsap.to(panel, { height: 'auto', opacity: 1, duration: 0.9, ease: 'power2.out' }),
      });
    } else {
      const reverse = row.classList.contains('tour-row--reverse');
      gsap.set(panel, { xPercent: reverse ? 100 : -100 });
      ScrollTrigger.create({
        trigger: row,
        start: 'top 75%',
        once: true,
        onEnter: () => gsap.to(panel, { xPercent: 0, duration: 0.9, ease: 'power2.out' }),
      });
    }
  }
}

// Adventure/combo grid cards: the description dims in over the photo on
// scroll and reverses when scrolled back out — these are meant to be
// browsed quickly, not settled into one at a time like the tour rows.
function setupAdventureCards() {
  const cards = gsap.utils.toArray<HTMLElement>('.adventure-card');

  for (const card of cards) {
    const scrimStrong = card.querySelector<HTMLElement>('.adventure-card__scrim-strong');
    const details = card.querySelector<HTMLElement>('.adventure-card__details');
    if (!scrimStrong || !details) continue;

    gsap.set(scrimStrong, { opacity: 0 });
    gsap.set(details, { opacity: 0, y: 12 });

    const tl = gsap.timeline({ paused: true })
      .to(scrimStrong, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0)
      .to(details, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.05);

    ScrollTrigger.create({
      trigger: card,
      start: 'top 85%',
      end: 'bottom 15%',
      onEnter: () => tl.play(),
      onLeave: () => tl.reverse(),
      onEnterBack: () => tl.play(),
      onLeaveBack: () => tl.reverse(),
    });
  }
}

// The Logbook: a single filmstrip carousel — all 8 landmark photos live
// on one flex track and the track is translated by whole slide-widths,
// so the incoming photo visibly slides in from the side rather than
// cross-fading. The article text beneath swaps instantly with it (all 8
// articles are in the DOM already for no-JS/SEO; JS just toggles which
// one is visible) so the reading pace isn't tied to the photo's slide
// duration. Autoplay advances every 3.5s and pauses on hover/focus so a
// reader who stops to look isn't fighting the timer; reduced motion
// keeps the slide-swap but drops the animated glide to an instant cut.
function setupLogbookSlideshow(reduceMotion: boolean) {
  const root = document.querySelector<HTMLElement>('[data-logbook-slideshow]');
  if (!root) return;

  const track = root.querySelector<HTMLElement>('[data-logbook-track]');
  const slides = root.querySelectorAll<HTMLElement>('[data-logbook-slide]');
  const entries = root.querySelectorAll<HTMLElement>('[data-logbook-entry]');
  const counter = root.querySelector<HTMLElement>('[data-logbook-counter]');
  const prevBtn = root.querySelector<HTMLButtonElement>('[data-logbook-prev]');
  const nextBtn = root.querySelector<HTMLButtonElement>('[data-logbook-next]');
  if (!track || !slides.length || !entries.length) return;

  const total = slides.length;
  let index = 0;
  let timer: ReturnType<typeof setInterval> | null = null;

  function render() {
    const xPercent = -index * (100 / total);
    if (reduceMotion) {
      gsap.set(track, { xPercent });
    } else {
      gsap.to(track, { xPercent, duration: 0.7, ease: 'power3.inOut' });
    }

    entries.forEach((entry, i) => {
      entry.classList.toggle('is-active', i === index);
      entry.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });
    slides.forEach((slide, i) => slide.setAttribute('aria-hidden', i === index ? 'false' : 'true'));
    if (counter) counter.textContent = String(index + 1).padStart(2, '0');
  }

  function goTo(next: number) {
    index = (next + total) % total;
    render();
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function start() {
    if (timer || reduceMotion) return;
    timer = setInterval(() => goTo(index + 1), 3500);
  }

  function restart() {
    stop();
    start();
  }

  prevBtn?.addEventListener('click', () => {
    goTo(index - 1);
    restart();
  });
  nextBtn?.addEventListener('click', () => {
    goTo(index + 1);
    restart();
  });

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);

  render();
  start();
}

// Adventures index: replaces a wall of same-sized cards with a compact
// name list beside one large shared photo per themed group — picking a
// name (hover, focus, or tap) crossfades the photo/caption beside it. The
// page can hold more than one group, so every `[data-adventure-index]`
// root gets its own independent list+preview pair. A short fade-out/in
// (not a straight cut) is deliberate here — Jakub Krehel's guidance that
// even small state changes read as more polished with a brief transition
// than an instant swap — but stays quick since this fires on hover, which
// can happen often in one visit. The exit is shorter than the enter (the
// user's attention is already moving toward the new content).
//
// Each list also auto-advances on its own (a first-time visitor has no
// reason to know the names are clickable otherwise), pausing on
// hover/focus and stopping for good the moment someone actually picks a
// name themselves — from then on it's their choice, not the timer's.
function setupAdventureIndex(reduceMotion: boolean) {
  const roots = document.querySelectorAll<HTMLElement>('[data-adventure-index]');

  for (const root of roots) {
    const items = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-index-item]'));
    const preview = root.querySelector<HTMLElement>('[data-index-preview]');
    if (!items.length || !preview) continue;

    const previewImg = preview.querySelector<HTMLImageElement>('[data-preview-img]');
    const previewDuration = preview.querySelector<HTMLElement>('[data-preview-duration]');
    const previewName = preview.querySelector<HTMLElement>('[data-preview-name]');
    const previewDesc = preview.querySelector<HTMLElement>('[data-preview-desc]');
    const previewCta = preview.querySelector<HTMLAnchorElement>('[data-preview-cta]');
    const previewCredit = preview.querySelector<HTMLElement>('[data-preview-credit]');
    const previewCreditName = preview.querySelector<HTMLAnchorElement>('[data-preview-credit-name]');

    let active = items.find((i) => i.classList.contains('is-active')) ?? items[0];

    const applyContent = (item: HTMLButtonElement) => {
      const { name, duration, desc, img, slug, creditName, creditUsername } = item.dataset;
      if (previewImg && img) {
        previewImg.src = img;
        previewImg.alt = name ?? '';
      }
      if (previewDuration) {
        previewDuration.textContent = duration ?? '';
        previewDuration.hidden = !duration;
      }
      if (previewName && name) previewName.textContent = name;
      if (previewDesc && desc) previewDesc.textContent = desc;
      if (previewCta && slug) previewCta.href = `/booking?tour=${slug}`;
      if (previewCredit) previewCredit.hidden = !creditName;
      if (previewCreditName && creditName && creditUsername) {
        previewCreditName.textContent = creditName;
        previewCreditName.href = `https://unsplash.com/@${creditUsername}?utm_source=salt-and-sun-tours&utm_medium=referral`;
      }
    };

    const activate = (item: HTMLButtonElement) => {
      if (item === active) return;
      active = item;
      items.forEach((i) => {
        const isActive = i === item;
        i.classList.toggle('is-active', isActive);
        i.setAttribute('aria-current', String(isActive));
      });

      if (reduceMotion) {
        applyContent(item);
        return;
      }

      gsap.to(preview, {
        opacity: 0,
        y: 6,
        duration: 0.18,
        ease: 'power1.in',
        onComplete: () => {
          applyContent(item);
          gsap.to(preview, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
        },
      });
    };

    let timer: ReturnType<typeof setInterval> | undefined;
    let stopped = false; // true once a person has picked a name themselves

    const advance = () => {
      const nextIndex = (items.indexOf(active) + 1) % items.length;
      activate(items[nextIndex]);
    };
    const startTimer = () => {
      if (stopped || reduceMotion || items.length < 2) return;
      timer = setInterval(advance, 5000);
    };
    const pauseTimer = () => clearInterval(timer);
    const stopTimer = () => {
      stopped = true;
      clearInterval(timer);
    };

    items.forEach((item) => {
      // Hover/focus only pause (handled at the root below) — someone's
      // mouse can graze a name on its way to the photo without meaning
      // anything. A click (or a keyboard Enter/Space, which fires one too)
      // is the actual "I'm choosing this" signal, so only that permanently
      // hands control to the person and retires the timer for good.
      item.addEventListener('mouseenter', () => activate(item));
      item.addEventListener('focus', () => activate(item));
      item.addEventListener('click', () => {
        activate(item);
        stopTimer();
      });
    });

    startTimer();
    root.addEventListener('mouseenter', pauseTimer);
    root.addEventListener('mouseleave', startTimer);
    root.addEventListener('focusin', pauseTimer);
    root.addEventListener('focusout', startTimer);
  }

  // Hand-drawn underline beneath the Adventures heading, drawn in once on
  // scroll — same technique as the itinerary threads and Route lines above.
  const headingLine = document.querySelector<SVGPathElement>('[data-heading-line] path');
  if (headingLine) {
    const length = headingLine.getTotalLength();

    if (reduceMotion) {
      gsap.set(headingLine, { strokeDasharray: length, strokeDashoffset: 0 });
      return;
    }

    gsap.set(headingLine, { strokeDasharray: length, strokeDashoffset: length });
    ScrollTrigger.create({
      trigger: '#adventures',
      start: 'top 80%',
      once: true,
      onEnter: () => gsap.to(headingLine, { strokeDashoffset: 0, duration: 0.8, ease: 'power1.inOut' }),
    });
  }
}

// "Create Your Own Combo" builder: clicking a chip toggles it in/out of a
// running selection (order-preserving, so the preview reads left-to-right
// in the order things were picked), which fills a fixed pool of
// pre-rendered preview slots — rather than creating new DOM elements for
// each pick, which would silently lose Astro's scoped styles (learned the
// hard way earlier on this page's hand-drawn thread lines: an element
// created after server render never gets the scoped data-astro-cid
// attribute, so scoped CSS never matches it). Toggling chips is a
// frequent, rapid-fire interaction (someone trying a few combinations in a
// row), so per Emil Kowalski's frequency gate it only animates the one
// genuinely new thing each click produces — a slot's first appearance —
// not every content update a reorder causes when an earlier pick is
// removed.
function setupComboBuilder(reduceMotion: boolean) {
  const root = document.querySelector<HTMLElement>('[data-combo-builder]');
  if (!root) return;

  const chips = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-builder-chip]'));
  const slots = Array.from(root.querySelectorAll<HTMLElement>('[data-pair-slot]'));
  const countEl = root.querySelector<HTMLElement>('[data-builder-count]');
  const cta = root.querySelector<HTMLAnchorElement>('[data-builder-cta]');
  if (!chips.length || !slots.length || !cta) return;

  let selected: HTMLButtonElement[] = [];

  const render = () => {
    slots.forEach((slot, i) => {
      const chip = selected[i];
      const wasHidden = slot.hidden;

      if (!chip) {
        slot.hidden = true;
        return;
      }

      slot.hidden = false;
      const img = slot.querySelector<HTMLImageElement>('[data-pair-img]');
      const name = slot.querySelector<HTMLElement>('[data-pair-name]');
      if (img) {
        img.src = chip.dataset.img ?? '';
        img.alt = chip.dataset.name ?? '';
      }
      if (name) name.textContent = chip.dataset.name ?? '';

      if (wasHidden && !reduceMotion) {
        gsap.from(slot, { opacity: 0, scale: 0.92, duration: 0.3, ease: 'power2.out' });
      }
    });

    const n = selected.length;
    if (countEl) {
      const overflow = n > slots.length ? ` (+${n - slots.length} more not shown above)` : '';
      countEl.textContent =
        n === 0
          ? 'Pick at least 2 to build your combo'
          : n === 1
            ? '1 selected — pick at least one more'
            : `${n} experiences selected — ready to book${overflow}`;
    }

    const ready = n >= 2;
    cta.classList.toggle('is-ready', ready);
    cta.setAttribute('aria-disabled', String(!ready));
    cta.href = ready
      ? `/booking?custom=${encodeURIComponent(selected.map((c) => c.dataset.name).join(' + '))}#booking-form`
      : '#';
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const isSelected = chip.classList.toggle('is-selected');
      chip.setAttribute('aria-pressed', String(isSelected));
      selected = isSelected ? [...selected, chip] : selected.filter((c) => c !== chip);
      render();
    });
  });

  cta.addEventListener('click', (e) => {
    if (cta.getAttribute('aria-disabled') === 'true') e.preventDefault();
  });
}

// The Itinerary's filter pills: click toggles which category is shown,
// hiding non-matching tour rows via the `hidden` attribute rather than
// animating them out — a filter change is a direct result of a click, not
// a moment that needs its own motion.
// Gallery page: clicking a category pill shows/hides matching tiles, plus
// an empty-state message for a category that (for now) has nothing in it.
function setupGalleryFilter() {
  const pills = document.querySelectorAll<HTMLButtonElement>('[data-gallery-filter]');
  const items = document.querySelectorAll<HTMLElement>('[data-gallery-item]');
  const empty = document.querySelector<HTMLElement>('[data-gallery-empty]');
  if (!pills.length || !items.length) return;

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.toggle('is-active', p === pill));
      const filter = pill.dataset.galleryFilter;
      let visibleCount = 0;
      items.forEach((item) => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.hidden = !show;
        if (show) visibleCount++;
      });
      if (empty) empty.hidden = visibleCount > 0;
    });
  });
}

// Postcards from the Road: one review visible at a time, cycled with
// prev/next — click-driven UI switching, not scroll motion, so it isn't
// gated behind reduced motion (the crossfade is a plain CSS opacity
// transition on .is-active, same pattern the old testimonials carousel
// used).
function setupPostcards() {
  const root = document.querySelector<HTMLElement>('[data-postcards]');
  if (!root) return;

  const cards = Array.from(root.querySelectorAll<HTMLElement>('.postcard'));
  const prevBtn = root.querySelector<HTMLButtonElement>('[data-postcard-prev]');
  const nextBtn = root.querySelector<HTMLButtonElement>('[data-postcard-next]');
  const counter = root.querySelector<HTMLElement>('[data-postcard-current]');
  if (!cards.length || !prevBtn || !nextBtn) return;

  let index = 0;

  function render() {
    cards.forEach((card, i) => {
      card.classList.toggle('is-active', i === index);
      card.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });
    if (counter) counter.textContent = String(index + 1);
  }

  prevBtn.addEventListener('click', () => {
    index = (index - 1 + cards.length) % cards.length;
    render();
  });

  nextBtn.addEventListener('click', () => {
    index = (index + 1) % cards.length;
    render();
  });
}

// Tours page closing recap: small auto-cycling slideshow through the
// tour photos next to the complete assembled map. Same accessibility
// pattern as the hero panel slideshow below — click a dot to jump
// there directly, pause on hover AND focus (not hover alone, which
// means nothing on touch), respect reduced motion by leaving it on
// slide 1 with no autoplay.
function setupTourRecapSlideshow(reduceMotion: boolean) {
  const root = document.querySelector<HTMLElement>('[data-tour-slideshow]');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-tour-slide]'));
  const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-tour-slideshow-dots] button'));
  if (slides.length < 2) return;

  let index = 0;

  const goTo = (i: number) => {
    index = i;
    slides.forEach((slide, si) => slide.classList.toggle('is-active', si === index));
    dots.forEach((dot, di) => dot.classList.toggle('is-active', di === index));
  };

  dots.forEach((dot) => {
    dot.addEventListener('click', () => goTo(Number(dot.dataset.dot)));
  });

  if (reduceMotion) return;

  let timer: ReturnType<typeof setInterval>;
  const advance = () => goTo((index + 1) % slides.length);
  const start = () => {
    timer = setInterval(advance, 3200);
  };
  const stop = () => clearInterval(timer);

  start();
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);
}

// Tours page intro: the country map's regions and pins fade in on load
// (once) instead of just appearing — the page's opening statement, now
// that it's the map itself rather than a photo. Reduced motion leaves
// the map at its default, fully-opaque CSS state with nothing to animate.
function setupTourIntroMap(reduceMotion: boolean) {
  if (reduceMotion) return;

  const root = document.querySelector<HTMLElement>('[data-tour-intro-map]');
  if (!root) return;

  const regions = Array.from(root.querySelectorAll<SVGPolygonElement>('.namibia-map__region'));
  const pins = Array.from(root.querySelectorAll<SVGGElement>('.namibia-map__pin'));
  if (!regions.length) return;

  gsap.set(regions, { opacity: 0 });
  gsap.set(pins, { opacity: 0 });

  const tl = gsap.timeline({ delay: 0.3 });
  tl.to(regions, { opacity: 1, duration: 0.6, ease: 'power1.out', stagger: 0.02 }).to(
    pins,
    { opacity: 1, duration: 0.4, ease: 'power1.out', stagger: 0.06 },
    '-=0.3'
  );
}

// Tours page photo bleed: each tour section's photo is meant to sit just
// off the actual browser edge (a small, deliberate gutter — not flush
// with it, and not just the edge of its own fairly narrow,
// deeply-nested-in-a-centered-container grid column) — a pure-CSS
// vw-based breakout (`margin-left: calc(50% - 50vw)` and its relatives)
// doesn't reach the true viewport edge from this deep a level of
// nesting, since the percentage in that formula resolves against the
// element's own containing block, not the viewport, confirmed by
// testing the trick in isolation. So instead this measures each photo's
// actual distance from the viewport's left edge and cancels out all but
// TOUR_PHOTO_EDGE_GAP of it with a negative margin, which works
// regardless of nesting because it's based on the real rendered
// position rather than a formula. Skipped below the 900px breakpoint,
// where the photo is meant to sit in normal full-width flow instead
// (see the CSS).
//
// The CSS width (min(46vw, 560px)) is a viewport-relative target, but
// the actual space available beside it isn't purely viewport-relative:
// the map column next to it has its own fixed minimum width (the
// growing map's real pixel dimensions, which don't shrink — its pieces
// are absolutely positioned at fixed coordinates), so at narrower
// desktop widths the sections column gets squeezed by more than the
// viewport shrinking alone would suggest. Below, this also measures the
// row's actual available width each time and caps the photo so the text
// beside it always keeps a readable minimum, rather than trusting a
// vw-based CSS value that has no way to know about that squeeze.
const TOUR_PHOTO_MIN_BODY_WIDTH = 260;
const TOUR_PHOTO_EDGE_GAP = 64;

function setupTourPhotoBleed() {
  const photos = Array.from(document.querySelectorAll<HTMLElement>('.tour-reveal__photo-wrap'));
  if (!photos.length) return;

  const align = () => {
    const isDesktop = window.matchMedia('(min-width: 901px)').matches;

    photos.forEach((photo) => {
      if (!isDesktop) {
        photo.style.marginLeft = '';
        photo.style.width = '';
        return;
      }

      const row = photo.parentElement;
      if (row) {
        photo.style.width = '';
        const rowStyle = getComputedStyle(row);
        const gap = parseFloat(rowStyle.columnGap || rowStyle.gap) || 0;
        const rowWidth = row.getBoundingClientRect().width;
        const cssWidth = photo.getBoundingClientRect().width;
        const maxPhotoWidth = Math.max(0, rowWidth - gap - TOUR_PHOTO_MIN_BODY_WIDTH);
        photo.style.width = `${Math.min(cssWidth, maxPhotoWidth)}px`;
      }

      photo.style.marginLeft = '0px';
      const offset = photo.getBoundingClientRect().left;
      photo.style.marginLeft = `${-(offset - TOUR_PHOTO_EDGE_GAP)}px`;
    });
  };

  align();
  window.addEventListener('resize', align);
  window.addEventListener('load', align);
}

// Tours page growing map: each tour section owns one piece
// of the shared Namibia map, laid out server-side at its true relative
// position (see TourMapJourney.astro's pieceBoxStyle) but starting
// hidden and the container collapsed to zero height — there is no
// pre-existing "ghost" of the finished map. As each section scrolls
// into view its piece floats down into its already-correct position
// and stays there, and the container's own height grows to keep
// fitting whatever has landed so far, so by the last section the map
// has simply finished assembling itself rather than being swapped for
// a separate "complete" version. This runs the same in reverse: scroll
// back up past a section and its piece un-attaches again, the map
// shrinks back to fit whatever's left, and re-triggering that section
// by scrolling back down re-places it — nothing is `once: true` here.
//
// Scrolling on past the last tour into the closing recap slot settles
// the collage into one clean, unbroken map (same coordinate space, same
// width, just the seamless version) with every tour pinned at once —
// the point being a tourist can actually read where everything sits
// relative to everything else, which the overlapping crops don't
// really give you. Scrolling back up out of the recap slot reverses
// that the same way every other step here does.
//
// The map is explicitly not pinned/sticky, but it can't just sit at one
// fixed vertical spot either: its assembled size stays compact (scaled
// to real geography, not to page length) while the tour-section-plus-recap
// stack beside it is many times taller, so any single static position
// leaves it stranded off-screen for most of the scroll — a static top
// or centered position both fail this the same way, they just fail for
// different sections. So every trigger (forward or backward) also
// nudges the map column's margin-top to re-center the map on whichever
// section is currently active. That's a reposition per section
// crossing, not a continuous scroll-follow — still ordinary box-model
// layout, never position:fixed/sticky.
//
// Reduced motion is intentionally not wired up here: the container's
// default CSS state (the complete map, full height, margin-top 0)
// already reads as the finished result with nothing left to animate —
// there's no reason to make a reduced-motion visitor sit through the
// collage phase at all when the useful end state is right there.
function setupTourMapGrowth() {
  const container = document.querySelector<HTMLElement>('[data-map-growth]');
  const grid = document.querySelector<HTMLElement>('.tour-journey__grid');
  const piecesLayer = container?.querySelector<HTMLElement>('[data-map-pieces]');
  const fullLayer = container?.querySelector<HTMLElement>('[data-map-full-layer]');
  const finalSlot = document.querySelector<HTMLElement>('[data-map-final]');
  const recapBand = document.querySelector<HTMLElement>('[data-recap-band]');
  if (!container || !grid || !piecesLayer || !fullLayer) return;

  const pieces = Array.from(piecesLayer.querySelectorAll<HTMLElement>('[data-map-piece]'));
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-tour-section]'));
  if (!pieces.length) return;

  const fullHeight = Number(container.dataset.fullHeight) || container.offsetHeight;

  gsap.set(container, { height: 0, marginTop: 0 });
  gsap.set(fullLayer, { opacity: 0, scale: 1.04 });
  gsap.set(piecesLayer, { opacity: 1 });
  gsap.set(pieces, { opacity: 0, y: -24 });

  // Resizes/repositions the container to fit exactly pieces 0..activeIndex
  // (inclusive) and re-centers it on that highest-index section — or, if
  // activeIndex is -1 (scrolled back above the very first section), collapses
  // back to the untouched starting state.
  const syncTo = (activeIndex: number) => {
    if (activeIndex < 0) {
      gsap.to(container, { height: 0, marginTop: 0, duration: 0.5, ease: 'power2.inOut' });
      return;
    }

    let height = 0;
    for (let i = 0; i <= activeIndex; i++) {
      height = Math.max(height, pieces[i].offsetTop + pieces[i].offsetHeight);
    }

    const anchorSection = sections[activeIndex];
    const gridRect = grid.getBoundingClientRect();
    const sectionRect = anchorSection.getBoundingClientRect();
    const sectionCenter = sectionRect.top - gridRect.top + sectionRect.height / 2;
    const marginTop = Math.max(0, sectionCenter - height / 2);

    gsap.to(container, { height, marginTop, duration: 0.6, ease: 'power2.out' });
  };

  pieces.forEach((piece) => {
    const index = Number(piece.dataset.mapPiece);
    const section = sections[index];
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      onEnter: () => {
        gsap.to(piece, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
        syncTo(index);
      },
      onLeaveBack: () => {
        gsap.to(piece, { opacity: 0, y: -24, duration: 0.5, ease: 'power2.inOut' });
        syncTo(index - 1);
      },
    });
  });

  if (finalSlot) {
    ScrollTrigger.create({
      trigger: finalSlot,
      start: 'top 75%',
      onEnter: () => {
        gsap.to(piecesLayer, { opacity: 0, scale: 0.94, duration: 0.6, ease: 'power2.inOut' });
        gsap.to(fullLayer, { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out', delay: 0.15 });

        const gridRect = grid.getBoundingClientRect();
        const slotRect = finalSlot.getBoundingClientRect();
        const slotCenter = slotRect.top - gridRect.top + slotRect.height / 2;
        const marginTop = Math.max(0, slotCenter - fullHeight / 2);

        gsap.to(container, { height: fullHeight, marginTop, duration: 0.7, ease: 'power2.out' });

        // The shared band behind the recap card and the settled map:
        // sized/positioned off the recap card's own rect (same numbers
        // as slotRect/gridRect above), since the map is already centered
        // on that same slot by the container tween just above.
        if (recapBand) {
          gsap.set(recapBand, {
            top: slotRect.top - gridRect.top,
            height: slotRect.height,
            width: gridRect.width,
          });
          gsap.to(recapBand, { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.1 });
        }
      },
      onLeaveBack: () => {
        gsap.to(fullLayer, { opacity: 0, scale: 1.04, duration: 0.5, ease: 'power2.inOut' });
        gsap.to(piecesLayer, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out', delay: 0.1 });
        syncTo(pieces.length - 1);

        if (recapBand) {
          gsap.to(recapBand, { opacity: 0, duration: 0.4, ease: 'power1.in' });
        }
      },
    });
  }
}

// Hero panel slideshow: the 7 NAMIBIA panels cycle through which one is
// "active" (wider, via flex-grow — see .hero__panel.is-active) so each
// photo gets a turn filling most of the hero, like an expanding-photo
// slideshow rather than a single static banner. Pauses on hover so a
// visitor reading a panel's letter/photo isn't fighting the layout, and
// under reduced motion it just holds on the first panel with no cycling.
function setupHeroPanelSlideshow(reduceMotion: boolean) {
  const track = document.querySelector<HTMLElement>('[data-hero-panels]');
  if (!track) return;

  const panels = Array.from(track.querySelectorAll<HTMLElement>('[data-hero-panel]'));
  if (panels.length < 2) return;

  const creditEl = document.querySelector<HTMLElement>('[data-hero-credit]');
  const creditLink = creditEl?.querySelector<HTMLAnchorElement>('[data-hero-credit-name]');

  const setActive = (index: number) => {
    panels.forEach((panel, i) => panel.classList.toggle('is-active', i === index));

    const { creditName, creditUsername } = panels[index].dataset;
    if (!creditEl || !creditLink) return;
    if (creditName && creditUsername) {
      creditLink.textContent = creditName;
      creditLink.href = `https://unsplash.com/@${creditUsername}?utm_source=salt-and-sun-tours&utm_medium=referral`;
      creditEl.hidden = false;
    } else {
      creditEl.hidden = true;
    }
  };

  if (reduceMotion) return;

  let index = 0;
  let timer: ReturnType<typeof setInterval>;
  const advance = () => setActive((index = (index + 1) % panels.length));
  const start = () => {
    timer = setInterval(advance, 2800);
  };
  const stop = () => clearInterval(timer);

  start();
  track.addEventListener('mouseenter', stop);
  track.addEventListener('mouseleave', start);

  // The panels themselves are aria-hidden and unfocusable — the only real
  // keyboard/touch path into this section is the CTA and credit links in
  // hero__content, so focus-pause listens on the whole hero, not the
  // panel track, mirroring setupTourRecapSlideshow's hover-isn't-enough
  // rule for the equivalent reason (hover means nothing on touch either).
  const hero = track.closest<HTMLElement>('.hero');
  hero?.addEventListener('focusin', stop);
  hero?.addEventListener('focusout', start);
}

// Reduced motion: no scroll-linked dim/fade at all — a small always-visible
// "Tap for details" button (shown via CSS under prefers-reduced-motion)
// toggles full info instantly instead.
function setupAdventureCardsReducedMotion() {
  const toggles = document.querySelectorAll<HTMLButtonElement>('[data-adventure-toggle]');

  for (const toggle of toggles) {
    toggle.addEventListener('click', () => {
      const card = toggle.closest('.adventure-card');
      const details = card?.querySelector('.adventure-card__details');
      const scrimStrong = card?.querySelector('.adventure-card__scrim-strong');
      if (!details || !scrimStrong) return;

      const expanded = details.classList.toggle('is-expanded');
      scrimStrong.classList.toggle('is-expanded', expanded);
      toggle.setAttribute('aria-expanded', String(expanded));
    });
  }
}

export function initMotion() {
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  setupHeroPanelSlideshow(reduceMotion);
  setupTourIntroMap(reduceMotion);
  setupTourPhotoBleed();
  setupGalleryFilter();
  setupPostcards();
  setupLogbookSlideshow(reduceMotion);

  let lenis: Lenis | undefined;

  if (!reduceMotion) {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      anchors: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis?.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.addEventListener('refresh', () => lenis?.resize());
  }

  const mm = gsap.matchMedia();

  // Full cinematic experience — only when the user hasn't asked for less motion.
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const heroSection = document.querySelector<HTMLElement>('.hero');
    const heroContent = document.querySelector<HTMLElement>('.hero__content');

    if (heroSection && heroContent) {
      gsap.to(heroContent, {
        yPercent: 35,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    setupReveals({ y: 40, duration: 0.8, ease: 'power2.out', stagger: 0.12, maxCascade: 1 });
    setupTourRows(false);
    setupAdventureCards();
    setupAdventureIndex(false);
    setupComboBuilder(false);
    setupTourRecapSlideshow(false);
    setupTourMapGrowth();

    // Pinned section: background pans slowly while content sits in place
    // for a beat before the page releases back into normal scroll. This
    // must be set up — and its pin-spacer inserted — before any later
    // scroll-triggered element (e.g. the tours teaser slider) is measured,
    // otherwise that later trigger's start position is calculated without
    // accounting for the space this pin reserves and ends up firing a full
    // pin-duration too early, overlapping the two effects.
    const pinned = document.querySelector<HTMLElement>('.section--pinned');
    if (pinned) {
      const bg = pinned.querySelector<HTMLElement>('.section__bg');

      ScrollTrigger.create({
        trigger: pinned,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: true,
      });

      if (bg) {
        // A static scale gives the pan some headroom to drift within
        // (nothing is exposed at the edges) without the zoom-in feel the
        // old scale-over-scroll version had — this scale never animates.
        gsap.set(bg, { scale: 1.15, yPercent: -6 });
        gsap.to(bg, {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: pinned,
            start: 'top top',
            end: '+=100%',
            scrub: true,
          },
        });
      }
    }

    // Every scroll-triggered pin above is now registered, so recalculate
    // all of their positions once against the final layout instead of
    // waiting for the window 'load' listener further down.
    ScrollTrigger.refresh();

    return () => {
      lenis?.destroy();
    };
  });

  // Reduced motion: simple opacity fades, no parallax, no pin, no autoplay drift.
  mm.add('(prefers-reduced-motion: reduce)', () => {
    setupReveals({ y: 0, duration: 0.3, ease: 'power1.out', stagger: 0.05, maxCascade: 0.5 });
    setupTourRows(true);
    setupAdventureCardsReducedMotion();
    setupAdventureIndex(true);
    setupComboBuilder(true);
    setupTourRecapSlideshow(true);
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
}
