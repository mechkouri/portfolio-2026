import { useEffect, useRef } from 'react';
import { sections } from '../../data/content';
import type { BackdropMode } from '../../hooks/useDeviceCapabilities';

/*
 * A bundle of thin light fibres that snakes down the page behind the content. It is drawn as you
 * scroll: the fibres grow downward with you, led by a soft light, and a few small lights travel
 * along them. The path is one smooth wave with one swing per section (right in one section, left
 * in the next), so there are no corners and nothing is "already drawn" further down the page.
 *
 * Everything sits behind the page (fixed canvas, pointer-events: none). The lines are hairline and
 * low-contrast, and they fade a little where they pass behind the text column.
 *
 * Plain 2D canvas: only the visible slice is drawn, so it costs almost nothing and works on any
 * device. With reduced motion the whole path is drawn once per scroll position, with no animation.
 */

const IDS = ['top', ...sections.map((s) => s.id)];
const STEP = 10; // vertical sampling step in px: small enough that the curve never shows corners

const INDIGO = [79, 70, 229];
const CYAN = [6, 182, 212];

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
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
  lag: number; // how far this strand trails the others along the snake, in px
  spread: number; // sideways distance from the bundle centre
  amp: number; // small ripple on top of the main wave
  phase: number;
  width: number;
  speed: number; // px/s a travelling light moves down the strand
  shifts: number[]; // starting offsets of its travelling lights
  hue: number;
}

function makeFibers(count: number, lite: boolean): Fiber[] {
  const rand = rng(9);
  return Array.from({ length: count }, (_, j) => {
    const c = j - (count - 1) / 2;
    return {
      lag: c * (lite ? 26 : 34), // strands follow each other, so the bundle twists like a snake's body
      spread: c * (lite ? 5 : 7),
      amp: 3 + rand() * 5,
      phase: rand() * Math.PI * 2,
      width: 1 + rand() * 0.7,
      speed: 80 + rand() * 70,
      shifts: lite ? [rand() * 900] : [rand() * 900, 900 + rand() * 900],
      hue: rand() * Math.PI * 2,
    };
  });
}

