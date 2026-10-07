import { useRef, useState, type PointerEvent } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react';
import { site } from '../../data/content';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';
import { cn, PulseDot } from '../ui/primitives';

const BASE = { x: 8, y: -14, z: 4 };
const MAX_TILT = 16;
const SPRING = { stiffness: 140, damping: 18, mass: 0.6 };

/**
 * Floating portrait card with mouse-follow 3D tilt, layered parallax and a
 * cursor glare. All motion runs on motion values, so pointer movement never
 * triggers a React re-render.
 */
export function PortraitCard() {
  const { canHover } = useDeviceCapabilities();
  const boundary = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const rotateX = useSpring(BASE.x, SPRING);
  const rotateY = useSpring(BASE.y, SPRING);
  const scale = useSpring(1, SPRING);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  const rotateZ = useSpring(BASE.z, SPRING);
  const dx = useTransform(rotateY, (v) => (v - BASE.y) * 0.9);
  const dy = useTransform(rotateX, (v) => (v - BASE.x) * 0.9);
  const badgeX = useTransform(dx, (v) => -v * 0.7);
  const badgeY = useTransform(dy, (v) => -v * 0.7);
  const infoX = useTransform(dx, (v) => -v * 0.8);
  const infoY = useTransform(dy, (v) => -v * 0.8);
  const imgX = useTransform(dx, (v) => v * 0.4);
  const imgY = useTransform(dy, (v) => v * 0.4);
  const glowX = useTransform(dx, (v) => -v * 3.5);
  const glowY = useTransform(dy, (v) => -v * 3.5);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(99,102,241,0.28) 0%, rgba(255,255,255,0.2) 32%, transparent 72%)`;

  const onMove = (e: PointerEvent) => {
    const card = boundary.current?.querySelector<HTMLElement>('[data-card]');
    if (!card) return;
    const r = card.getBoundingClientRect();
    const nx = Math.max(-1.4, Math.min(1.4, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
    const ny = Math.max(-1.4, Math.min(1.4, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
    rotateX.set(-ny * MAX_TILT);
    rotateY.set(nx * MAX_TILT);
    rotateZ.set(nx * MAX_TILT * -0.2);
    glareX.set(((e.clientX - r.left) / r.width) * 100);
    glareY.set(((e.clientY - r.top) / r.height) * 100);
  };

  const onEnter = () => {
    setHovering(true);
    scale.set(1.03);
  };
  const onLeave = () => {
    setHovering(false);
    rotateX.set(BASE.x);
    rotateY.set(BASE.y);
    rotateZ.set(BASE.z);
    scale.set(1);
    glareX.set(50);
    glareY.set(50);
  };

  const interactive = canHover
    ? { onPointerEnter: onEnter, onPointerMove: onMove, onPointerLeave: onLeave }
    : {};

  return (
    <div
      ref={boundary}
      {...interactive}
      className="relative flex items-center justify-center py-6 lg:py-0"
      style={{ perspective: 1000 }}
    >
      <motion.div
        aria-hidden="true"
        style={{ x: glowX, y: glowY }}
        className="pointer-events-none absolute h-72 w-72 rounded-full bg-indigo-500/15 blur-[70px]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute -top-6 -right-6 h-48 w-48 rounded-full bg-sky-400/15 blur-[60px]" />

      {/* Idle float lives on its own layer so it never fights the tilt transform. */}
      <div className={cn('preserve-3d relative animate-card-float', hovering && '[animation-play-state:paused]')}>
        <motion.figure
          data-card
          style={{ rotateX, rotateY, rotateZ, scale, transformPerspective: 1000 }}
          className="preserve-3d group relative aspect-[9/15] w-[280px] overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_20px_50px_rgba(79,70,229,0.14)] will-change-transform sm:w-[320px]"
        >
          <motion.div
            aria-hidden="true"
            style={{ background: glare }}
            className="pointer-events-none absolute inset-0 z-30 opacity-40 mix-blend-screen"
          />
          <motion.div
            style={{ x: badgeX, y: badgeY, translateZ: 35 }}
            className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-pill border border-slate-200/90 bg-white/90 px-2.5 py-1 font-mono text-[10px] font-bold tracking-widest text-slate-800 shadow-md backdrop-blur-md"
          >
            <PulseDot />
            <span>SM // DEV</span>
          </motion.div>
          <motion.img
            src="/images/portrait-studio.webp"
            alt={`${site.name}, software engineer, sitting at his desk`}
            width={512}
            height={341}
            fetchPriority="high"
            decoding="async"
            style={{ x: imgX, y: imgY, translateZ: 20 }}
            className="h-full w-full object-cover object-center contrast-105 transition-[scale] duration-500 ease-out group-hover:scale-105"
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />
          <motion.figcaption
            style={{ x: infoX, y: infoY, translateZ: 30 }}
            className="absolute right-4 bottom-4 left-4 rounded-2xl border border-slate-200/90 bg-white/90 p-3.5 shadow-lg backdrop-blur-md"
          >
            <span className="mb-0.5 flex items-center justify-between font-mono text-[10px] text-slate-500">
              <span className="font-bold text-indigo-600">CORE ARCHITECT</span>
              <span className="font-semibold text-slate-600">{site.location.toUpperCase()}</span>
            </span>
            <span className="block truncate font-mono text-xs font-bold text-slate-900">{site.name}</span>
          </motion.figcaption>
        </motion.figure>
      </div>
    </div>
  );
}
