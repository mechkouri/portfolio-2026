import { Zap } from 'lucide-react';
import { introFacts, site } from '../data/content';
import { PortraitPanel } from '../components/ui/PortraitPanel';
import { Reveal, Stagger, StaggerItem } from '../components/ui/Reveal';
import { PulseDot, Section, SectionHeading, SectionLabel } from '../components/ui/primitives';

export function Intro() {
  return (
    <Section id="intro" labelledBy="intro-title">
      <div className="mx-auto max-w-7xl">
        <SectionLabel>01 — INTRODUCTION</SectionLabel>
        <SectionHeading id="intro-title" className="mb-12" lines={[{ text: 'Websites, apps, and the systems behind them.' }]} />

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <Reveal as="p" className="text-base leading-relaxed text-slate-700 sm:text-lg">
              I'm Said, a full-stack developer based in {site.location}. I build modern websites and web apps, and the
              automations that connect them to the rest of a business.
            </Reveal>
            <Reveal as="p" delay={0.08} className="text-base leading-relaxed text-slate-600">
              My work moves between code, WordPress, SEO, and automation. I like clean interfaces, tricky bugs, and wiring
              tools together so nobody has to do the same task twice.
            </Reveal>

            <Reveal delay={0.12} className="relative overflow-hidden rounded-2xl border-l-4 border-indigo-600 bg-indigo-50/60 p-6 shadow-sm">
              <p className="mb-2 flex items-center gap-2 font-mono text-xs font-bold tracking-wider text-indigo-700 uppercase">
                <Zap aria-hidden="true" size={16} />
                <span>My approach</span>
              </p>
              <blockquote className="font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Build fast. Automate more. Keep it simple.
              </blockquote>
            </Reveal>

            <Stagger className="grid grid-cols-3 gap-3 pt-2">
              {introFacts.map((f) => (
                <StaggerItem key={f.title} className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                  <span className={`block font-display text-lg font-bold ${f.color}`}>{f.title}</span>
                  <span className="font-mono text-[11px] text-slate-500 uppercase">{f.label}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div className="lg:col-span-5">
            <PortraitPanel
              src="/images/portrait-studio.webp"
              alt={`Portrait of ${site.name}`}
              width={512}
              height={341}
              aspect="aspect-[4/3]"
            >
              <span className="mb-1 flex items-center justify-between gap-2 font-mono text-[11px]">
                <span className="flex items-center gap-1.5 font-bold text-indigo-600">
                  <PulseDot size="w-2 h-2" />
                  {site.name} // {site.role}
                </span>
                <span className="font-bold text-emerald-600">ONLINE</span>
              </span>
              <span className="block font-mono text-[11px] text-slate-700">Code · WordPress · SEO · Automation</span>
            </PortraitPanel>
          </div>
        </div>
      </div>
    </Section>
  );
}
