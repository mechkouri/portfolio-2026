import { services } from '../data/content';
import { accents } from '../lib/accents';
import { Reveal, Stagger, StaggerItem } from '../components/ui/Reveal';
import { cn, Section, SectionHeading, SectionLabel, Tag } from '../components/ui/primitives';

export function Services() {
  return (
    <Section id="services" tone="muted" labelledBy="services-title">
      <div className="mx-auto max-w-7xl">
        <SectionLabel>02 — WHAT I DO</SectionLabel>
        <SectionHeading id="services-title" className="mb-4" lines={[{ text: 'Digital solutions, from interface to automation.' }]} />
        <Reveal as="p" className="mb-12 max-w-2xl text-slate-600">
          End-to-end capabilities covering modern web development, high-converting CMS platforms, search visibility, and
          intelligent automated workflows.
        </Reveal>

        <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2" stagger={0.1}>
          {services.map((s) => {
            const a = accents[s.accent];
            const Icon = s.icon;
            return (
              <StaggerItem
                key={s.title}
                as="article"
                className={cn(
                  'group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl',
                  a.hoverBorder,
                  a.hoverShadow,
                )}
              >
                <div>
                  <div className={cn('mb-6 flex h-12 w-12 items-center justify-center rounded-xl border shadow-sm transition-transform group-hover:scale-110 group-hover:-rotate-6', a.iconBox)}>
                    <Icon aria-hidden="true" size={24} />
                  </div>
                  <p className={cn('mb-1 font-mono text-[11px] font-bold tracking-wider uppercase', a.text)}>{s.kicker}</p>
                  <h3 className={cn('mb-3 font-display text-2xl font-bold text-slate-900 uppercase transition-colors', a.groupHoverText)}>
                    {s.title}
                  </h3>
                  <p className="mb-6 leading-relaxed text-slate-600">{s.description}</p>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <span className="mb-2 block font-mono text-[10px] font-semibold tracking-widest text-slate-400 uppercase">Technologies</span>
                  <ul className="flex flex-wrap gap-1.5 font-mono text-xs text-slate-700" aria-label={`${s.title} technologies`}>
                    {s.tech.map((t) => (
                      <li key={t}>
                        <Tag>{t}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Section>
  );
}
