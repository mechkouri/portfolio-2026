import { Zap } from 'lucide-react';
import { introFacts, site } from '../data/content';
import { PortraitPanel } from '../components/ui/PortraitPanel';
import { Reveal, Stagger, StaggerItem } from '../components/ui/Reveal';
import { Section, SectionHeading, SectionLabel } from '../components/ui/primitives';

export function About() {
  return (
    <Section id="about" labelledBy="about-title">
      <div className="mx-auto max-w-7xl">
        <SectionLabel id="about" />
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <SectionHeading
              id="about-title"
              className="leading-tight"
              lines={[{ text: 'I care about the details' }, { text: "you'd notice if they were missing.", gradient: true }]}
            />
            <Reveal as="p" className="text-base leading-relaxed text-slate-700 sm:text-lg">
              I'm Said, a full-stack developer based in {site.location}. My work moves between code, WordPress, SEO, and
              automation. I like clean interfaces, tricky bugs, and wiring tools together so nobody has to do the same task
              twice.
            </Reveal>
            <Reveal as="p" delay={0.06} className="text-base leading-relaxed text-slate-600">
              I studied software engineering in Marrakech and Essaouira, then went through the ALX program. Since then
              I've worked in agencies and alongside product teams, so I'm comfortable on both sides: the code, and the
              business that depends on it.
            </Reveal>
            <Reveal as="p" delay={0.12} className="text-base leading-relaxed text-slate-600">
              These days a big part of my workflow is AI-assisted development: using AI to prototype, debug, and iterate quickly. It
              makes me faster. It doesn't make the decisions. Architecture and code quality are still on me.
            </Reveal>

            <Reveal delay={0.16} className="relative overflow-hidden rounded-2xl border-l-4 border-indigo-600 bg-indigo-50/60 p-6 shadow-sm">
              <p className="mb-2 flex items-center gap-2 font-mono text-xs font-bold tracking-wider text-indigo-700 uppercase">
                <Zap aria-hidden="true" size={16} />
                <span>My approach</span>
              </p>
              <blockquote className="font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Build fast. Automate more. Keep it simple.
              </blockquote>
            </Reveal>

            <Stagger className="grid grid-cols-3 gap-3">
              {introFacts.map((f) => (
                <StaggerItem key={f.title} className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                  <span className={`block font-display text-lg font-bold ${f.color}`}>{f.title}</span>
                  <span className="font-mono text-[11px] text-slate-500 uppercase">{f.label}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div className="lg:col-span-5">
            <PortraitPanel src="/images/portrait-office.webp" alt={`Portrait of ${site.name}`} width={512} height={512} aspect="aspect-square contrast-110">
              <span className="mb-1 flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-indigo-600">
                  {site.location}, {site.country}
                </span>
                <span className="font-semibold text-slate-600">{site.timezone}</span>
              </span>
              <span className="block font-mono text-xs font-bold text-slate-900">
                {site.name} · {site.role}
              </span>
            </PortraitPanel>
          </div>
        </div>
      </div>
    </Section>
  );
}
