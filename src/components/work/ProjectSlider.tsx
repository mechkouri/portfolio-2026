import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { projects } from '../../data/content';
import { cn } from '../ui/primitives';
import { ProjectCard } from './ProjectCard';

const GAP = 24; // keep in sync with gap-6
const PAD = 12; // keep in sync with px-3 / scroll-px-3
const DRAG_THRESHOLD = 6;

interface Position {
  /** Index of the first fully visible card. */
  index: number;
  /** How many cards fit in the track at this width. */
  visible: number;
  atStart: boolean;
  atEnd: boolean;
}

function ArrowButton({
  dir,
  disabled,
  controls,
  onClick,
}: {
  dir: 'prev' | 'next';
  disabled: boolean;
  controls: string;
  onClick: () => void;
}) {
  const Icon = dir === 'prev' ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      // aria-disabled (not `disabled`) keeps focus on the button when the end is reached.
      aria-disabled={disabled}
      aria-controls={controls}
      aria-label={dir === 'prev' ? 'Previous project' : 'Next project'}
      onClick={disabled ? undefined : onClick}
      className={cn(
        'flex h-11 w-11 items-center justify-center rounded-pill border border-slate-300 bg-white text-slate-700 shadow-sm transition-all',
        disabled ? 'cursor-default opacity-40' : 'hover:scale-110 hover:border-indigo-400 hover:text-indigo-600 active:scale-95',
      )}
    >
      <Icon aria-hidden="true" size={18} />
    </button>
  );
}

/**
 * Horizontal card slider built on native scroll-snap, so touch, trackpad and keyboard scrolling
 * work without JavaScript. On top of that: prev/next buttons, clickable position dots with a
 * counter, mouse drag, Home/End, and a polite screen-reader announcement of the visible range.
 * `header` sits on the left of the arrow row, so the title and controls share a line.
 */
