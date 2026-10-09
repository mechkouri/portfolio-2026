import { useLang } from '../i18n/LangProvider';
import { accents } from '../lib/accents';
import { Reveal, Stagger, StaggerItem } from '../components/ui/Reveal';
import { cn, Section, SectionHeading, SectionLabel } from '../components/ui/primitives';

export function Skills() {
  const { t, content } = useLang();
  const { techCategories } = content;
  return (
    <Section id="skills" labelledBy="skills-title">
      <div className="mx-auto max-w-7xl">
        <SectionLabel id="skills" />
        <SectionHeading id="skills-title" className="mb-4" lines={[{ text: t.skills.heading }]} />
        <Reveal as="p" className="mb-12 max-w-2xl text-slate-600">
          {t.skills.intro}
        </Reveal>

        <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {techCategories.map((cat, i) => {
            const a = accents[cat.accent];
            const Icon = cat.icon;
            return (
              <StaggerItem
                key={cat.accent + i}
                className={cn('group rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-colors', a.hoverBorder)}
              >
                <div className="mb-4 flex items-center gap-3">
                  <Icon aria-hidden="true" size={20} className={cn('transition-transform group-hover:rotate-12', a.text)} />
                  <h3 className="font-display text-lg font-bold text-slate-900 uppercase">{cat.title}</h3>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-pill border border-slate-200 bg-slate-100 px-3 py-1 font-mono text-xs text-slate-700 transition-colors hover:border-slate-300 hover:bg-white"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Section>
  );
}
