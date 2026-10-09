import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { sectionNumber, sections } from '../../data/content';
import { useLang } from '../../i18n/LangProvider';
import { useActiveSection } from '../../hooks/useActiveSection';
import { cn, PulseDot } from '../ui/primitives';
import { LangSwitcher } from './LangSwitcher';

// Observe every section so the nav clears its highlight in sections that have no link.
const observedIds = ['top', ...sections.map((s) => s.id)];

export function Header() {
  const { t, content } = useLang();
  const { navLinks, site } = content;
  // Mobile menu: Home plus every section of the page, in order.
  const menu = [{ id: 'top', label: navLinks[0].label }, ...content.sections.map((s) => ({ id: s.id, label: s.nav ?? s.eyebrow }))];
  const active = useActiveSection(observedIds);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstMobileLink = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    if (!open) return;
    firstMobileLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    // The menu only exists below lg; close it if the viewport grows past that.
    const wide = window.matchMedia('(min-width: 1024px)');
    const onWide = () => wide.matches && setOpen(false);
    window.addEventListener('keydown', onKey);
    wide.addEventListener('change', onWide);
    return () => {
      window.removeEventListener('keydown', onKey);
      wide.removeEventListener('change', onWide);
    };
  }, [open]);

  return (
    <header className="fixed top-0 left-0 z-50 w-full px-3 pt-3 pb-3 sm:px-6 lg:px-12">
      <a
        href="#main"
        className="sr-only rounded-xl bg-slate-900 px-4 py-2 text-sm text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
      >
        {t.header.skip}
      </a>
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto flex max-w-7xl items-center justify-between rounded-pill border border-slate-200/80 bg-white/85 px-4 py-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl backdrop-saturate-180 sm:px-6"
      >
        {/* Reading progress */}
        <motion.span
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="absolute inset-x-4 -bottom-px h-[2px] origin-left rounded-full bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500"
        />

        <a href="#top" className="group flex items-center gap-3" aria-label={t.header.backToTopNamed(site.name)}>
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

        <nav aria-label={t.header.primary} className="hidden items-center gap-6 text-xs tracking-wide lg:flex">
          {navLinks
            .filter((link) => link.id !== 'contact')
            .map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              aria-current={active === link.id ? 'location' : undefined}
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
          <LangSwitcher className="max-[479px]:hidden" />
          <div className="hidden items-center gap-2 rounded-pill border border-emerald-200 bg-emerald-50 px-3 py-1 xl:flex">
            <PulseDot className="bg-emerald-600" />
            <span className="font-mono text-[10px] font-semibold tracking-wider text-emerald-700 uppercase">{t.header.available}</span>
          </div>
          <a
            href="#contact"
            aria-current={active === 'contact' ? 'location' : undefined}
            className="inline-flex items-center rounded-pill bg-indigo-600 px-3 py-1.5 font-mono text-xs font-bold tracking-wider whitespace-nowrap text-white uppercase shadow-md shadow-indigo-600/25 transition-all hover:scale-105 hover:bg-indigo-700 active:scale-95 sm:px-4"
          >
            {t.header.contact}
          </a>
          <button
            ref={menuButton}
            type="button"
            className="-mr-1 rounded-lg p-1.5 text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.header.closeMenu : t.header.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <>
            {/* Click-away layer */}
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 -z-10 bg-slate-900/10 backdrop-blur-[2px] lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              id="mobile-nav"
              aria-label={t.header.mobile}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mx-auto mt-2 max-w-7xl rounded-pill border border-slate-200/80 bg-white/95 p-2 shadow-lg backdrop-blur-xl lg:hidden"
            >
              {/* On small screens the menu doubles as a full page outline. */}
              <ul className="grid grid-cols-2 gap-1">
                {menu.map((section, i) => (
                  <li key={section.id}>
                    <a
                      ref={i === 0 ? firstMobileLink : undefined}
                      href={`#${section.id}`}
                      aria-current={active === section.id ? 'location' : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium hover:bg-slate-100 hover:text-slate-950',
                        active === section.id ? 'bg-slate-100 text-slate-950' : 'text-slate-700',
                      )}
                    >
                      <span aria-hidden="true" className="font-mono text-[11px] text-indigo-600">
                        {sectionNumber(section.id)}
                      </span>
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-1 flex items-center gap-2 border-t border-slate-100 px-4 pt-3 pb-2 font-mono text-[10px] font-semibold tracking-wider text-emerald-700 uppercase">
                <PulseDot className="bg-emerald-600" />
                {t.header.available}
              </p>
              <LangSwitcher className="mx-4 mt-2 mb-2 min-[480px]:hidden" />
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