export default function FlowFibers({ mode }: { mode: BackdropMode }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;

    const animated = mode !== 'static';
    const lite = mode === 'lite';
    const fibers = makeFibers(lite ? 3 : 6, lite);

    let W = 0;
    let H = 0;
    let mids: number[] = []; // document y of the middle of every section
    let raf = 0;
    let last = performance.now();
    let time = 0;
    let head = window.scrollY + window.innerHeight * 0.55;

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

    const measure = () => {
      mids = [];
      for (const id of IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        mids.push(r.top + window.scrollY + r.height / 2);
      }
    };

    /**
     * Position along the page measured in "sections": 0 at the middle of the hero, 1 at the middle of
     * the next section, and so on. It continues past both ends at the nearest section's pace.
     */
    const sectionPos = (y: number) => {
      const n = mids.length;
      if (n < 2) return y / Math.max(H, 1);
      let i = 0;
      while (i < n - 2 && y >= mids[i + 1]) i++;
      return i + (y - mids[i]) / Math.max(1, mids[i + 1] - mids[i]);
    };

    /**
     * The snake: a cosine of the section position, so it swings one way per section. At the
     * middle of every section the slope is zero, which is why it has no corners.
     */
    const snakeX = (y: number) => {
      const amp = W * (lite ? 0.36 : 0.3);
      return W / 2 + amp * Math.cos(Math.PI * sectionPos(y));
    };

    const fibreX = (f: Fiber, y: number) => {
      const breathe = 0.6 + 0.4 * Math.sin(y * 0.0014 + 1.3); // the bundle slowly opens and closes
      const ripple = Math.sin(y * 0.0045 - (animated ? time * 0.9 : 0) + f.phase) * f.amp; // a slow wave flowing down
      return snakeX(y - f.lag) + f.spread * breathe + ripple;
    };

    const edge = () => Math.max(W >= 1024 ? 64 : W >= 640 ? 32 : 16, (W - 1280) / 2);
    /** A little fainter where a fibre passes behind the text column, so it never competes with reading. */
    const duck = (x: number) => {
      const e = edge();
      const inside = smoothstep(e - 30, e + 30, x) * (1 - smoothstep(W - e - 30, W - e + 30, x));
      return 1 - 0.4 * inside;
    };

    const colour = (f: Fiber, y: number) => {
      const t = 0.5 + 0.5 * Math.sin(y * 0.002 + f.hue);
      return [lerp(INDIGO[0], CYAN[0], t), lerp(INDIGO[1], CYAN[1], t), lerp(INDIGO[2], CYAN[2], t)];
    };

    const glow = (x: number, y: number, radius: number, rgb: string, strength: number) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
      g.addColorStop(0, `rgba(255,255,255,${(0.95 * strength).toFixed(3)})`);
      g.addColorStop(0.25, `rgba(${rgb},${(0.6 * strength).toFixed(3)})`);
      g.addColorStop(1, `rgba(${rgb},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const scrollY = window.scrollY;
      const y0 = scrollY - 40;
      // Animated: the fibres only exist down to the glow, so they grow as you scroll. Still: the whole path.
      const yEnd = animated ? Math.min(scrollY + H + 40, head + 30) : scrollY + H + 40;
      if (yEnd <= y0) return;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      let headXSum = 0;
      let headCount = 0;

      for (const f of fibers) {
        const ys: number[] = [];
        const xs: number[] = [];
        for (let y = y0; y < yEnd; y += STEP) {
          ys.push(y);
          xs.push(fibreX(f, y));
        }
        ys.push(yEnd);
        xs.push(fibreX(f, yEnd));
        if (xs.length < 3) continue;

        // One smooth curve through the samples (quadratic segments through the midpoints: no corners).
        const path = new Path2D();
        path.moveTo(xs[0], ys[0] - scrollY);
        for (let i = 1; i < xs.length - 1; i++) {
          path.quadraticCurveTo(xs[i], ys[i] - scrollY, (xs[i] + xs[i + 1]) / 2, (ys[i] + ys[i + 1]) / 2 - scrollY);
        }
        path.lineTo(xs[xs.length - 1], ys[ys.length - 1] - scrollY);

        // Brightness along the strand, expressed as one vertical gradient so the stroke has no seams.
        const span = yEnd - y0;
        const line = ctx.createLinearGradient(0, y0 - scrollY, 0, yEnd - scrollY);
        const halo = ctx.createLinearGradient(0, y0 - scrollY, 0, yEnd - scrollY);
        for (let i = 0; i < ys.length; i++) {
          const y = ys[i];
          const t = clamp((y - y0) / span, 0, 1);
          const [r, g, b] = colour(f, y);
          const rgb = `${r | 0},${g | 0},${b | 0}`;
          let a = 0.15;
          let ha = 0;
          if (animated) {
            const behind = Math.max(0, head - y);
            const comet = Math.exp(-behind / 130); // bright just behind the leading light
            const reveal = 1 - smoothstep(head - 50, head + 30, y); // the strand fades in as it is drawn
            a = (0.15 + 0.2 * Math.exp(-behind / 1100) + 0.5 * comet) * reveal;
            ha = 0.2 * comet * reveal;
          }
          const k = duck(xs[i]);
          line.addColorStop(t, `rgba(${rgb},${(a * k).toFixed(3)})`);
          halo.addColorStop(t, `rgba(${rgb},${(ha * k).toFixed(3)})`);
        }
        if (animated) {
          ctx.strokeStyle = halo;
          ctx.lineWidth = f.width * 6;
          ctx.stroke(path);
        }
        ctx.strokeStyle = line;
        ctx.lineWidth = f.width;
        ctx.stroke(path);

        if (!animated) continue;

        // Small lights that keep travelling down the part of the strand that has been drawn.
        const [r, g, b] = colour(f, head);
        const rgb = `${r | 0},${g | 0},${b | 0}`;
        const loop = Math.max(head + 240, 600);
        for (const s of f.shifts) {
          const yp = (time * f.speed + s) % loop;
          if (yp < y0 || yp > Math.min(yEnd, head - 20)) continue;
          const xp = fibreX(f, yp);
          glow(xp, yp - scrollY, 11, rgb, 0.8 * duck(xp));
        }

        // The leading light at the end of the strand.
        if (head >= y0 && head <= scrollY + H + 40) {
          const xh = fibreX(f, head);
          glow(xh, head - scrollY, 15, rgb, 0.9);
          headXSum += xh;
          headCount++;
        }
      }

      // One soft, wide glow around the whole bundle's leading edge, so the lights read as one.
      if (animated && headCount) {
        const hx = headXSum / headCount;
        glow(hx, head - scrollY, lite ? 46 : 70, '99,102,241', 0.16);
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
      // The leading light eases toward the scroll position, so the fibres flow rather than snap.
      head += (window.scrollY + H * 0.55 - head) * (1 - Math.exp(-dt * 3.2));
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
