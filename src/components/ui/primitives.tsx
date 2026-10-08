import type { ReactNode } from 'react';
import { sectionNumber, sections, type SectionId } from '../../data/content';
import { Reveal, SplitHeading, type TextLine } from './Reveal';

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

/** Pulsing status dot used across badges. */
export function PulseDot({ className = 'bg-emerald-500', size = 'w-1.5 h-1.5' }: { className?: string; size?: string }) {
  return <span aria-hidden="true" className={cn('inline-block shrink-0 animate-pulse rounded-full', size, className)} />;
}

/** "01 — SELECTED WORK" eyebrow; number and text come from the page outline. */
export function SectionLabel({ id, className }: { id: SectionId; className?: string }) {
  const section = sections.find((s) => s.id === id)!;
  return (
    <Reveal className={cn('mb-3 flex items-center gap-2 font-mono text-xs font-semibold tracking-widest text-indigo-600 uppercase', className)}>
      <span aria-hidden="true" className="inline-block h-px w-6 bg-indigo-600" />
      <span>
        {sectionNumber(id)} — {section.eyebrow}
      </span>
    </Reveal>
  );
}

const headingSize = 'font-display text-3xl font-black tracking-tight text-slate-900 uppercase sm:text-4xl lg:text-5xl';

export function SectionHeading({ lines, className, id }: { lines: TextLine[]; className?: string; id?: string }) {
  return <SplitHeading id={id} lines={lines} className={cn(headingSize, className)} />;
}

/** Small rectangular tech tag (bg-slate-100 chip). */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('rounded-xs border border-slate-200 bg-slate-100 px-2 py-0.5', className)}>{children}</span>
  );
}

/**
 * Section wrapper. Backgrounds alternate white / muted by position in the page outline, so
 * reordering sections never breaks the rhythm. A soft gradient at the top carries the previous
 * section's colour into this one, so the page reads as one continuous surface rather than
 * stacked blocks.
 */
export function Section({
  id,
  className,
  children,
  labelledBy,
  spacious,
}: {
  id: string;
  className?: string;
  children: ReactNode;
  labelledBy?: string;
  spacious?: boolean;
}) {
  const order = sections.findIndex((s) => s.id === id);
  const muted = order % 2 === 1;
  const prevMuted = order > 0 && (order - 1) % 2 === 1;
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        'relative isolate w-full px-4 sm:px-8 lg:px-16',
        spacious ? 'py-24' : 'py-20',
        muted ? 'bg-slate-50/70' : 'bg-white',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b to-transparent',
          order <= 0 || prevMuted ? 'from-slate-50' : 'from-white',
        )}
      />
      {children}
    </section>
  );
}
