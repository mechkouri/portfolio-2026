import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { sections } from '../../data/content';
import { useLang } from '../../i18n/LangProvider';
import { cn } from '../ui/primitives';

const items = [{ id: 'top' }, ...sections.map((s) => ({ id: s.id }))];
const N = items.length;

// Node positions in a 0-100 box: evenly spaced down the panel, drifting left and right.
const Y = items.map((_, i) => 5 + (90 * i) / (N - 1));
const X = items.map((_, i) => 50 + 17 * Math.sin(i * 1.25 + 0.4));

/** Smooth curve through the points (Catmull-Rom converted to cubic Beziers). */
function smoothPath(xs: number[], ys: number[]) {
  let d = `M ${xs[0]} ${ys[0]}`;
  for (let i = 0; i < xs.length - 1; i++) {
    const a = Math.max(0, i - 1);
    const b = Math.min(xs.length - 1, i + 2);
    const c1x = xs[i] + (xs[i + 1] - xs[a]) / 6;
    const c1y = ys[i] + (ys[i + 1] - ys[a]) / 6;
    const c2x = xs[i + 1] - (xs[b] - xs[i]) / 6;
    const c2y = ys[i + 1] - (ys[b] - ys[i]) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${xs[i + 1]} ${ys[i + 1]}`;
  }
  return d;
}
const PATH = smoothPath(X, Y);

/**
 * Side panel showing how far through the page you are: a live percentage and a wavy line with
 * one node per section. The line fills as you scroll, the current node glows, and every node is
 * a link to its section. Only shown on wide screens, where it sits in the page margin.
 */
export function Telemetry() {
  const { t, content } = useLang();
  const labels = [t.telemetry.home, ...content.sections.map((s) => s.eyebrow)];
  const tops = useRef<number[]>([]);
  const [active, setActive] = useState(0);
  const [pct, setPct] = useState(0);
  const fillY = useMotionValue(Y[0]);
  const smoothFill = useSpring(fillY, { stiffness: 140, damping: 26, mass: 0.6 });
  const fillScale = useTransform(smoothFill, (v) => v / 100);

  const update = useCallback(() => {
    const t = tops.current;
    if (t.length !== N) return;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const atBottom = max > 0 && window.scrollY >= max - 4;

    // Where we are, measured a little below the top of the viewport.
    const probe = window.scrollY + window.innerHeight * 0.4;
    let i = 0;
    while (i < N - 1 && t[i + 1] <= probe) i++;
    if (atBottom) i = N - 1;

    const end = i < N - 1 ? t[i + 1] : doc.scrollHeight;
    const f = i < N - 1 ? Math.min(1, Math.max(0, (probe - t[i]) / Math.max(1, end - t[i]))) : 0;
    fillY.set(i < N - 1 ? Y[i] + f * (Y[i + 1] - Y[i]) : Y[N - 1]);
    setActive(i);
    setPct(max > 0 ? Math.round(Math.min(1, Math.max(0, window.scrollY / max)) * 100) : 0);
  }, [fillY]);

  useEffect(() => {
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    const measure = () => {
      tops.current = items.map(({ id }) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY : 0;
      });
      schedule();
    };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    // Section heights change as images and fonts load.
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      ro.disconnect();
    };
  }, [update]);

  return (
    <nav
      aria-label={t.telemetry.aria}
      className="fixed top-1/2 right-2 z-40 hidden h-[min(76vh,560px)] w-9 -translate-y-1/2 flex-col rounded-[22px] border border-slate-200/80 bg-white/70 shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl min-[1400px]:flex min-[1536px]:right-4 min-[1536px]:w-[72px] min-[1536px]:rounded-[28px]"
    >
      <div className="hidden shrink-0 flex-col items-center gap-1 px-2 pt-5 pb-3 min-[1536px]:flex" aria-hidden="true">
        <span className="font-mono text-[9px] tracking-[0.22em] text-slate-500">{t.telemetry.label}</span>
        <span className="font-mono text-sm font-bold text-indigo-600 tabular-nums">{pct}%</span>
        <span className="mt-2 h-px w-full bg-slate-200" />
      </div>

      <div className="relative min-h-0 flex-1">
        <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <linearGradient id="telemetry-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4f46e5" />
              <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
            <clipPath id="telemetry-clip">
              <motion.rect x="-20" y="0" width="140" height="100" style={{ scaleY: fillScale, originY: 0 }} />
            </clipPath>
          </defs>
          <path d={PATH} fill="none" stroke="#94a3b8" strokeOpacity="0.7" strokeWidth="1.5" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
          <path d={PATH} fill="none" stroke="url(#telemetry-fill)" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" clipPath="url(#telemetry-clip)" />
        </svg>

        {items.map((item, i) => {
          const isActive = i === active;
          const passed = i < active;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-label={`${labels[i]}${isActive ? t.telemetry.current : ''}`}
              aria-current={isActive ? 'location' : undefined}
              className="group absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
              style={{ left: `${X[i]}%`, top: `${Y[i]}%` }}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'relative block rounded-full transition-all duration-500',
                  isActive
                    ? 'h-3.5 w-3.5 bg-gradient-to-br from-indigo-600 to-cyan-500 shadow-[0_0_0_4px_rgba(6,182,212,0.18),0_0_14px_rgba(6,182,212,0.55)]'
                    : passed
                      ? 'h-2 w-2 bg-indigo-500 group-hover:scale-150'
                      : 'h-2.5 w-2.5 border-2 border-slate-400 bg-white group-hover:scale-125 group-hover:border-indigo-500',
                )}
              >
                {isActive && <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400/50" />}
              </span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-full mr-3 -translate-y-1/2 translate-x-1 rounded-pill border border-slate-200 bg-white px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider whitespace-nowrap text-slate-700 uppercase opacity-0 shadow-md transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
              >
                {labels[i]}
              </span>
            </a>
          );
        })}
      </div>
      <div className="h-4 shrink-0" aria-hidden="true" />
    </nav>
  );
}
