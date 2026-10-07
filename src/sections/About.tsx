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
              lines={[{ text: 'Technology is a tool.' }, { text: 'The real value is what you create with it.', gradient: true }]}
            />
            <Reveal as="p" className="text-base leading-relaxed text-slate-700 sm:text-lg">
              I believe good development is not only about writing code. It's about understanding people, simplifying
              complexity, and creating systems that solve real problems.
            </Reveal>
            <Reveal as="p" delay={0.08} className="text-base leading-relaxed text-slate-600">
              That's why I combine software engineering with design, SEO, automation, and AI. I'm constantly learning,
              experimenting with new technologies, and looking for better ways to build digital products.
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
                <span className="font-bold text-indigo-600">Casablanca, Morocco</span>
                <span className="font-semibold text-slate-600">EST. 2017</span>
              </span>
              <span className="block font-mono text-xs font-bold text-slate-900">{site.name} · Software Engineer</span>
            </PortraitPanel>
          </div>
        </div>
      </div>
    </Section>
  );
}
