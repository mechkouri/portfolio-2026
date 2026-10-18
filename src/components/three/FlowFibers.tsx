import { useEffect, useRef } from 'react';
import { sections } from '../../data/content';
import type { BackdropMode } from '../../hooks/useDeviceCapabilities';

/*
 * A bundle of thin optical fibres that snakes down the page behind the content.
 *
 *  - It begins as a single point in the gap between the hero and the first section, and fans out
 *    into separate strands as it goes.
 *  - Each strand has its own slow ripple, so the strands cross and interweave like real fibres.
 *  - It swings one way per section (right, then left, ...) in one smooth wave with no corners.
 *  - It is drawn as you scroll: the strands only exist down to a soft leading light, and small
 *    lights travel along the part that has been drawn.
 *  - In the last section the strands spread apart and fade out before the footer.
 *
 * Everything sits behind the page (fixed canvas, pointer-events: none) in a single soft indigo-blue,
 * and the lines fade a little behind the text column so they never compete with reading.
 *
 * Plain 2D canvas: only the visible slice is drawn, so it costs almost nothing and works on any
 * device. With reduced motion the whole path is drawn once per scroll position, with no animation.
 */

const IDS = ['top', ...sections.map((s) => s.id)];
const FIRST = sections[0].id;
const LAST = sections[sections.length - 1].id;
const STEP = 10; // vertical sampling step in px: small enough that the curve never shows corners

// One colour family, so the strands read as fibre rather than as a rainbow.
const BASE = [99, 102, 241]; // indigo-500
const ALT = [56, 160, 248]; // sky-ish blue, only a hint
// On the dark theme the same strands read brighter: indigo-400 shading toward cyan, a little stronger.
const BASE_DARK = [129, 140, 248];
const ALT_DARK = [34, 211, 238];
const DARK_BOOST = 1.35;
const isDark = () => document.documentElement.classList.contains('dark');

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
  offset: number; // resting distance from the bundle centre, in px
  lag: number; // how far this strand trails the others along the snake, in px
  amp: number; // size of its own ripple, in px
  k: number; // ripple frequency (differs per strand, which is what makes them cross)
  phase: number;
  drift: number; // how fast, and which way, the ripple travels
  fan: number; // which way it flies off when the bundle disperses at the end
  width: number;
  speed: number; // px/s a travelling light moves down the strand
  shifts: number[];
  tone: number;
}