export function ProjectSlider({ header }: { header: ReactNode }) {
  const n = projects.length;
  const reduced = useReducedMotion();
  const trackId = useId();
  const track = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const drag = useRef({ active: false, moved: false, startX: 0, startLeft: 0, id: -1 });
  const [pos, setPos] = useState<Position>({ index: 0, visible: 3, atStart: true, atEnd: false });
  const [announcement, setAnnouncement] = useState('');

  const geometry = useCallback(() => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return null;
    const step = card.offsetWidth + GAP;
    const max = el.scrollWidth - el.clientWidth;
    return { el, step, max };
  }, []);

  const measure = useCallback(() => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const g = geometry();
      if (!g) return;
      const { el, step, max } = g;
      const visible = Math.max(1, Math.floor((el.clientWidth - PAD * 2 + GAP + 2) / step));
      const lastIndex = Math.max(0, n - visible);
      const atStart = el.scrollLeft <= 2;
      const atEnd = el.scrollLeft >= max - 2;
      const index = atEnd ? lastIndex : Math.min(lastIndex, Math.round(el.scrollLeft / step));
      setPos((p) => (p.index === index && p.visible === visible && p.atStart === atStart && p.atEnd === atEnd ? p : { index, visible, atStart, atEnd }));
    });
  }, [geometry, n]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf.current);
    };
  }, [measure]);

  // Announce the visible range once scrolling settles, not on every snap point it passes.
  useEffect(() => {
    const last = Math.min(n, pos.index + pos.visible);
    const text = pos.visible > 1 ? `Showing projects ${pos.index + 1} to ${last} of ${n}` : `Showing project ${pos.index + 1} of ${n}`;
    const t = window.setTimeout(() => setAnnouncement(text), 600);
    return () => window.clearTimeout(t);
  }, [pos.index, pos.visible, n]);

  const scrollToIndex = useCallback(
    (i: number, smooth = true) => {
      const g = geometry();
      if (!g) return;
      const clamped = Math.max(0, Math.min(i, n - 1));
      g.el.scrollTo({ left: Math.min(clamped * g.step, g.max), behavior: smooth && !reduced ? 'smooth' : 'auto' });
    },
    [geometry, n, reduced],
  );

  /** Index of the card the track is currently resting on, even mid-animation. */
  const currentIndex = () => {
    const g = geometry();
    return g ? Math.round(g.el.scrollLeft / g.step) : 0;
  };
  const prev = () => scrollToIndex(currentIndex() - 1);
  const next = () => scrollToIndex(currentIndex() + 1);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.target !== e.currentTarget) return; // links inside cards keep their own keys
    const actions: Record<string, () => void> = {
      ArrowRight: next,
      ArrowLeft: prev,
      Home: () => scrollToIndex(0),
      End: () => scrollToIndex(n - 1),
    };
    const action = actions[e.key];
    if (action) {
      e.preventDefault();
      action();
    }
  };

  // Mouse drag-to-scroll. Touch and trackpad already scroll natively, so only handle the mouse.
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !track.current) return;
    drag.current = { active: true, moved: false, startX: e.clientX, startLeft: track.current.scrollLeft, id: e.pointerId };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = track.current;
    if (!d.active || !el) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > DRAG_THRESHOLD) {
      d.moved = true;
      el.setPointerCapture(d.id);
      el.style.scrollSnapType = 'none'; // free movement while dragging; snap again on release
      el.style.userSelect = 'none';
      el.dataset.dragging = 'true';
    }
    if (d.moved) el.scrollLeft = d.startLeft - dx;
  };
  const endDrag = () => {
    const d = drag.current;
    const el = track.current;
    if (!d.active || !el) return;
    d.active = false;
    if (!d.moved) return;
    if (el.hasPointerCapture(d.id)) el.releasePointerCapture(d.id);
    el.style.scrollSnapType = '';
    el.style.userSelect = '';
    delete el.dataset.dragging;
    scrollToIndex(currentIndex());
  };
  // A drag that ends over a link must not count as a click on it.
  const onClickCapture = (e: MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  const pages = Math.max(1, n - pos.visible + 1);
  const rangeEnd = Math.min(n, pos.index + pos.visible);
  const pad = (v: number) => String(v).padStart(2, '0');

  return (
    <div role="group" aria-roledescription="carousel" aria-label="Selected projects">
      <div className="mb-4 flex items-end justify-between gap-6">
        <div className="min-w-0">{header}</div>
        <div className="flex shrink-0 items-center gap-2">
          <ArrowButton dir="prev" disabled={pos.atStart} controls={trackId} onClick={prev} />
          <ArrowButton dir="next" disabled={pos.atEnd} controls={trackId} onClick={next} />
        </div>
      </div>

      {/* Negative margins give card shadows and tilt room without widening the layout. */}
      <div
        id={trackId}
        ref={track}
        tabIndex={0}
        onScroll={measure}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        aria-label="Projects. Scroll sideways, drag, or use the left, right, Home and End keys."
        className="-mx-3 flex snap-x snap-mandatory scroll-px-3 gap-6 overflow-x-auto overscroll-x-contain px-3 py-6 [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:outline-offset-0 data-[dragging=true]:cursor-grabbing [@media(hover:hover)]:cursor-grab [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project, i) => (
          <div
            key={project.title}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${n}`}
            className="slider-card w-[86%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      {/* Position: counter + clickable dots */}
      <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <p className="shrink-0 font-mono text-xs tracking-wider whitespace-nowrap text-slate-500 tabular-nums" aria-hidden="true">
          {pos.visible > 1 ? `${pad(pos.index + 1)}–${pad(rangeEnd)}` : pad(pos.index + 1)} <span className="text-slate-300">/</span> {pad(n)}
        </p>
        <div className="flex items-center" role="group" aria-label="Choose where to start">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to project ${i + 1}: ${projects[i].title}`}
              aria-current={i === pos.index ? 'true' : undefined}
              // 24x24px hit area (WCAG 2.2 target size) around a small visual dot
              className="group/dot flex h-6 w-6 items-center justify-center"
            >
              <span
                className={cn(
                  'block h-1.5 rounded-full transition-all duration-300',
                  i === pos.index ? 'w-6 bg-gradient-to-r from-indigo-600 to-cyan-500' : 'w-1.5 bg-slate-300 group-hover/dot:bg-slate-400',
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
