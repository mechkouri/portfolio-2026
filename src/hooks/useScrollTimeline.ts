import { useEffect, type RefObject } from 'react';
import { useReducedMotion } from 'motion/react';

type GsapModule = typeof import('gsap').gsap;
type ScrollTriggerModule = typeof import('gsap/ScrollTrigger').ScrollTrigger;

let loader: Promise<{ gsap: GsapModule; ScrollTrigger: ScrollTriggerModule }> | null = null;

/** GSAP + ScrollTrigger are loaded on demand so they never block first paint. */
function loadGsap() {
  loader ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([g, st]) => {
    g.gsap.registerPlugin(st.ScrollTrigger);
    // Trigger positions are measured once, but the page keeps growing as images and fonts load
    // (and as sections are reordered or resized). Re-measure whenever the layout height changes.
    let timer = 0;
    const refresh = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => st.ScrollTrigger.refresh(), 200);
    };
    window.addEventListener('load', refresh);
    new ResizeObserver(refresh).observe(document.body);
    return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
  });
  return loader;
}

/**
 * Runs a scroll-driven GSAP setup scoped to `scope`. Skipped entirely when the
 * user prefers reduced motion; everything is reverted on unmount.
 */
export function useScrollTimeline(
  scope: RefObject<HTMLElement | null>,
  setup: (gsap: GsapModule, ScrollTrigger: ScrollTriggerModule, root: HTMLElement) => void,
  deps: unknown[] = [],
) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = scope.current;
    if (!root || reducedMotion) return;
    let ctx: ReturnType<GsapModule['context']> | undefined;
    let cancelled = false;

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      ctx = gsap.context(() => setup(gsap, ScrollTrigger, root), root);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, ...deps]);
}
