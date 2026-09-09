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

// Hover tilt for the homepage "More ways to spend a day" grid — cards
// lean toward the cursor in 3D as it moves across them. Pointer-driven
// rather than scroll-driven, an experiment scoped to just this one grid
// for now rather than every AdventureCard on the site. Fine-pointer
// devices only (hover doesn't mean anything on touch).
function setupAdventureTilt() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const cards = gsap.utils.toArray<HTMLElement>('.homepage-adventures__grid .adventure-card');
  const maxTilt = 10;

  for (const card of cards) {
    gsap.set(card, { transformPerspective: 800 });
    const setRotateX = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' });
    const setRotateY = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' });
    const setScale = gsap.quickTo(card, 'scale', { duration: 0.5, ease: 'power3.out' });

    card.addEventListener('mouseenter', () => {
      card.classList.add('is-tilting');
      setScale(1.035);
    });

    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width;
      const relY = (event.clientY - rect.top) / rect.height;
      setRotateY((relX - 0.5) * maxTilt * 2);
      setRotateX(-(relY - 0.5) * maxTilt * 2);
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('is-tilting');
      setRotateX(0);
      setRotateY(0);
      setScale(1);
    });
  }
}

// Rising-stagger entrance for the homepage "More ways to spend a day"
// grid: cards rise and fade in together, with a diagonal stagger running
// top-left to bottom-right across the grid rather than row by row. Runs
// once; scoped to this one grid rather than every AdventureCard on the site.
function setupAdventureRise() {
  const grid = document.querySelector<HTMLElement>('.homepage-adventures__grid');
  if (!grid) return;

  const cards = gsap.utils.toArray<HTMLElement>('.adventure-card', grid);
  if (!cards.length) return;

  gsap.set(cards, { opacity: 0, y: 36 });

  gsap.to(cards, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power2.out',
    stagger: { each: 0.07, grid: 'auto', from: 'start' },
    scrollTrigger: {
      trigger: grid,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
}

// Homepage tour teaser: an edge-to-edge row of cards that slides
// horizontally while the section stays pinned, driven by ordinary vertical
// scroll — desktop only. The row is natively horizontally scrollable by
// default (mobile, reduced motion, no-JS), so this only upgrades that base
// behavior rather than replacing it.
function setupToursTeaserSlide() {
  if (!window.matchMedia('(min-width: 861px)').matches) return;

  const pinEl = document.querySelector<HTMLElement>('.tours-teaser__pin');
  const track = document.querySelector<HTMLElement>('.tours-teaser__track');
  const header = document.querySelector<HTMLElement>('.site-header');
  if (!pinEl || !track) return;

  pinEl.classList.add('tours-teaser__pin--pinned');

  const getDistance = () => Math.max(0, track.scrollWidth - pinEl.clientWidth);
  // Pin just below the sticky header instead of at the true viewport top —
  // otherwise the header (z-index: 50) sits over the top slice of the
  // pinned cards for the whole slide.
  const getHeaderOffset = () => header?.getBoundingClientRect().height ?? 0;

  gsap.to(track, {
    x: () => -getDistance(),
    ease: 'none',
    scrollTrigger: {
      trigger: pinEl,
      start: () => `top ${getHeaderOffset()}px`,
      end: () => `+=${getDistance()}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });
}

// Homepage hero: cycles the left text panel and the right 3-photo stack
// through the six signature tours together. Advances on a timer (paused on
// hover/focus) and via the numbered nav buttons — deliberately not
// scroll-driven, so it can't turn into the scroll-jacking hero concept that
// was tried and reverted earlier. Under reduced motion there's no
// auto-advance and swaps are instant (global CSS already zeroes transition
// durations), but the nav buttons still work either way.
interface HeroPhoto {
  imageUrl: string;
  alt: string;
  imageCredit: { name: string; username: string };
}

interface HeroTourData {
  slug: string;
  name: string;
  tagline: string;
  gallery: HeroPhoto[];
  // Same photo as gallery[0], but at full-bleed resolution instead of the
  // small card size — see toBackgroundUrl() in Hero.astro.
  bg?: HeroPhoto;
}

// Fetches every photo the hero can show as soon as the page loads, so by
// the time a tour comes up (on the timer, or a nav click) the browser
// already has the bytes and can paint the new layer instantly instead of
// leaving it blank while it downloads.
function preloadTourImages(tours: HeroTourData[]) {
  const seen = new Set<string>();
  const preload = (photo?: HeroPhoto) => {
    if (!photo || seen.has(photo.imageUrl)) return;
    seen.add(photo.imageUrl);
    const img = new Image();
    img.src = photo.imageUrl;
  };
  for (const tour of tours) {
    tour.gallery.forEach(preload);
    preload(tour.bg);
  }
}

// A two-layer crossfade for one photo slot (the hero background, or one
// card in the stack): two stacked <img> elements where only one is
// "active" (opacity 1) at a time. Swapping means loading the new photo
// into the *inactive* layer and toggling which one is active — both
// transition simultaneously, so something is always fully painted. A
// single image fading itself out then back in (the old approach) leaves a
// gap where neither photo is visible and the page background shows
// through — that's the "turns white" bug this replaces.
function createLayerSwapper(layers: HTMLImageElement[]) {
  let active = 0;
  return (photo?: HeroPhoto) => {
    if (!photo || layers.length < 2) return;
    const next = 1 - active;
    const nextImg = layers[next];
    nextImg.src = photo.imageUrl;
    nextImg.alt = photo.alt;
    layers[active].classList.remove('is-active');
    nextImg.classList.add('is-active');
    active = next;
  };
}

function setupTourHero(reduceMotion: boolean) {
  const section = document.querySelector<HTMLElement>('[data-tour-hero]');
  if (!section) return;

  let tours: HeroTourData[];
  try {
    tours = JSON.parse(section.dataset.tours ?? '[]');
  } catch {
    return;
  }
  if (tours.length < 2) return;

  preloadTourImages(tours);

  const panel = section.querySelector<HTMLElement>('.hero__panel');
  const nameEl = section.querySelector<HTMLElement>('[data-hero-name]');
  const taglineEl = section.querySelector<HTMLElement>('[data-hero-tagline]');
  const ctaEl = section.querySelector<HTMLAnchorElement>('[data-hero-cta]');
  const navBtns = Array.from(section.querySelectorAll<HTMLButtonElement>('[data-hero-nav-btn]'));
  const creditEl = section.querySelector<HTMLElement>('[data-hero-credit]');
  const creditLink = creditEl?.querySelector<HTMLAnchorElement>('[data-hero-credit-name]');
  if (!panel || !nameEl || !taglineEl || !ctaEl) return;

  const swapBg = createLayerSwapper(
    Array.from(section.querySelectorAll<HTMLImageElement>('[data-hero-bg-layer]'))
  );
  const swapCards = Array.from(section.querySelectorAll<HTMLElement>('[data-hero-card]')).map(
    (card) => createLayerSwapper(Array.from(card.querySelectorAll<HTMLImageElement>('[data-hero-card-layer]')))
  );

  // Text swap timing — must match the --hero-crossfade CSS custom property
  // on .hero--tours, so the old name/tagline are only replaced once fully
  // faded out (not partway through, which would blink). The photo layers
  // don't need this: their crossfade is the transition itself.
  const CROSSFADE_MS = 900;

  let index = 0;
  let swapTimer: ReturnType<typeof setTimeout> | undefined;

  const applyTextContent = (tour: HeroTourData) => {
    nameEl.textContent = tour.name;
    taglineEl.textContent = tour.tagline;
    ctaEl.href = `/tours#${tour.slug}`;

    const firstCredit = tour.bg?.imageCredit;
    if (creditEl && creditLink && firstCredit) {
      creditLink.textContent = firstCredit.name;
      creditLink.href = `https://unsplash.com/@${firstCredit.username}?utm_source=salt-and-sun-tours&utm_medium=referral`;
      creditEl.hidden = false;
    } else if (creditEl) {
      creditEl.hidden = true;
    }
  };

  const setActive = (i: number) => {
    if (i === index) return;
    index = i;
    const tour = tours[i];

    swapBg(tour.bg);
    swapCards.forEach((swap, cardIndex) => swap(tour.gallery[cardIndex]));

    navBtns.forEach((btn, btnIndex) => {
      const active = btnIndex === i;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-current', String(active));
    });

    if (reduceMotion) {
      applyTextContent(tour);
      return;
    }

    clearTimeout(swapTimer);
    panel.classList.add('is-transitioning');
    swapTimer = setTimeout(() => {
      applyTextContent(tour);
      panel.classList.remove('is-transitioning');
    }, CROSSFADE_MS);
  };

  navBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const i = Number(btn.dataset.index);
      setActive(i);
      restart();
    });
  });

  let timer: ReturnType<typeof setInterval> | undefined;
  const advance = () => setActive((index + 1) % tours.length);
  const start = () => {
    if (reduceMotion) return;
    timer = setInterval(advance, 5000);
  };
  const stop = () => clearInterval(timer);
  const restart = () => {
    stop();
    start();
  };

  start();
  section.addEventListener('mouseenter', stop);
  section.addEventListener('mouseleave', start);
  section.addEventListener('focusin', stop);
  section.addEventListener('focusout', start);
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

  setupTourHero(reduceMotion);

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
    const heroContent = document.querySelector<HTMLElement>('.hero__grid');

    if (heroSection && heroContent) {
      gsap.to(heroContent, {
        yPercent: 12,
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
    setupAdventureTilt();
    setupAdventureRise();

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

    setupToursTeaserSlide();

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
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
}
