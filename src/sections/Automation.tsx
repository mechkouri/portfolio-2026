import { motion } from 'motion/react';
import { Gauge, Workflow } from 'lucide-react';
import { pipelineNodes, workflows } from '../data/content';
import { accents } from '../lib/accents';
import { Reveal, Stagger, StaggerItem } from '../components/ui/Reveal';
import { cn, PulseDot, Section, SectionHeading, SectionLabel } from '../components/ui/primitives';

export function Automation() {
  return (
    <Section id="automation" labelledBy="automation-title">
      <div className="mx-auto max-w-7xl space-y-16">
        <div className="max-w-4xl">
          <SectionLabel id="automation" />
          <SectionHeading
            id="automation-title"
            className="leading-tight"
            lines={[{ text: 'If you do it every week,' }, { text: 'it should run on its own.', gradient: true }]}
          />
          <Reveal as="p" className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Most businesses run on a stack of tools that don't talk to each other. I connect them with n8n and Make.com:
            content, SEO tasks, leads, notifications, and data syncs. I add AI where it saves time, not just because I can.
          </Reveal>
          <Reveal as="div" delay={0.1} className="mt-6 flex flex-wrap gap-2 font-mono text-xs font-semibold text-indigo-700">
            {['n8n', 'Make.com', 'APIs', 'Webhooks', 'AI-assisted workflows'].map((tool) => (
              <span key={tool} className="rounded-pill border border-indigo-200 bg-indigo-50 px-3 py-1">
                {tool}
              </span>
            ))}
          </Reveal>
        </div>

        {/* Pipeline diagram */}
        <Reveal className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <PulseDot className="bg-indigo-600" size="w-2.5 h-2.5" />
              <h3 className="font-mono text-xs font-semibold tracking-wider text-slate-800 uppercase">
                From trigger to result: Trigger → Process → AI → Integration → Action
              </h3>
            </div>
            <span className="hidden font-mono text-[11px] font-bold text-indigo-600 sm:inline">N8N · MAKE.COM</span>
          </div>
          <p className="mb-8 max-w-3xl text-sm text-slate-600">
            A workflow can start from a form, spreadsheet, API, webhook, or scheduled event — then automatically process
            data, use AI when needed, update systems, and deliver the final result.
          </p>

          <div className="relative">
            {/* Data-flow connector drawn as the diagram enters view */}
            <motion.div
              aria-hidden="true"
              className="absolute top-1/2 right-[10%] left-[10%] hidden h-px origin-left bg-gradient-to-r from-indigo-400 via-amber-400 to-indigo-400 md:block"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
            />
            <Stagger as="ul" className="relative grid grid-cols-2 gap-3 md:grid-cols-5" stagger={0.14}>
              {pipelineNodes.map((n, i) => {
                const a = accents[n.accent];
                const Icon = n.icon;
                return (
                  <StaggerItem
                    as="li"
                    key={n.title}
                    className={cn(
                      'group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md',
                      a.hoverBorder,
                      i === pipelineNodes.length - 1 && 'col-span-2 md:col-span-1',
                    )}
                  >
                    <span className={cn('font-mono text-[10px] font-bold uppercase', a.text)}>NODE {String(i + 1).padStart(2, '0')}</span>
                    <div className="my-4">
                      <Icon aria-hidden="true" size={24} className={cn('mb-1 transition-transform group-hover:scale-110', a.text)} />
                      <h4 className="font-display text-base font-bold text-slate-900">{n.title}</h4>
                    </div>
                    <p className="font-mono text-[11px] text-slate-500">{n.detail}</p>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </Reveal>

        {/* Real-world workflow examples */}
        <div>
          <Reveal className="mb-6 flex items-center gap-2">
            <Workflow aria-hidden="true" size={16} className="text-indigo-600" />
            <h3 className="font-mono text-xs font-bold tracking-wider text-slate-900 uppercase">Examples of workflows I build</h3>
          </Reveal>
          <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {workflows.map((w) => {
              const a = accents[w.accent];
              return (
                <StaggerItem
                  as="article"
                  key={w.title}
                  className={cn('flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md', a.hoverBorder)}
                >
                  <div>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h4 className="font-display text-lg font-bold text-slate-900">{w.title}</h4>
                      <span className={cn('shrink-0 rounded-pill border px-2.5 py-0.5 font-mono text-[10px] font-semibold', a.pill)}>{w.badge}</span>
                    </div>
                    <ol className="flex flex-wrap items-center gap-1.5 py-3 font-mono text-xs text-slate-700" aria-label={`${w.title} steps`}>
                      {w.steps.map((step, i) => {
                        const last = i === w.steps.length - 1;
                        return (
                          <li key={step} className="flex items-center gap-1.5">
                            {i > 0 && (
                              <span aria-hidden="true" className={a.text}>
                                →
                              </span>
                            )}
                            <span className={cn('rounded-xs border px-2 py-1', last ? cn(a.strongChip, 'font-bold') : 'border-slate-200 bg-slate-100')}>
                              {step}
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                  <p className="mt-2 font-mono text-[11px] text-slate-500">{w.note}</p>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>

        <Reveal className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-sky-50 to-indigo-50 p-6 text-center shadow-sm sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-indigo-600 text-white shadow-sm">
              <Gauge aria-hidden="true" size={20} />
            </span>
            <p className="text-left font-display text-lg font-bold text-slate-900 sm:text-xl">
              Tired of a task you do every week? Tell me about it. There's a good chance it can run on its own.
            </p>
          </div>
          <a
            href="#contact"
            className="rounded-pill bg-indigo-600 px-5 py-2.5 font-mono text-xs font-bold tracking-wider whitespace-nowrap text-white uppercase shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700"
          >
            Plan An Automation
          </a>
        </Reveal>
      </div>
    </Section>
  );
}
