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

// Translucent on purpose: the fixed flow backdrop shows through every section.
const TONES = {
  page: 'rgba(255, 255, 255, 0)',
  white: 'rgba(255, 255, 255, 0.4)',
  muted: 'rgba(241, 245, 249, 0.34)',
} as const;

/**
 * Section wrapper. Tints alternate white / muted by position in the page outline, so reordering
 * sections never breaks the rhythm. The top of each section blends from the previous section's tint
 * into its own, so the page reads as one continuous surface rather than stacked blocks.
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
  const self = order % 2 === 1 ? TONES.muted : TONES.white;
  const prev = order <= 0 ? TONES.page : (order - 1) % 2 === 1 ? TONES.muted : TONES.white;
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn('relative isolate w-full px-4 sm:px-8 lg:px-16', spacious ? 'py-24' : 'py-20', className)}
      style={{ backgroundImage: `linear-gradient(to bottom, ${prev}, ${self} 7rem)`, backgroundColor: self }}
    >
      {children}
    </section>
  );
}
