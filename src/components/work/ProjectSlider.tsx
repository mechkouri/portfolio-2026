import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Code, Globe, Pause, Play, ShieldCheck, ShoppingCart } from 'lucide-react';
import { projects, type Project } from '../../data/content';
import { accents } from '../../lib/accents';
import { cn, Tag } from '../ui/primitives';

const siteIcons = { globe: Globe, shield: ShieldCheck, code: Code, cart: ShoppingCart };

const AUTOPLAY_MS = 9000;
const STEP = 62; // side slides sit this many % of a slide-width away from the centre
const SPRING = { type: 'spring', stiffness: 170, damping: 26, mass: 0.9 } as const;

/** Shortest signed distance from the active slide, wrapping around the ends. */
function wrapOffset(i: number, active: number, n: number) {
  let d = (i - active) % n;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
}

/**
 * Browser frame whose page screenshot glides down while the slide is active,
 * like someone scrolling the real site.
 */
function BrowserFrame({ project, active, showImage }: { project: Project; active: boolean; showImage: boolean }) {
  const reduced = useReducedMotion();
  const viewport = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const [travel, setTravel] = useState(0);
  const SiteIcon = siteIcons[project.siteIcon];

  const measure = useCallback(() => {
    if (viewport.current && img.current) setTravel(Math.max(0, img.current.offsetHeight - viewport.current.offsetHeight));
  }, []);

  useEffect(() => {
    const ro = new ResizeObserver(measure);
    if (viewport.current) ro.observe(viewport.current);
    if (img.current) ro.observe(img.current);
    return () => ro.disconnect();
  }, [measure, showImage]);

  const scrolling = active && !reduced;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white">
      <div className="flex h-9 items-center justify-between border-b border-slate-200 bg-slate-100 px-3.5">
        <div aria-hidden="true" className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <span className="max-w-[60%] truncate rounded-pill border border-slate-200 bg-white px-3 py-0.5 font-mono text-[10px] text-slate-600">
          {project.label}
        </span>
        <SiteIcon aria-hidden="true" size={14} className="text-slate-400" />
      </div>
      <div ref={viewport} className="relative h-[var(--vh)] overflow-hidden bg-slate-100">
        {showImage && (
          <motion.img
            ref={img}
            src={project.image}
            alt={active ? project.imageAlt : ''}
            decoding="async"
            draggable={false}
            onLoad={measure}
            className="block w-full select-none"
            animate={{ y: scrolling ? -travel : 0 }}
            transition={
              scrolling
                ? { duration: Math.min(7.5, Math.max(4, travel / 170)), delay: 1, ease: [0.45, 0, 0.2, 1] }
                : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
            }
          />
        )}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/25 via-transparent to-transparent" />
      </div>
    </div>
  );
}

