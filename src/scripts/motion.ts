import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// Staggered scroll-tied rise/fade for a `.reveal` section and its
// `.reveal-item` children (falls back to animating the section itself
// when it has no marked children).
function setupReveals(opts: { y: number; duration: number; ease: string; stagger: number }) {
  const sections = gsap.utils.toArray<HTMLElement>('.reveal');

  for (const section of sections) {
    const items = section.querySelectorAll<HTMLElement>('.reveal-item');
    const targets: HTMLElement[] = items.length ? Array.from(items) : [section];

    gsap.set(targets, { opacity: 0, y: opts.y });

    gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration: opts.duration,
      ease: opts.ease,
      stagger: items.length ? opts.stagger : 0,
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
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

    setupReveals({ y: 40, duration: 0.8, ease: 'power2.out', stagger: 0.12 });

    // Pinned section: background holds and scales while content sits in
    // place for a beat before the page releases back into normal scroll.
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

    return () => {
      lenis?.destroy();
    };
  });

  // Reduced motion: simple opacity fades, no parallax, no pin, no autoplay drift.
  mm.add('(prefers-reduced-motion: reduce)', () => {
    setupReveals({ y: 0, duration: 0.3, ease: 'power1.out', stagger: 0.05 });
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
}
