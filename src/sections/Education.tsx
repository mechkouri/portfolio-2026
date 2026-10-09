import { useLang } from '../i18n/LangProvider';
import { Stagger, StaggerItem } from '../components/ui/Reveal';
import { Section, SectionHeading, SectionLabel } from '../components/ui/primitives';

/** Compact on purpose: education supports the story, it doesn't lead it. */
export function Education() {
  const { t, content } = useLang();
  const { education } = content;
  return (
    <Section id="education" labelledBy="education-title">
      <div className="mx-auto max-w-7xl">
        <SectionLabel id="education" />
        <SectionHeading id="education-title" className="mb-8 text-2xl! sm:text-3xl!" lines={[{ text: t.education.heading }]} />

        <Stagger as="ul" className="grid gap-4 sm:grid-cols-2" stagger={0.08}>
          {education.map((entry, i) => (
            <StaggerItem as="li" key={i}>
              <article className="group flex h-full items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/10">
                <span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-2">
                  {entry.logo ? (
                    // The school name is in the text beside it, so the logo is decorative.
                    <img src={entry.logo} alt="" loading="lazy" decoding="async" className="h-full w-full object-contain" />
                  ) : (
                    <span className="font-mono text-xs font-bold text-indigo-700">{entry.badge}</span>
                  )}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600">{entry.role}</h3>
                  <p className="mt-0.5 font-mono text-[11px] font-bold tracking-wider text-indigo-600 uppercase">{entry.org}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    <time>{entry.period}</time>
                    {entry.note && <span> · {entry.note}</span>}
                  </p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
