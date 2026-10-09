import { useRef } from 'react';
import { motion } from 'motion/react';
import type { TimelineEntry } from '../../data/content';
import { accents } from '../../lib/accents';
import { useScrollTimeline } from '../../hooks/useScrollTimeline';
import { cn } from './primitives';

const EASE = [0.16, 1, 0.3, 1] as const;

function Milestone({ entry, index }: { entry: TimelineEntry; index: number }) {
  const a = accents[entry.accent];
  const cardLeft = index % 2 === 0;

  return (
    <li className={cn('relative flex flex-col items-center justify-between gap-8 md:gap-0', cardLeft ? 'md:flex-row' : 'md:flex-row-reverse')}>
      <motion.div
        className="w-full pl-16 md:w-[40%] md:pl-0 lg:w-[42%] xl:w-[45%]"
        initial={{ opacity: 0, x: cardLeft ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <article className="group rounded-2xl border border-slate-200/90 bg-white p-6 text-left shadow-sm transition-all hover:border-indigo-400 hover:shadow-xl sm:p-8">
          <h3 className="font-display text-xl font-bold text-slate-900 transition-colors group-hover:text-indigo-600">{entry.role}</h3>
          <p className="mt-1 font-mono text-xs font-bold tracking-wider text-indigo-600 uppercase">
            {entry.org}
            {entry.place && <span className="font-medium text-slate-400"> · {entry.place}</span>}
          </p>
          {entry.note && <p className="mt-3 text-sm text-slate-600">{entry.note}</p>}
          {entry.points && (
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
              {entry.points.map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </article>
      </motion.div>

      <div className="absolute top-6 left-7 z-10 -translate-x-1/2 md:top-1/2 md:left-1/2 md:-translate-y-1/2">
        <motion.div
          aria-hidden="true"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className={cn(
            'flex items-center justify-center overflow-hidden rounded-pill border-2 font-mono text-xs font-bold shadow-md',
            entry.logo ? 'h-10 w-14 p-1 transition-transform duration-300 hover:scale-110 md:h-14 md:w-20 md:p-1.5 lg:h-16 lg:w-28 lg:p-2' : 'h-10 w-10',
            entry.logoDark ? 'bg-black' : 'bg-white',
            a.nodeRing,
          )}
        >
          {entry.logo ? (
            // The organisation name is already in the card, so the logo is decorative here.
            <img src={entry.logo} alt="" loading="lazy" decoding="async" className="h-full w-full object-contain" />
          ) : (
            entry.badge
          )}
        </motion.div>
      </div>

      <div className={cn('flex w-full pl-16 md:w-[40%] lg:w-[42%] xl:w-[45%]', cardLeft ? 'md:justify-start md:pl-8' : 'md:justify-end md:pr-8 md:pl-0')}>
        <span className="inline-flex items-center gap-2 rounded-pill border border-slate-200 bg-white px-4 py-1.5 font-mono text-xs font-semibold text-slate-700 shadow-sm">
          <span aria-hidden="true" className={cn('h-2 w-2 rounded-full', a.dot, entry.current && 'animate-pulse')} />
          <time>{entry.period}</time>
        </span>
      </div>
    </li>
  );
}

/** Alternating two-sided timeline with a glowing spine that draws itself as you scroll. */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const root = useRef<HTMLDivElement>(null);

  useScrollTimeline(root, (gsap, _ST, el) => {
    gsap.fromTo(
      '[data-spine]',
      { scaleY: 0 },
      { scaleY: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 70%', end: 'bottom 60%', scrub: 0.5 } },
    );
  });

  return (
    <div ref={root} className="relative w-full">
      <div aria-hidden="true" className="pointer-events-none absolute top-4 bottom-4 left-7 w-[2px] -translate-x-1/2 bg-slate-200 md:left-1/2" />
      <div
        data-spine
        aria-hidden="true"
        className="pointer-events-none absolute top-4 bottom-4 left-7 w-[2px] origin-top -translate-x-1/2 bg-gradient-to-b from-indigo-500 via-sky-400 to-indigo-500 opacity-70 shadow-[0_0_12px_rgba(79,70,229,0.5)] md:left-1/2"
      />
      <ol className="relative space-y-16 md:space-y-24">
        {entries.map((entry, i) => (
          <Milestone key={i} entry={entry} index={i} />
        ))}
      </ol>
    </div>
  );
}
