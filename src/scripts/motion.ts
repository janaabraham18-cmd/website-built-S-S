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

// Pixel tourist companion — a small rigged character (see
// TourGuideSprite.astro) driven by a real state machine rather than a
// smooth scroll-bound glide:
//   - "walking" / "running" only while the page is actually moving
//     (Lenis's scroll event is the activity signal; ~220ms of no scroll
//     events means it stopped)
//   - the moment it stops, he freezes into idle-stand, or idle-sit if
//     he's currently parked on the card row, until scrolling resumes
//   - crossing between the normal page and a set-piece zone (the ladder,
//     the ramp, the pinned card row) is a real jump — a short GSAP
//     timeline that arcs him up and back down with a turn — rather than a
//     teleport; inside the ladder/ramp zones a separate scrub tween then
//     carries him along the prop as you keep scrolling; leaving the card
//     row is a bigger, slower dive into whatever comes next.
// Desktop only (matches the slider itself).
function setupTourGuideSprite(lenis: Lenis | undefined) {
  if (!window.matchMedia('(min-width: 861px)').matches) return;

  const guide = document.querySelector<HTMLElement>('.tour-guide');
  if (!guide) return;

  // Position purely via `top` from here on (never mix with `bottom`) so
  // every subsequent tween — including relative ones in the jump — has a
  // real numeric value to work from.
  const restTop = () => window.innerHeight - 28 - guide.offsetHeight;
  gsap.set(guide, { top: restTop(), bottom: 'auto' });

  type Zone = 'glide' | 'ladder' | 'ramp' | 'card';
  let zone: Zone = 'glide';
  let isScrolling = false;
  let isJumping = false;
  let facingLeft = false;
  let idleTimer: ReturnType<typeof setTimeout> | undefined;

  const glideLeft = () => Math.max(0, window.innerWidth - guide.offsetWidth - 24);

  const glideTween = gsap.to(guide, {
    left: glideLeft,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  if (!glideTween.scrollTrigger) return;
  const glideTrigger: ScrollTrigger = glideTween.scrollTrigger;

  type Pose =
    | 'is-walking'
    | 'is-running'
    | 'is-idle'
    | 'is-sitting'
    | 'is-jumping'
    | 'is-climbing'
    | 'is-rolling'
    | 'is-diving';
  const allPoses: Pose[] = [
    'is-walking',
    'is-running',
    'is-idle',
    'is-sitting',
    'is-jumping',
    'is-climbing',
    'is-rolling',
    'is-diving',
  ];

  function setPose(pose: Pose) {
    guide!.classList.remove(...allPoses);
    guide!.classList.add(pose);
  }

  // Zones with their own continuous set-piece animation (ladder, ramp)
  // hold that pose regardless of activity, but pause the animation in
  // place — rather than snapping to idle-stand/sit — while scrolling is
  // stopped, so he's genuinely clinging to the rail or curled up
  // mid-tumble instead of just disappearing into a different pose.
  function applyCurrentPose() {
    if (isJumping) return; // the jump/dive timeline owns the pose class while it runs
    if (zone === 'card') {
      setPose(isScrolling ? 'is-running' : 'is-sitting');
      guide!.classList.remove('tg-paused');
    } else if (zone === 'ladder' || zone === 'ramp') {
      setPose(zone === 'ladder' ? 'is-climbing' : 'is-rolling');
      guide!.classList.toggle('tg-paused', !isScrolling);
    } else {
      setPose(isScrolling ? 'is-walking' : 'is-idle');
      guide!.classList.remove('tg-paused');
    }
  }

  function faceDirection(movingLeft: boolean) {
    if (movingLeft === facingLeft) return;
    facingLeft = movingLeft;
    guide!.classList.toggle('facing-left', facingLeft);
  }

  function pingActivity() {
    if (!isScrolling) {
      isScrolling = true;
      applyCurrentPose();
    }
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      isScrolling = false;
      applyCurrentPose();
    }, 220);
  }

  lenis?.on('scroll', pingActivity);
  applyCurrentPose();

  // A real jump: brief anticipation crouch (CSS, via the is-jumping
  // pose), an eased arc up then down across to the target spot, a turn
  // if the direction changed, and a small landing squash. `onLanded`
  // lets a caller take over the pose instead of falling back to
  // whatever applyCurrentPose() would normally pick (used to hand off
  // into the ladder/ramp's own scrub-driven descent).
  function jumpTo(targetLeft: number, targetTop: number, onLanded?: () => void) {
    isJumping = true;
    const startLeft = parseFloat(getComputedStyle(guide!).left) || 0;
    faceDirection(targetLeft < startLeft);
    setPose('is-jumping');

    gsap
      .timeline({
        onComplete: () => {
          isJumping = false;
          if (onLanded) onLanded();
          else applyCurrentPose();
        },
      })
      .to(guide, { top: '-=16', duration: 0.16, ease: 'power2.out' }, 0)
      .to(guide, { left: targetLeft, duration: 0.34, ease: 'power1.inOut' }, 0)
      .to(guide, { top: targetTop, duration: 0.18, ease: 'power2.in' }, 0.16)
      .to(guide, { scaleY: 0.8, duration: 0.07, ease: 'power1.out' }, 0.34)
      .to(guide, { scaleY: 1, duration: 0.14, ease: 'back.out(2)' }, 0.41);
  }

  // A bigger, slower cousin of jumpTo used only for leaving the tour
  // cards: a proper dive — higher rise, longer flight, the diving
  // silhouette — into whatever section comes next.
  function diveOff(targetLeft: number, targetTop: number) {
    isJumping = true;
    const startLeft = parseFloat(getComputedStyle(guide!).left) || 0;
    faceDirection(targetLeft < startLeft);
    setPose('is-diving');

    gsap
      .timeline({
        onComplete: () => {
          isJumping = false;
          applyCurrentPose();
        },
      })
      .to(guide, { top: '-=30', duration: 0.22, ease: 'power2.out' }, 0)
      .to(guide, { left: targetLeft, duration: 0.62, ease: 'power1.inOut' }, 0)
      .to(guide, { top: targetTop, duration: 0.4, ease: 'power2.in' }, 0.22)
      .to(guide, { scaleY: 0.72, duration: 0.08, ease: 'power1.out' }, 0.6)
      .to(guide, { scaleY: 1, duration: 0.16, ease: 'back.out(2)' }, 0.68);
  }

  // A set piece he slides/rolls along: jumping on at one end (direction-
  // aware, so scrolling back up lands him at the far end instead), then
  // a scrub tween — enabled only once he's actually landed — carries him
  // the rest of the way as the zone scrolls past.
  function setupPropZone(
    zoneEl: HTMLElement,
    zoneName: 'ladder' | 'ramp',
    getStartX: () => number,
    getStartY: () => number,
    getEndX: () => number,
    getEndY: () => number
  ) {
    const descend = gsap.fromTo(
      guide,
      { left: getStartX, top: getStartY },
      {
        left: getEndX,
        top: getEndY,
        ease: 'none',
        scrollTrigger: {
          trigger: zoneEl,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );
    const descendTrigger = descend.scrollTrigger!;
    descendTrigger.disable(false);

    const enterForward = () => {
      zone = zoneName;
      glideTrigger.disable(false);
      jumpTo(getStartX(), getStartY(), () => {
        applyCurrentPose();
        descendTrigger.enable();
      });
    };

    const enterBackward = () => {
      zone = zoneName;
      glideTrigger.disable(false);
      jumpTo(getEndX(), getEndY(), () => {
        applyCurrentPose();
        descendTrigger.enable();
      });
    };

    const exit = () => {
      descendTrigger.disable(false);
      zone = 'glide';
      jumpTo(glideLeft(), restTop());
      glideTrigger.enable();
      ScrollTrigger.refresh();
    };

    ScrollTrigger.create({
      trigger: zoneEl,
      start: 'top 70%',
      end: 'bottom 30%',
      onEnter: enterForward,
      onEnterBack: enterBackward,
      onLeave: exit,
      onLeaveBack: exit,
    });
  }

  const ladderZone = document.querySelector<HTMLElement>('#tg-ladder-zone');
  const ladderSvg = document.querySelector<HTMLElement>('.tg-ladder');
  if (ladderZone && ladderSvg) {
    const rect = () => ladderSvg.getBoundingClientRect();
    setupPropZone(
      ladderZone,
      'ladder',
      () => rect().left + rect().width / 2 - guide.offsetWidth / 2,
      () => rect().top - 8,
      () => rect().left + rect().width / 2 - guide.offsetWidth / 2,
      () => rect().bottom - guide.offsetHeight + 6
    );
  }

  const rampZone = document.querySelector<HTMLElement>('#tg-ramp-zone');
  const rampSvg = document.querySelector<HTMLElement>('.tg-ramp');
  if (rampZone && rampSvg) {
    const rect = () => rampSvg.getBoundingClientRect();
    setupPropZone(
      rampZone,
      'ramp',
      () => rect().left + rect().width * 0.05 - guide.offsetWidth / 2,
      () => rect().top + rect().height * 0.08,
      () => rect().left + rect().width * 0.75 - guide.offsetWidth / 2,
      () => rect().top + rect().height * 0.92 - guide.offsetHeight
    );
  }

  const pinEl = document.querySelector<HTMLElement>('.tours-teaser__pin');
  const track = document.querySelector<HTMLElement>('.tours-teaser__track');
  const header = document.querySelector<HTMLElement>('.site-header');
  if (!pinEl || !track) return;

  const getDistance = () => Math.max(0, track.scrollWidth - pinEl.clientWidth);
  const getHeaderOffset = () => header?.getBoundingClientRect().height ?? 0;
  const runTop = () => getHeaderOffset() + 10;
  const runLeft = () => window.innerWidth * 0.32;

  const enterCard = () => {
    zone = 'card';
    glideTrigger.disable(false);
    jumpTo(runLeft(), runTop());
  };

  const exitCard = () => {
    zone = 'glide';
    diveOff(glideLeft(), restTop());
    glideTrigger.enable();
    ScrollTrigger.refresh();
  };

  ScrollTrigger.create({
    trigger: pinEl,
    start: () => `top ${getHeaderOffset()}px`,
    end: () => `+=${getDistance()}`,
    onEnter: enterCard,
    onLeave: exitCard,
    onEnterBack: enterCard,
    onLeaveBack: exitCard,
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
    setupTourGuideSprite(lenis);

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
