import { processSteps } from '../data/content';
import { accents } from '../lib/accents';
import { Reveal, Stagger, StaggerItem } from '../components/ui/Reveal';
import { cn, Section, SectionHeading, SectionLabel } from '../components/ui/primitives';

export function Process() {
  return (
    <Section id="process" labelledBy="process-title">
      <div className="mx-auto max-w-7xl">
        <SectionLabel>05 — HOW I WORK</SectionLabel>
        <SectionHeading id="process-title" className="mb-4" lines={[{ text: 'A simple process. A strong result.' }]} />
        <Reveal as="p" className="mb-12 max-w-2xl text-slate-600">
          No black box. You know what's happening at every step.
        </Reveal>

        <Stagger as="ul" className="relative grid grid-cols-1 gap-4 md:grid-cols-5" stagger={0.1}>
          {processSteps.map((step, i) => {
            const a = accents[step.accent];
            return (
              <StaggerItem
                as="li"
                key={step.title}
                className={cn(
                  'group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg',
                  a.hoverBorder,
                )}
              >
                <div>
                  <span aria-hidden="true" className={cn('mb-4 block font-display text-3xl font-extrabold transition-colors', a.numberFaded)}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mb-2 font-display text-xl font-bold text-slate-900">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{step.description}</p>
                </div>
                <div className="mt-6 border-t border-slate-200 pt-4">
                  <span className="font-mono text-[10px] font-semibold text-slate-400 uppercase">{step.label}</span>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Section>
  );
}
