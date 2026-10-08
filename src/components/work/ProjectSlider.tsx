import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { projects } from '../../data/content';
import { cn } from '../ui/primitives';
import { ProjectCard } from './ProjectCard';

const GAP = 24; // keep in sync with gap-6

function ArrowButton({ dir, disabled, onClick }: { dir: 'prev' | 'next'; disabled: boolean; onClick: () => void }) {
  const Icon = dir === 'prev' ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'prev' ? 'Previous projects' : 'Next projects'}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-pill border border-slate-300 bg-white text-slate-700 shadow-sm transition-all',
        disabled ? 'cursor-default opacity-40' : 'hover:scale-110 hover:border-indigo-400 hover:text-indigo-600 active:scale-95',
      )}
    >
      <Icon aria-hidden="true" size={16} />
    </button>
  );
}

/**
 * Horizontal card slider: native scroll-snap (touch, trackpad, keyboard) plus arrow buttons.
 * `header` sits on the left of the arrow row, so the title and controls share a line.
 */
export function ProjectSlider({ header }: { header: ReactNode }) {
  const reduced = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= max - 2);
    // The progress thumb is moved directly so scrolling never re-renders the cards.
    if (thumb.current) {
      thumb.current.style.width = `${(el.clientWidth / el.scrollWidth) * 100}%`;
      thumb.current.style.transform = `translateX(${(el.scrollLeft / el.clientWidth) * 100}%)`;
    }
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + GAP), behavior: reduced ? 'auto' : 'smooth' });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.target !== e.currentTarget) return; // let links inside cards handle their own keys
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollByCard(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollByCard(-1);
    }
  };

  return (
    <div role="group" aria-roledescription="carousel" aria-label="Selected projects">
      <div className="mb-4 flex items-end justify-between gap-6">
        <div className="min-w-0">{header}</div>
        <div className="flex shrink-0 items-center gap-2">
          <ArrowButton dir="prev" disabled={atStart} onClick={() => scrollByCard(-1)} />
          <ArrowButton dir="next" disabled={atEnd} onClick={() => scrollByCard(1)} />
        </div>
      </div>

      {/* Negative margins give card shadows and tilt room without widening the layout. */}
      <div
        ref={track}
        tabIndex={0}
        onScroll={update}
        onKeyDown={onKeyDown}
        aria-label="Projects. Scroll sideways or use the left and right arrow keys."
        className="-mx-3 flex snap-x snap-mandatory scroll-px-3 gap-6 overflow-x-auto overscroll-x-contain px-3 py-6 [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:outline-offset-0 [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project, i) => (
          <div
            key={project.title}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${projects.length}`}
            className="slider-card w-[86%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      <div aria-hidden="true" className="mt-2 h-1 overflow-hidden rounded-full bg-slate-200">
        <span ref={thumb} className="block h-full w-1/3 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 transition-[width] duration-300" />
      </div>
    </div>
  );
}
