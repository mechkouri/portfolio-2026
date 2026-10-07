import { Component, lazy, Suspense, useEffect, useState, type ReactNode, type RefObject } from 'react';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';

const HeroScene = lazy(() => import('./HeroScene'));

const NODES = [
  { x: 560, y: 330, c: '#4f46e5' },
  { x: 720, y: 110, c: '#0284c7' },
  { x: 880, y: 320, c: '#d97706' },
  { x: 1030, y: 120, c: '#059669' },
  { x: 1150, y: 260, c: '#4f46e5' },
];

/** Static SVG version of the pipeline for mobile, reduced motion, and weak GPUs. */
function PipelineFallback() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 420"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full opacity-60"
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, transparent 38%, black 65%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 38%, black 65%)',
      }}
    >
      <path
        d="M560 330 C 640 330, 640 110, 720 110 S 800 320, 880 320 S 960 120, 1030 120 S 1110 260, 1150 260"
        fill="none"
        stroke="#6366f1"
        strokeOpacity="0.35"
        strokeWidth="1.5"
        strokeDasharray="6 6"
        className="animate-flow"
      />
      {NODES.map((n) => (
        <g key={n.x}>
          <circle cx={n.x} cy={n.y} r="22" fill="none" stroke={n.c} strokeOpacity="0.45" />
          <circle cx={n.x} cy={n.y} r="6" fill={n.c} />
        </g>
      ))}
    </svg>
  );
}

/**
 * Keeps a failed 3D load (a chunk 404 after a redeploy, or a WebGL context error)
 * from unmounting the whole page: the hero just keeps the static fallback.
 */
class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <PipelineFallback /> : this.props.children;
  }
}

/**
 * Chooses between the WebGL scene and the static fallback. The 3D bundle is only
 * requested once the browser is idle, so it never competes with the LCP.
 */
export function HeroBackdrop({ eventSource }: { eventSource: RefObject<HTMLElement | null> }) {
  const { allow3D } = useDeviceCapabilities();
  const [idle, setIdle] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!allow3D) return;
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = ric(() => setIdle(true), { timeout: 2500 });
    return () => cancel(id);
  }, [allow3D]);

  if (!allow3D || failed || !idle) return <PipelineFallback />;

  return (
    <SceneErrorBoundary>
      <Suspense fallback={<PipelineFallback />}>
        <HeroScene eventSource={eventSource} onUnsupported={() => setFailed(true)} />
      </Suspense>
    </SceneErrorBoundary>
  );
}
