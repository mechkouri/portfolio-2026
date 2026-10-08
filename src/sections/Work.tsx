import { type PointerEvent } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react';
import { ArrowDown, ArrowRight, Code, Globe, ShieldCheck, ShoppingCart } from 'lucide-react';
import { featuredProjects, moreProjects, type Project } from '../data/content';
import { accents } from '../lib/accents';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';
import { Reveal, Stagger, StaggerItem } from '../components/ui/Reveal';
import { cn, Section, SectionHeading, SectionLabel, Tag } from '../components/ui/primitives';

const siteIcons = { globe: Globe, shield: ShieldCheck, code: Code, cart: ShoppingCart };
const TILT = 5;

function ProjectCard({ project, compact = false }: { project: Project; compact?: boolean }) {
  const { canHover } = useDeviceCapabilities();
  const a = accents[project.accent];
  const SiteIcon = siteIcons[project.siteIcon];

  const rotateX = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 });
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const spotlight = useMotionTemplate`radial-gradient(360px circle at ${mx}px ${my}px, rgba(${a.rgb}, 0.10), transparent 70%)`;

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rotateY.set((px - 0.5) * TILT * 2);
    rotateX.set(-(py - 0.5) * TILT * 2);
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };
  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    mx.set(-200);
    my.set(-200);
  };

  const href = project.url ?? '#contact';

  return (
    <motion.article
      onPointerMove={canHover ? onMove : undefined}
      onPointerLeave={canHover ? onLeave : undefined}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-[border-color,box-shadow] duration-500 hover:shadow-xl focus-within:shadow-xl',
        a.hoverBorder,
        a.hoverShadow,
      )}
    >
      <motion.div aria-hidden="true" style={{ background: spotlight }} className="pointer-events-none absolute inset-0 z-10" />

      {/* Browser chrome */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-slate-200 bg-slate-100 px-3.5">
        <div aria-hidden="true" className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <span className="max-w-[190px] truncate rounded-pill border border-slate-200 bg-white px-3 py-0.5 font-mono text-[10px] text-slate-600 shadow-xs">
          {project.label}
        </span>
        <SiteIcon aria-hidden="true" size={14} className="text-slate-400" />
      </div>

      {/* Viewport: full-page screenshot scrolls on hover/focus */}
      <div className={cn('relative overflow-hidden bg-slate-100', compact ? 'h-[280px]' : 'h-[380px]')}>
        <img
          src={project.image}
          alt={project.imageAlt}
          loading="lazy"
          decoding="async"
          className={cn(
            'w-full object-cover object-top transition-transform ease-in-out',
            compact
              ? 'duration-[7000ms] group-focus-within:-translate-y-[calc(100%-280px)] group-hover:-translate-y-[calc(100%-280px)]'
              : 'duration-[5500ms] group-focus-within:-translate-y-[calc(100%-380px)] group-hover:-translate-y-[calc(100%-380px)]',
          )}
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
      </div>

      <div className={cn('flex flex-1 flex-col justify-between', compact ? 'p-5' : 'p-6')}>
        <div>
          <p className={cn('font-mono text-[10px] font-bold tracking-wider uppercase', a.text)}>{project.category}</p>
          <h3
            className={cn(
              'mt-1 mb-2 font-display font-bold text-slate-900 transition-colors',
              compact ? 'text-lg' : 'text-xl',
              a.groupHoverText,
            )}
          >
            {project.title}
          </h3>
          <p className={cn('text-sm leading-relaxed text-slate-600', !compact && 'mb-4')}>{project.description}</p>
        </div>
        {!compact && (
          <div>
            {project.tags.length > 0 && (
              <ul className="mb-4 flex flex-wrap gap-1.5 font-mono text-[11px] text-slate-600" aria-label="Technologies">
                {project.tags.map((t) => (
                  <li key={t}>
                    <Tag>{t}</Tag>
                  </li>
                ))}
              </ul>
            )}
            <a
              href={href}
              {...(project.url ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className={cn('group/btn relative z-20 inline-flex items-center gap-1.5 font-mono text-xs font-bold', a.text, a.hoverText)}
            >
              <span>{project.url ? 'View Project' : 'Need something similar?'}</span>
              <span className="sr-only">: {project.title}</span>
              <ArrowRight aria-hidden="true" size={12} className="transition-transform group-hover/btn:translate-x-1" />
            </a>
          </div>
        )}
      </div>
    </motion.article>
  );
}

export function Work() {
  return (
    <Section id="work" labelledBy="work-title">
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <SectionLabel id="work" />
            <SectionHeading id="work-title" lines={[{ text: "A selection of things I've built." }]} />
            <Reveal as="p" className="mt-2 max-w-2xl text-slate-600">
              Three highlights first, then more sites and stores I've built. Hover or focus a card to scroll the full page.
            </Reveal>
          </div>
          <a
            href="#projects-grid"
            aria-label="Jump to projects"
            className="flex h-9 w-9 items-center justify-center rounded-pill border border-slate-300 bg-white text-slate-700 shadow-sm transition-all hover:border-indigo-400 hover:text-indigo-600"
          >
            <ArrowDown aria-hidden="true" size={16} />
          </a>
        </div>

        <div id="projects-grid">
          <Stagger className="grid grid-cols-1 gap-8 lg:grid-cols-3" stagger={0.12}>
            {featuredProjects.map((p) => (
              <StaggerItem key={p.title} className="h-full">
                <ProjectCard project={p} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <div className="space-y-6 pt-4">
          <Reveal className="flex items-baseline justify-between gap-4 border-b border-slate-200 pb-3">
            <h3 className="font-display text-2xl font-bold tracking-tight text-slate-900">More projects</h3>
            <span className="font-mono text-xs tracking-widest text-slate-400 uppercase">{moreProjects.length} more</span>
          </Reveal>
          <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4" stagger={0.06}>
            {moreProjects.map((p) => (
              <StaggerItem key={p.title} className="h-full">
                <ProjectCard project={p} compact />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </Section>
  );
}