function makeFibers(count: number, lite: boolean): Fiber[] {
  const rand = rng(21);
  return Array.from({ length: count }, (_, j) => {
    const c = j - (count - 1) / 2;
    return {
      offset: c * (lite ? 7 : 9),
      lag: c * (lite ? 16 : 22),
      amp: (lite ? 9 : 20) + rand() * (lite ? 12 : 32),
      k: 0.0032 + rand() * 0.0058,
      phase: rand() * Math.PI * 2,
      drift: (0.15 + rand() * 0.35) * (rand() < 0.5 ? -1 : 1),
      fan: (c >= 0 ? 1 : -1) * (0.45 + rand() * 0.9),
      width: 0.8 + rand() * 0.5,
      speed: 80 + rand() * 70,
      shifts: lite ? [rand() * 900] : [rand() * 900, 900 + rand() * 900],
      tone: rand(),
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
    const fibers = makeFibers(lite ? 5 : 9, lite);

    let W = 0;
    let H = 0;
    let mids: number[] = []; // document y of the middle of every section
    let startY = 0; // where the bundle begins: the middle of the gap between the hero and the first section
    let disperseY = 0; // where it starts to spread apart
    let endY = 0; // where it has faded out completely (the top of the footer)
    let phaseShift = 0; // keeps the snake centred, going left, at its start
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

    const box = (id: string) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        top: r.top + window.scrollY,
        bottom: r.bottom + window.scrollY,
        padTop: parseFloat(cs.paddingTop) || 0,
        padBottom: parseFloat(cs.paddingBottom) || 0,
      };
    };

    /** Position along the page measured in "sections" (0 = middle of the hero, 1 = middle of the next, ...). */
    const sectionPos = (y: number) => {
      const n = mids.length;
      if (n < 2) return y / Math.max(H, 1);
      let i = 0;
      while (i < n - 2 && y >= mids[i + 1]) i++;
      return i + (y - mids[i]) / Math.max(1, mids[i + 1] - mids[i]);
    };

    const measure = () => {
      mids = [];
      for (const id of IDS) {
        const b = box(id);
        if (b) mids.push((b.top + b.bottom) / 2);
      }
      const hero = box('top');
      const first = box(FIRST);
      const last = box(LAST);
      if (hero && first) startY = (hero.bottom - hero.padBottom + first.top + first.padTop) / 2;
      if (last) {
        endY = last.bottom;
        disperseY = last.top + (last.bottom - last.top) * 0.3;
      }
      phaseShift = 0.5 - sectionPos(startY);
    };

    /**
     * The snake: a cosine of the section position, so it swings one way per section. The shift makes
     * it start in the middle of the page and go left first. The slope is zero at each swing's peak,
     * which is why it has no corners.
     */
    const snakeX = (y: number) => {
      const amp = W * (lite ? 0.34 : 0.3);
      return W / 2 + amp * Math.cos(Math.PI * (sectionPos(y) + phaseShift));
    };

    const fibreX = (f: Fiber, y: number) => {
      const grow = smoothstep(startY, startY + 700, y); // one point at the start, fanning out to the full bundle
      const out = smoothstep(disperseY, endY, y); // spreading apart at the end
      const ripple = Math.sin(y * f.k + f.phase - (animated ? time * f.drift : 0)) * f.amp * (1 + 2.2 * out);
      const fan = f.fan * 260 * out * out * (lite ? 0.6 : 1);
      return snakeX(y - f.lag * grow) + grow * ((1 + 5 * out) * f.offset + ripple) + fan;
    };

    const edge = () => Math.max(W >= 1024 ? 64 : W >= 640 ? 32 : 16, (W - 1280) / 2);
    /** A little fainter where a fibre passes behind the text column, so it never competes with reading. */
    const duck = (x: number) => {
      const e = edge();
      const inside = smoothstep(e - 30, e + 30, x) * (1 - smoothstep(W - e - 30, W - e + 30, x));
      return 1 - 0.4 * inside;
    };

    /** Brightness that depends only on where we are along the page: emerging at the start, gone at the end. */
    const lifetime = (y: number) => smoothstep(startY, startY + 180, y) * (1 - smoothstep(disperseY + (endY - disperseY) * 0.25, endY, y));

    let dark = isDark();
    const colour = (f: Fiber, y: number) => {
      const t = 0.12 + 0.3 * (0.5 + 0.5 * Math.sin(y * 0.002 + f.tone * 6.28));
      const from = dark ? BASE_DARK : BASE;
      const to = dark ? ALT_DARK : ALT;
      return [lerp(from[0], to[0], t), lerp(from[1], to[1], t), lerp(from[2], to[2], t)];
    };
    const boost = () => (dark ? DARK_BOOST : 1);

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
      const y0 = Math.max(scrollY - 40, startY);
      // Animated: the fibres only exist down to the glow, so they grow as you scroll. Still: the whole path.
      const yEnd = Math.min(animated ? Math.min(scrollY + H + 40, head + 30) : scrollY + H + 40, endY);
      if (yEnd - y0 < 24) return;
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
          let a = 0.2;
          let ha = 0;
          if (animated) {
            const behind = Math.max(0, head - y);
            const comet = Math.exp(-behind / 130); // bright just behind the leading light
            const reveal = 1 - smoothstep(head - 50, head + 30, y); // the strand fades in as it is drawn
            a = (0.2 + 0.22 * Math.exp(-behind / 1100) + 0.5 * comet) * reveal;
            ha = 0.2 * comet * reveal;
          }
          const k = Math.min(1, duck(xs[i]) * lifetime(y) * boost());
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
        const loop = Math.max(head - startY + 240, 600);
        for (const s of f.shifts) {
          const yp = startY + ((time * f.speed + s) % loop);
          if (yp < y0 || yp > Math.min(yEnd, head - 20)) continue;
          const xp = fibreX(f, yp);
          glow(xp, yp - scrollY, 11, rgb, 0.8 * duck(xp) * lifetime(yp));
        }

        // The leading light at the end of the strand.
        if (head >= y0 && head <= Math.min(scrollY + H + 40, endY)) {
          const xh = fibreX(f, head);
          glow(xh, head - scrollY, 14, rgb, 0.9 * lifetime(head));
          headXSum += xh;
          headCount++;
        }
      }

      // One soft, wide glow around the bundle's leading edge, so the lights read as one.
      if (animated && headCount) {
        glow(headXSum / headCount, head - scrollY, lite ? 46 : 70, dark ? '129,140,248' : '99,102,241', 0.14 * boost() * lifetime(head));
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

    // Redraw when the theme changes (the still version only draws on scroll).
    const themeObserver = new MutationObserver(() => {
      dark = isDark();
      if (!animated) draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

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
      themeObserver.disconnect();
      ro.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', measure);
      window.removeEventListener('scroll', onScroll);
    };
  }, [mode]);

  return <canvas ref={canvas} className="absolute inset-0" />;
}
