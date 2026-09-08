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
    const heroBgWrap = document.querySelector<HTMLElement>('.hero__bg-wrap');
    const heroBg = document.querySelector<HTMLElement>('.hero__bg');
    const heroContent = document.querySelector<HTMLElement>('.hero__content');

    // Ken Burns: slow autonomous drift, independent of scroll position.
    // Paused while the hero is off-screen so it isn't burning GPU/battery
    // on mobile for an element the user can't see.
    if (heroBg) {
      const kenBurns = gsap.to(heroBg, {
        scale: 1.12,
        xPercent: 2,
        yPercent: -2,
        duration: 22,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      if (heroSection) {
        ScrollTrigger.create({
          trigger: heroSection,
          start: 'top bottom',
          end: 'bottom top',
          onEnter: () => kenBurns.play(),
          onLeave: () => kenBurns.pause(),
          onEnterBack: () => kenBurns.play(),
          onLeaveBack: () => kenBurns.pause(),
        });
      }
    }

    // Scroll parallax: background drifts slower than the foreground content,
    // which rises and fades faster — a depth cue, not a flat slide-away.
    if (heroSection && heroBgWrap) {
      gsap.to(heroBgWrap, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

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

    // Pinned section: background holds and scales while content sits in
    // place for a beat before the page releases back into normal scroll.
    // This must be set up — and its pin-spacer inserted — before any later
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
        gsap.fromTo(
          bg,
          { scale: 1 },
          {
            scale: 1.18,
            ease: 'none',
            scrollTrigger: {
              trigger: pinned,
              start: 'top top',
              end: '+=100%',
              scrub: true,
            },
          }
        );
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
