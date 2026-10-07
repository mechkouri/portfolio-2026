import { useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { education, experience, type TimelineEntry } from '../data/content';
import { accents } from '../lib/accents';
import { useScrollTimeline } from '../hooks/useScrollTimeline';
import { Reveal } from '../components/ui/Reveal';
import { cn, SectionLabel } from '../components/ui/primitives';

const tabs = [
  { id: 'experience', label: 'Experience', eyebrow: "Where I've worked", title: 'Work experience.', entries: experience },
  { id: 'education', label: 'Education', eyebrow: 'Where I studied', title: 'Education.', entries: education },
] as const;

type TabId = (typeof tabs)[number]['id'];

function Milestone({ entry, index }: { entry: TimelineEntry; index: number }) {
  const a = accents[entry.accent];
  const cardLeft = index % 2 === 0;
  const EASE = [0.16, 1, 0.3, 1] as const;

  return (
    <li className={cn('relative flex flex-col items-center justify-between gap-8 md:gap-0', cardLeft ? 'md:flex-row' : 'md:flex-row-reverse')}>
      <motion.div
        className="w-full pl-12 md:w-[45%] md:pl-0"
        initial={{ opacity: 0, x: cardLeft ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <article className="group rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all hover:border-indigo-400 hover:shadow-xl sm:p-8">
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

      <div className="absolute top-6 left-4 z-10 -translate-x-1/2 md:top-1/2 md:left-1/2 md:-translate-y-1/2">
        <motion.div
          aria-hidden="true"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className={cn('flex h-10 w-10 items-center justify-center rounded-pill border-2 bg-white font-mono text-xs font-bold shadow-md', a.nodeRing)}
        >
          {entry.badge}
        </motion.div>
      </div>

      <div className={cn('flex w-full pl-12 md:w-[45%]', cardLeft ? 'md:justify-start md:pl-8' : 'md:justify-end md:pr-8 md:pl-0')}>
        <span className="inline-flex items-center gap-2 rounded-pill border border-slate-200 bg-white px-4 py-1.5 font-mono text-xs font-semibold text-slate-700 shadow-sm">
          <span aria-hidden="true" className={cn('h-2 w-2 rounded-full', a.dot, entry.current && 'animate-pulse')} />
          <time>{entry.period}</time>
        </span>
      </div>
    </li>
  );
}

export function Experience() {
  const [tab, setTab] = useState<TabId>('experience');
  const timeline = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = tabs.find((t) => t.id === tab)!;

  // The glowing spine draws itself as the timeline scrolls through the viewport.
  useScrollTimeline(
    timeline,
    (gsap, _ST, el) => {
      gsap.fromTo(
        '[data-spine]',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 70%', end: 'bottom 60%', scrub: 0.5 } },
      );
    },
    [tab],
  );

  const onTabKey = (e: KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    setTab(tabs[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative w-full border-t border-slate-200/80 bg-white px-4 py-20 sm:px-8 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center">
        <SectionLabel id="experience" className="mb-5" />
        <Reveal>
          <div role="tablist" aria-label="Career history" className="mb-4 inline-flex items-center rounded-pill border border-slate-200 bg-slate-100 p-1 shadow-sm">
            {tabs.map((t, i) => {
              const selected = t.id === tab;
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={selected}
                  aria-controls="timeline-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setTab(t.id)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={cn(
                    'relative rounded-pill px-6 py-2 text-xs tracking-widest uppercase transition-colors',
                    selected ? 'font-bold text-slate-900' : 'font-semibold text-slate-500 hover:text-slate-900',
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="timeline-tab"
                      className="absolute inset-0 rounded-pill border border-slate-200 bg-white shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative">{t.label}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <p className="mt-2 mb-3 font-mono text-xs font-bold tracking-widest text-indigo-600 uppercase">{current.eyebrow}</p>
        <h2 id="experience-title" className="mb-20 text-center font-display text-4xl font-black tracking-tight text-slate-900 uppercase sm:text-5xl lg:text-6xl">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={current.id}
              className="inline-block"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              {current.title}
            </motion.span>
          </AnimatePresence>
        </h2>

        <div ref={timeline} id="timeline-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="relative w-full">
          <div aria-hidden="true" className="pointer-events-none absolute top-4 bottom-4 left-4 w-[2px] -translate-x-1/2 bg-slate-200 md:left-1/2" />
          <div
            data-spine
            aria-hidden="true"
            className="pointer-events-none absolute top-4 bottom-4 left-4 w-[2px] origin-top -translate-x-1/2 bg-gradient-to-b from-indigo-500 via-sky-400 to-indigo-500 opacity-70 shadow-[0_0_12px_rgba(79,70,229,0.5)] md:left-1/2"
          />
          <ol key={tab} className="relative space-y-16 md:space-y-24">
            {current.entries.map((entry, i) => (
              <Milestone key={entry.role + entry.period} entry={entry} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
