import { useEffect, useRef } from 'react';
import { sections } from '../../data/content';
import type { BackdropMode } from '../../hooks/useDeviceCapabilities';

/*
 * A bundle of soft, thin light fibres that runs the full length of the page as one continuous
 * thread. It holds the right margin through one section, sweeps across the gap to the left margin
 * for the next, and back again. A slow wave ripples down the strands, and a gentle glow follows the
 * scroll position, leaving a faint lit trail behind it.
 *
 * Readability comes first: the layer sits behind everything, the fibres only change sides in the
 * space between sections, and they fade out wherever they pass behind the content column.
 *
 * Plain 2D canvas: only the visible slice is drawn, so it costs almost nothing and works on any
 * device. With reduced motion it is drawn once per scroll position, with no animation.
 */

const IDS = ['top', ...sections.map((s) => s.id)];
const STEP = 14; // vertical sampling step in px
const CHUNK = 3; // samples per stroke; each chunk gets its own alpha, which is what makes the glow

const INDIGO = [79, 70, 229];
const CYAN = [6, 182, 212];

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const smoother = (t: number) => {
  const x = clamp(t, 0, 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Fiber {
  offset: number; // distance from the bundle centre
  amp: number; // sideways ripple
  freq: number;
  phase: number;
  drift: number; // how fast the ripple travels down the strand
  width: number;
  speed: number; // px/s a light pulse travels down the page
  spacing: number; // px between pulses
  pulseShift: number;
  hue: number;
}

interface Anchor {
  y: number;
  side: 1 | -1;
}

function makeFibers(count: number, lite: boolean): Fiber[] {
  const rand = rng(5);
  const step = lite ? 4 : 8;
  return Array.from({ length: count }, (_, j) => ({
    offset: (j - (count - 1) / 2) * step,
    amp: (lite ? 2 : 4) + rand() * (lite ? 3 : 6),
    freq: 0.0028 + rand() * 0.004,
    phase: rand() * Math.PI * 2,
    drift: 0.25 + rand() * 0.3,
    width: 0.9 + rand() * 0.6,
    speed: 70 + rand() * 60,
    spacing: 800 + rand() * 600,
    pulseShift: rand() * 1000,
    hue: rand() * Math.PI * 2,
  }));
}

export default function FlowFibers({ mode }: { mode: BackdropMode }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;

    const animated = mode !== 'static';
    const lite = mode === 'lite';
    const fibers = makeFibers(lite ? 4 : 7, lite);

    let W = 0;
    let H = 0;
    let anchors: Anchor[] = [];
    let raf = 0;
    let last = performance.now();
    let time = 0;
    let head = window.scrollY + window.innerHeight * 0.5;
    let sway = 0;
    let lastScroll = window.scrollY;

    const gutter = () => (lite ? 12 : clamp(W * 0.045, 46, 84));
    // The telemetry panel lives in the right margin on wide screens (full panel from 1536px, a slim
    // rail from 1400px), so the right-hand run sits just inside it instead of underneath.
    const panel = () => (lite ? 0 : W >= 1536 ? 80 : W >= 1400 ? 42 : 0);
    const sideX = (side: 1 | -1) => (side > 0 ? W - gutter() - panel() : gutter());
    // Left and right edge of the content column (the section padding or the centred 1280px container).
    const contentEdge = () => Math.max(W >= 1024 ? 64 : W >= 640 ? 32 : 16, (W - 1280) / 2);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.width = `${W}px`;
      cv.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // The bundle holds one side across each section's content and only changes side in the gap
    // between sections, where there is nothing to read.
    const measure = () => {
      anchors = [];
      IDS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const top = r.top + window.scrollY + parseFloat(cs.paddingTop);
        const bottom = r.bottom + window.scrollY - parseFloat(cs.paddingBottom);
        const side: 1 | -1 = i % 2 === 0 ? 1 : -1;
        anchors.push({ y: top + 24, side }, { y: Math.max(top + 25, bottom - 24), side });
      });
    };

    /** Centre line of the bundle at document height y: holds one side per section, then sweeps across. */
    const centreX = (y: number) => {
      const n = anchors.length;
      if (!n) return sideX(1);
      if (y <= anchors[0].y) return sideX(anchors[0].side);
      for (let i = 0; i < n - 1; i++) {
        const a = anchors[i];
        const b = anchors[i + 1];
        if (y <= b.y) return lerp(sideX(a.side), sideX(b.side), smoother((y - a.y) / Math.max(1, b.y - a.y)));
      }
      return sideX(anchors[n - 1].side);
    };

    const fibreX = (f: Fiber, y: number) => {
      const breathe = 0.55 + 0.45 * Math.sin(y * 0.0016 + 1.7); // the bundle slowly opens and closes
      const ripple = Math.sin(y * f.freq + f.phase - (animated ? time * f.drift : 0)) * f.amp; // a wave travelling down
      const lean = animated ? sway * Math.exp(-(((y - head) / 520) ** 2)) : 0; // a slight bend while you scroll fast
      return centreX(y) + f.offset * breathe + ripple + lean;
    };

    const colour = (f: Fiber, y: number) => {
      const t = 0.5 + 0.5 * Math.sin(y * 0.0021 + f.hue);
      return [lerp(INDIGO[0], CYAN[0], t), lerp(INDIGO[1], CYAN[1], t), lerp(INDIGO[2], CYAN[2], t)];
    };

    /** 1 over the margins, down to 0.3 where a fibre passes behind the content column. */
    const duck = (x: number) => {
      const e = contentEdge();
      const inside = smoothstep(e - 24, e + 24, x) * (1 - smoothstep(W - e - 24, W - e + 24, x));
      return 1 - 0.7 * inside;
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const scrollY = window.scrollY;
      const y0 = scrollY - 60;
      const y1 = scrollY + H + 60;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (const f of fibers) {
        const xs: number[] = [];
        const ys: number[] = [];
        for (let y = y0; y <= y1; y += STEP) {
          xs.push(fibreX(f, y));
          ys.push(y);
        }
        for (let i = 0; i + CHUNK < xs.length; i += CHUNK) {
          const mid = ys[i + 1];
          let a = 0.16;
          if (animated) {
            const trail = mid <= head ? Math.exp(-(head - mid) / 1500) : 0; // faint lit trail behind the head
            const bump = Math.exp(-(((mid - head) / 170) ** 2)); // soft glow where you are
            const d = (((mid - time * f.speed - f.pulseShift) % f.spacing) + f.spacing) % f.spacing;
            const pulse = Math.exp(-((Math.min(d, f.spacing - d) / 40) ** 2)); // light travelling down
            a = 0.12 + 0.12 * trail + 0.4 * bump + 0.34 * pulse;
          }
          a *= (0.75 + 0.25 * Math.sin(mid * 0.0009 + 0.8)) * duck(xs[i + 1]); // intensity drifts down the page
          a = Math.min(a, 0.7);
          if (a < 0.015) continue;
          const [r, g, b] = colour(f, mid);
          const rgb = `${r | 0},${g | 0},${b | 0}`;

          ctx.beginPath();
          ctx.moveTo(xs[i], ys[i] - scrollY);
          for (let k = 1; k <= CHUNK; k++) ctx.lineTo(xs[i + k], ys[i + k] - scrollY);

          if (a > 0.3) {
            ctx.strokeStyle = `rgba(${rgb},${(a * 0.16).toFixed(3)})`; // very soft halo, only on the brightest bits
            ctx.lineWidth = f.width * 5;
            ctx.stroke();
          }
          ctx.strokeStyle = `rgba(${rgb},${a.toFixed(3)})`;
          ctx.lineWidth = f.width;
          ctx.stroke();
        }
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;

      const scrollY = window.scrollY;
      const target = scrollY + H * 0.5;
      head += (target - head) * (1 - Math.exp(-dt * 4)); // the glow eases after the scroll instead of snapping
      const v = dt > 0 ? (scrollY - lastScroll) / dt : 0;
      lastScroll = scrollY;
      sway += (clamp(v * 0.012, -28, 28) - sway) * (1 - Math.exp(-dt * 5));
      draw();
    };

    resize();
    measure();
    if (animated) raf = requestAnimationFrame(frame);
    else draw();

    const onScroll = () => {
      if (!animated) requestAnimationFrame(draw);
    };
    const onResize = () => {
      resize();
      measure();
      if (!animated) draw();
    };
    const ro = new ResizeObserver(() => {
      measure();
      if (!animated) draw();
    });
    ro.observe(document.body);
    window.addEventListener('resize', onResize);
    window.addEventListener('load', measure);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', measure);
      window.removeEventListener('scroll', onScroll);
    };
  }, [mode]);

  return <canvas ref={canvas} className="absolute inset-0" />;
}
