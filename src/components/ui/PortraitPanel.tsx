import type { ReactNode } from 'react';
import { Reveal } from './Reveal';
import { cn } from './primitives';

/** Portrait image with a frosted monospace caption, used in Intro and About. */
export function PortraitPanel({
  src,
  alt,
  width,
  height,
  aspect,
  children,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  aspect: string;
  children: ReactNode;
}) {
  return (
    <Reveal className="relative">
      <figure className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className={cn('w-full object-cover transition-transform duration-700 group-hover:scale-105', aspect)}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />
        <figcaption className="absolute right-4 bottom-4 left-4 rounded-xl border border-slate-200/90 bg-white/90 p-3.5 shadow-md backdrop-blur-xl">
          {children}
        </figcaption>
      </figure>
    </Reveal>
  );
}
