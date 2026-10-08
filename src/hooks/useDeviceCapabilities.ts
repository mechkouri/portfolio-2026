import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

export interface DeviceCapabilities {
  /** Fine pointer (mouse/trackpad) that can hover — enables tilt & parallax. */
  canHover: boolean;
  /** WebGL scene is allowed: desktop-class device, capable GPU, motion allowed. */
  allow3D: boolean;
  reducedMotion: boolean;
}

interface NavigatorHints extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

let weakCache: boolean | undefined;

/** True on data-saver, low-memory/low-core devices, and software rendering. Probed once, then cached. */
export function detectWeakGraphics(): boolean {
  weakCache ??= probeWeakGraphics();
  return weakCache;
}

function probeWeakGraphics(): boolean {
  const nav = navigator as NavigatorHints;
  if (nav.connection?.saveData) return true;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return true;
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency < 4) return true;

  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') ?? canvas.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return true;
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    // Software rasterizers make any WebGL scene janky.
    return /swiftshader|llvmpipe|software|basic render/i.test(renderer);
  } catch {
    return true;
  }
}

function detect(reducedMotion: boolean): DeviceCapabilities {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const wideEnough = window.matchMedia('(min-width: 1024px)').matches;
  const allow3D = !reducedMotion && canHover && wideEnough && !detectWeakGraphics();
  return { canHover: canHover && !reducedMotion, allow3D, reducedMotion };
}

const SSR_SAFE: DeviceCapabilities = { canHover: false, allow3D: false, reducedMotion: true };

export function useDeviceCapabilities(): DeviceCapabilities {
  const reducedMotion = useReducedMotion() ?? false;
  const [caps, setCaps] = useState<DeviceCapabilities>(SSR_SAFE);

  useEffect(() => {
    setCaps(detect(reducedMotion));
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => setCaps(detect(reducedMotion));
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [reducedMotion]);

  return caps;
}

export type BackdropMode = 'full' | 'lite' | 'static';

/**
 * Which version of the site-wide fibre backdrop to show: full, a lighter one for phones, or a
 * still (non-animated) one for visitors who prefer reduced motion.
 */
export function useBackdropMode(): BackdropMode {
  const reducedMotion = useReducedMotion() ?? false;
  const [mode, setMode] = useState<BackdropMode>('static');

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const compute = () => setMode(reducedMotion ? 'static' : mq.matches ? 'full' : 'lite');
    compute();
    mq.addEventListener('change', compute);
    return () => mq.removeEventListener('change', compute);
  }, [reducedMotion]);

  return mode;
}
