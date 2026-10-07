import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { navLinks, site } from '../../data/content';
import { useActiveSection } from '../../hooks/useActiveSection';
import { cn, PulseDot } from '../ui/primitives';

// Observe every section so the nav clears its highlight in sections that have no link.
const sectionIds = ['top', 'intro', 'services', 'automation', 'work', 'process', 'tech', 'experience', 'about', 'contact'];

export function Header() {
  const active = useActiveSection(sectionIds);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="fixed top-0 left-0 z-50 w-full px-3 pt-3 pb-3 sm:px-6 lg:px-12">
      <a
        href="#main"
        className="sr-only rounded-xl bg-slate-900 px-4 py-2 text-sm text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex max-w-7xl items-center justify-between rounded-pill border border-slate-200/80 bg-white/85 px-4 py-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl backdrop-saturate-180 sm:px-6"
      >
        <a href="#top" className="group flex items-center gap-3" aria-label={`${site.name} — back to top`}>
          <span className="flex items-center justify-center rounded-lg bg-slate-900 p-1 shadow-sm transition-transform duration-300 group-hover:scale-105">
            <img src="/images/logo.png" alt="" width={200} height={142} className="h-5 w-auto object-contain brightness-0 invert sm:h-6" />
          </span>
          <span className="flex flex-col">
            <span className="font-display text-xs leading-tight font-bold tracking-wide text-slate-900 transition-colors group-hover:text-indigo-600 sm:text-sm">
              {site.name}
            </span>
            <span className="font-mono text-[10px] tracking-widest whitespace-nowrap text-slate-500 uppercase max-[400px]:hidden">{site.tagline}</span>
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-6 text-xs tracking-wide md:flex">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              aria-current={active === link.id ? 'true' : undefined}
              className={cn(
                'relative py-1 font-medium transition-colors hover:text-slate-950',
                active === link.id ? 'text-slate-950' : 'text-slate-600',
              )}
            >
              {link.label}
              {active === link.id && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-0 -bottom-0.5 h-px bg-indigo-600"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-pill border border-emerald-200 bg-emerald-50 px-3 py-1 sm:flex">
            <PulseDot className="bg-emerald-600" />
            <span className="font-mono text-[10px] font-semibold tracking-wider text-emerald-700 uppercase">
              Available for projects
            </span>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center rounded-pill bg-indigo-600 px-3 py-1.5 whitespace-nowrap sm:px-4 font-mono text-xs font-bold tracking-wider text-white uppercase shadow-md shadow-indigo-600/25 transition-all hover:scale-105 hover:bg-indigo-700 active:scale-95"
          >
            Let's Talk
          </a>
          <button
            ref={menuButton}
            type="button"
            className="-mr-1 rounded-lg p-1.5 text-slate-700 hover:bg-slate-100 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 max-w-7xl rounded-pill border border-slate-200/80 bg-white/95 p-2 shadow-lg backdrop-blur-xl md:hidden"
          >
            <ul className="grid gap-1">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