export function ProjectSlider() {
  const n = projects.length;
  const reduced = useReducedMotion() ?? false;
  const root = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  // Images are only requested once a slide has been within two places of the centre.
  const [seen, setSeen] = useState<ReadonlySet<number>>(() => new Set([0, 1, 2, n - 1, n - 2]));

  const playing = !reduced && !userPaused && !hovering && !focused && inView;
  const active = projects[index];
  const a = accents[active.accent];

  const goTo = useCallback((i: number) => setIndex(((i % n) + n) % n), [n]);
  const next = useCallback(() => setIndex((i) => (i + 1) % n), [n]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + n) % n), [n]);

  useEffect(() => {
    const near = [index - 2, index - 1, index, index + 1, index + 2].map((i) => ((i % n) + n) % n);
    setSeen((prevSeen) => (near.every((i) => prevSeen.has(i)) ? prevSeen : new Set([...prevSeen, ...near])));
  }, [index, n]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    }
  };

  return (
    <div
      ref={root}
      role="group"
      aria-roledescription="carousel"
      aria-label="Selected projects"
      onKeyDown={onKeyDown}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
    >
      {/* Stage */}
      <div className="relative">
        {/* Accent glow that follows the active project */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 h-[55%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]"
          animate={{ backgroundColor: `rgba(${a.rgb}, 0.22)` }}
          transition={{ duration: 0.9 }}
        />
        <motion.div
          tabIndex={0}
          aria-label="Project screenshots. Use the left and right arrow keys to change project."
          onPanEnd={(_, info) => {
            if (info.offset.x < -50 || info.velocity.x < -400) next();
            else if (info.offset.x > 50 || info.velocity.x > 400) prev();
          }}
          className="relative h-[380px] touch-pan-y overflow-x-clip py-6 [--vh:240px] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] sm:h-[460px] sm:[--vh:320px] lg:h-[560px] lg:[--vh:410px]"
          style={{ perspective: 1800 }}
        >
          {projects.map((project, i) => {
            const o = wrapOffset(i, index, n);
            const abs = Math.abs(o);
            const isActive = o === 0;
            const c = Math.max(-3, Math.min(3, o));
            const pa = accents[project.accent];
            return (
              <motion.div
                key={project.title}
                aria-hidden={!isActive}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${n}`}
                onClick={isActive ? undefined : () => goTo(i)}
                className={cn(
                  'absolute inset-x-0 top-6 mx-auto w-[82vw] sm:w-[560px] lg:w-[680px]',
                  !isActive && abs <= 2 && 'cursor-pointer',
                )}
                style={{ zIndex: 10 - abs, pointerEvents: abs > 2 ? 'none' : 'auto', transformPerspective: 1800 }}
                initial={false}
                animate={{
                  x: `${c * STEP}%`,
                  scale: reduced ? 1 : 1 - Math.min(abs, 3) * 0.13,
                  rotateY: reduced ? 0 : -c * 30,
                  opacity: reduced ? (isActive ? 1 : 0) : abs > 2 ? 0 : 1 - abs * 0.3,
                }}
                transition={reduced ? { duration: 0.3 } : SPRING}
              >
                <div
                  className="rounded-2xl transition-shadow duration-700"
                  style={{
                    boxShadow: isActive
                      ? `0 50px 90px -35px rgba(${pa.rgb}, 0.55), 0 18px 40px -22px rgba(15, 23, 42, 0.35)`
                      : '0 20px 40px -28px rgba(15, 23, 42, 0.35)',
                  }}
                >
                  <BrowserFrame project={project} active={isActive} showImage={seen.has(i) || abs <= 2} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Arrows */}
        {(['prev', 'next'] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            onClick={dir === 'prev' ? prev : next}
            aria-label={dir === 'prev' ? 'Previous project' : 'Next project'}
            className={cn(
              'absolute top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-pill border border-slate-200 bg-white/90 text-slate-700 shadow-lg backdrop-blur transition-all hover:scale-110 hover:border-indigo-400 hover:text-indigo-600 active:scale-95 sm:flex',
              dir === 'prev' ? 'left-0 lg:left-4' : 'right-0 lg:right-4',
            )}
          >
            {dir === 'prev' ? <ArrowLeft aria-hidden="true" size={18} /> : <ArrowRight aria-hidden="true" size={18} />}
          </button>
        ))}
      </div>

      {/* Info for the active project */}
      <div className="mx-auto mt-2 min-h-[210px] max-w-3xl text-center sm:min-h-[190px]" aria-live={playing ? 'off' : 'polite'}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className={cn('font-mono text-[11px] font-bold tracking-wider uppercase', a.text)}>{active.category}</p>
            <h3 className="mt-1 mb-3 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{active.title}</h3>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">{active.description}</p>
            {active.tags.length > 0 && (
              <ul className="mt-4 flex flex-wrap justify-center gap-1.5 font-mono text-[11px] text-slate-600" aria-label="Technologies">
                {active.tags.map((t) => (
                  <li key={t}>
                    <Tag>{t}</Tag>
                  </li>
                ))}
              </ul>
            )}
            <a
              href={active.url ?? '#contact'}
              {...(active.url ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className={cn('group/btn mt-4 inline-flex items-center gap-1.5 font-mono text-xs font-bold', a.text, a.hoverText)}
            >
              <span>{active.url ? 'Visit site' : 'Need something similar?'}</span>
              <ArrowRight aria-hidden="true" size={12} className="transition-transform group-hover/btn:translate-x-1" />
            </a>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress + controls */}
      <div className="mx-auto mt-6 flex max-w-3xl items-center gap-4">
        <span className="w-[4.5rem] shrink-0 font-mono text-xs tracking-wider whitespace-nowrap text-slate-400 tabular-nums" aria-hidden="true">
          {String(index + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
        </span>
        <div className="flex flex-1 items-center gap-1.5">
          {projects.map((project, i) => (
            <button
              key={project.title}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show project ${i + 1}: ${project.title}`}
              aria-current={i === index ? 'true' : undefined}
              className="group/seg flex h-5 flex-1 items-center"
            >
              <span className="relative block h-1.5 w-full overflow-hidden rounded-full bg-slate-200 transition-colors group-hover/seg:bg-slate-300">
                {i === index && (
                  <span
                    key={index}
                    className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500"
                    style={
                      reduced || userPaused
                        ? undefined
                        : {
                            animation: `slide-progress ${AUTOPLAY_MS}ms linear forwards`,
                            animationPlayState: playing ? 'running' : 'paused',
                          }
                    }
                    onAnimationEnd={next}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
        {!reduced && (
          <button
            type="button"
            onClick={() => setUserPaused((v) => !v)}
            aria-label={userPaused ? 'Resume automatic slideshow' : 'Pause automatic slideshow'}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill border border-slate-200 bg-white text-slate-600 transition-colors hover:border-indigo-400 hover:text-indigo-600"
          >
            {userPaused ? <Play aria-hidden="true" size={14} /> : <Pause aria-hidden="true" size={14} />}
          </button>
        )}
      </div>
    </div>
  );
}
