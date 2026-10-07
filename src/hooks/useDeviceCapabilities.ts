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

function detectWeakGraphics(): boolean {
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
