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

// Tours page map journey: pins the map+card panel and steps through 7
// waypoints (4 Erongo, 2 Kunene, 1 Hardap) as the visitor scrolls through
// a reserved scroll distance sized in JS (waypoints carry no layout
// height of their own — see TourMapJourney.astro). Desktop + motion-ok
// only; the .astro component's own CSS shows the stacked mobile
// fallback instead below 861px or under reduced motion, so this
// function simply doesn't run in either of those cases.
function setupTourMapJourney() {
  if (!window.matchMedia('(min-width: 861px)').matches) return;

  const section = document.querySelector<HTMLElement>('[data-map-journey]');
  const pinArea = section?.querySelector<HTMLElement>('.map-journey__pin-area');
  const zoomGroup = section?.querySelector<SVGGElement>('[data-map-zoom-group]');
  const waypoints = Array.from(section?.querySelectorAll<HTMLElement>('[data-map-waypoint]') ?? []);
  const cards = Array.from(section?.querySelectorAll<HTMLElement>('[data-map-card]') ?? []);
  const pins = Array.from(section?.querySelectorAll<SVGGElement>('[data-map-pin]') ?? []);
  const regionLabel = section?.querySelector<HTMLElement>('[data-map-region-label]');
  if (!section || !pinArea || !zoomGroup || !waypoints.length) return;

  const VIEWBOX_W = 600;
  const VIEWBOX_H = 740;
  const STEP_VH = 0.9;

  const stepPx = () => window.innerHeight * STEP_VH;
  const totalPx = () => stepPx() * waypoints.length;

  let activeIndex = -1;

  const goToStep = (i: number) => {
    if (i === activeIndex) return;
    activeIndex = i;

    const wp = waypoints[i];
    const { slug, regionLabel: label, zoomX, zoomY, zoomScale } = wp.dataset;
    const scale = Number(zoomScale);

    gsap.to(zoomGroup, {
      x: VIEWBOX_W / 2 - Number(zoomX) * scale,
      y: VIEWBOX_H / 2 - Number(zoomY) * scale,
      scale,
      transformOrigin: '0px 0px',
      duration: 1,
      ease: 'power2.inOut',
    });

    cards.forEach((card) => card.classList.toggle('is-active', card.dataset.mapCard === slug));
    pins.forEach((pin) => pin.classList.toggle('namibia-map__pin--active', pin.dataset.mapPin === slug));
    if (regionLabel && label) regionLabel.textContent = label;
  };

  goToStep(0);

  ScrollTrigger.create({
    trigger: pinArea,
    start: 'top top',
    end: () => `+=${totalPx()}`,
    pin: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const idx = Math.min(waypoints.length - 1, Math.floor(self.progress * waypoints.length));
      goToStep(idx);
    },
  });
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

// Homepage "About us" carousel: two full-bleed slides in a track twice the
// viewport's width, moved with a plain CSS transform. Advances via the
// pagination dots or a horizontal drag/swipe (pointer events cover touch,
// mouse, and pen in one API) — an axis lock means a vertical drag that
// starts inside the scrollable text card falls through to native scroll
// instead of being hijacked as a swipe.
function setupAboutCarousel() {
  const section = document.querySelector<HTMLElement>('[data-carousel]');
  const track = section?.querySelector<HTMLElement>('[data-carousel-track]');
  const slides = Array.from(document.querySelectorAll<HTMLElement>('[data-carousel] [data-slide]'));
  const dots = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-carousel-dots] button'));
  const prevBtn = document.querySelector<HTMLButtonElement>('[data-carousel-prev]');
  const nextBtn = document.querySelector<HTMLButtonElement>('[data-carousel-next]');
  if (!section || !track || slides.length < 2) return;

  let index = 0;

  const goTo = (i: number) => {
    index = Math.max(0, Math.min(slides.length - 1, i));
    track.style.transform = `translateX(-${(index * 100) / slides.length}%)`;
    dots.forEach((dot, di) => {
      const active = di === index;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', String(active));
    });
    slides.forEach((slide, si) => {
      const active = si === index;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === slides.length - 1;
  };

  dots.forEach((dot) => {
    dot.addEventListener('click', () => goTo(Number(dot.dataset.dot)));
  });

  prevBtn?.addEventListener('click', () => goTo(index - 1));
  nextBtn?.addEventListener('click', () => goTo(index + 1));

  section.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') goTo(index + 1);
    if (event.key === 'ArrowLeft') goTo(index - 1);
  });

  // Belt-and-suspenders alongside draggable={false} on every <img> in the
  // markup: without this, a mouse drag starting on the full-bleed photo
  // triggers the browser's native "ghost image" drag instead of reaching
  // the pointer handlers below, which is why swipe wasn't advancing.
  section.addEventListener('dragstart', (event) => event.preventDefault());

  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let dragging = false;
  let axis: 'x' | 'y' | null = null;

  section.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    // A pointerdown that starts on a button or link (arrows, dots, the
    // Unsplash credit) must not be claimed as a drag — setPointerCapture
    // below retargets that pointer's later events to `section`, which was
    // silently swallowing those controls' own click events.
    if ((event.target as HTMLElement).closest('button, a')) return;
    dragging = true;
    axis = null;
    startX = lastX = event.clientX;
    startY = event.clientY;
    section.setPointerCapture(event.pointerId);
  });

  section.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;

    if (axis === null) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (axis === 'x') track.style.transition = 'none';
    }
    if (axis !== 'x') return;

    event.preventDefault();
    lastX = event.clientX;
    const basePercent = -(index * 100) / slides.length;
    const dragPercent = (dx / section.clientWidth) * (100 / slides.length);
    track.style.transform = `translateX(${basePercent + dragPercent}%)`;
  });

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    track.style.transition = '';
    if (axis !== 'x') return;

    const delta = lastX - startX;
    const threshold = 50;
    if (delta < -threshold) goTo(index + 1);
    else if (delta > threshold) goTo(index - 1);
    else goTo(index);
  };

  section.addEventListener('pointerup', endDrag);
  section.addEventListener('pointercancel', endDrag);

  goTo(0);
}

export function initMotion() {
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  setupHeroPanelSlideshow(reduceMotion);
  setupAboutCarousel();

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
    setupTourMapJourney();

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
