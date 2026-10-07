import { aboutValues, site } from '../data/content';
import { PortraitPanel } from '../components/ui/PortraitPanel';
import { Reveal, Stagger, StaggerItem } from '../components/ui/Reveal';
import { Section, SectionHeading, SectionLabel } from '../components/ui/primitives';

export function About() {
  return (
    <Section id="about" tone="muted" labelledBy="about-title">
      <div className="mx-auto max-w-7xl">
        <SectionLabel>08 — ABOUT</SectionLabel>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <SectionHeading
              id="about-title"
              className="leading-tight"
              lines={[{ text: 'I care about the details' }, { text: "you'd notice if they were missing.", gradient: true }]}
            />
            <Reveal as="p" className="text-base leading-relaxed text-slate-700 sm:text-lg">
              I studied software engineering in Marrakech and Essaouira, then went through the ALX program. Since then
              I've worked in agencies and alongside product teams, so I'm comfortable on both sides: the code, and the
              business that depends on it.
            </Reveal>
            <Reveal as="p" delay={0.08} className="text-base leading-relaxed text-slate-600">
              These days a big part of my workflow is vibe coding: using AI to prototype, debug, and iterate quickly. It
              makes me faster. It doesn't make the decisions. Architecture and code quality are still on me.
            </Reveal>
            <Stagger className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
              {aboutValues.map((v) => (
                <StaggerItem key={v.title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <h3 className="mb-1 font-display text-sm font-bold text-slate-900">{v.title}</h3>
                  <p className="text-xs text-slate-500">{v.text}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div className="lg:col-span-5">
            <PortraitPanel src="/images/portrait-office.webp" alt={`Portrait of ${site.name}`} width={512} height={512} aspect="aspect-square contrast-110">
              <span className="mb-1 flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-indigo-600">{site.location}, {site.country}</span>
                <span className="font-semibold text-slate-600">{site.timezone}</span>
              </span>
              <span className="block font-mono text-xs font-bold text-slate-900">{site.name} · {site.role}</span>
            </PortraitPanel>
          </div>
        </div>
      </div>
    </Section>
  );
}
