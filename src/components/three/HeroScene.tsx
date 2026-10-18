import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../theme/ThemeProvider';

/*
 * "Automation pipeline" scene: five wireframe nodes (Trigger → Process → AI →
 * Integration → Action) on a spline, with data packets flowing between them.
 * Unlit materials only — no lights, shadows or post-processing — so it stays
 * cheap enough to sit behind the hero without hurting interaction latency.
 */

const NODE_COLORS = ['#4f46e5', '#0284c7', '#d97706', '#059669', '#4f46e5'];
const NODE_COLORS_DARK = ['#818cf8', '#38bdf8', '#fbbf24', '#34d399', '#818cf8'];
const NODE_POINTS = [
  new THREE.Vector3(-1.4, -1.9, -1.4),
  new THREE.Vector3(0.5, 1.9, -0.4),
  new THREE.Vector3(2.4, -2.1, 0.2),
  new THREE.Vector3(4.1, 1.6, -0.6),
  new THREE.Vector3(5.6, -0.9, -1.2),
];
const PACKETS = 7;
const PARTICLES = 260;

function Pipeline({ dark }: { dark: boolean }) {
  const nodeColors = dark ? NODE_COLORS_DARK : NODE_COLORS;
  const group = useRef<THREE.Group>(null);
  const nodes = useRef<(THREE.Group | null)[]>([]);
  const packets = useRef<THREE.InstancedMesh>(null);
  const hovered = useRef<number | null>(null);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(NODE_POINTS, false, 'catmullrom', 0.5), []);
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 160, 0.012, 6, false), [curve]);
  const particles = useMemo(() => {
    const positions = new Float32Array(PARTICLES * 3);
    // Deterministic pseudo-random spread so the layout is identical on every load.
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
    for (let i = 0; i < PARTICLES; i++) {
      positions.set([rand() * 4.5 + 2.5, rand() * 3.6, rand() * 3 - 1.5], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useEffect(() => () => {
    tube.dispose();
    particles.dispose();
  }, [tube, particles]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const point = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const { x, y } = state.pointer;
    const ease = 1 - Math.exp(-delta * 3);

    // Mouse-driven rotation and parallax, eased so it never feels twitchy.
    g.rotation.y += (x * 0.28 - g.rotation.y) * ease;
    g.rotation.x += (-y * 0.16 - g.rotation.x) * ease;
    g.position.y = Math.sin(t * 0.5) * 0.12;
    state.camera.position.x += (x * 0.6 - state.camera.position.x) * ease;
    state.camera.position.y += (y * 0.3 - state.camera.position.y) * ease;
    state.camera.lookAt(0.4, 0, 0);

    nodes.current.forEach((node, i) => {
      if (!node) return;
      const target = hovered.current === i ? 1.45 : 1;
      const s = node.scale.x + (target - node.scale.x) * (1 - Math.exp(-delta * 10));
      node.scale.setScalar(s);
      node.rotation.x = t * 0.25 + i;
      node.rotation.y = t * 0.35 + i * 0.6;
    });

    const mesh = packets.current;
    if (mesh) {
      for (let i = 0; i < PACKETS; i++) {
        curve.getPointAt((t * 0.06 + i / PACKETS) % 1, point);
        dummy.position.copy(point);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={group}>
      <mesh geometry={tube}>
        <meshBasicMaterial color={dark ? '#8b95ff' : '#6366f1'} transparent opacity={dark ? 0.6 : 0.45} />
      </mesh>

      {NODE_POINTS.map((p, i) => (
        <group
          key={i}
          position={p}
          ref={(el) => {
            nodes.current[i] = el;
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            hovered.current = i;
          }}
          onPointerOut={() => {
            if (hovered.current === i) hovered.current = null;
          }}
        >
          <mesh>
            <icosahedronGeometry args={[0.46, 1]} />
            <meshBasicMaterial color={nodeColors[i]} wireframe transparent opacity={dark ? 0.75 : 0.55} />
          </mesh>
          <mesh>
            <icosahedronGeometry args={[0.14, 2]} />
            <meshBasicMaterial color={nodeColors[i]} />
          </mesh>
        </group>
      ))}

      <instancedMesh ref={packets} args={[undefined, undefined, PACKETS]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color={dark ? '#67e8f9' : '#06b6d4'} />
      </instancedMesh>

      <points geometry={particles}>
        <pointsMaterial color={dark ? '#94a3b8' : '#64748b'} size={0.025} sizeAttenuation transparent opacity={0.45} depthWrite={false} />
      </points>
    </group>
  );
}

interface HeroSceneProps {
  /** Element that receives pointer events (the hero), so content can sit above the canvas. */
  eventSource: RefObject<HTMLElement | null>;
  onUnsupported: () => void;
}

export default function HeroScene({ eventSource, onUnsupported }: HeroSceneProps) {
  // The 3D tree is a separate React root, so the theme is read here and handed down as a prop.
  const dark = useTheme().theme === 'dark';
  const wrapper = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [dpr, setDpr] = useState(1.5);
  const [ready, setReady] = useState(false);

  // Stop rendering entirely while the hero is scrolled out of view.
  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '100px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapper}
      aria-hidden="true"
      className="absolute inset-0 transition-opacity duration-1000"
      style={{
        opacity: ready ? 1 : 0,
        maskImage: 'linear-gradient(to right, transparent 0%, transparent 38%, black 62%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 38%, black 62%)',
      }}
    >
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={dpr}
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
        eventSource={eventSource as RefObject<HTMLElement>}
        eventPrefix="client"
        onCreated={() => setReady(true)}
      >
        <PerformanceMonitor
          onIncline={() => setDpr(Math.min(2, window.devicePixelRatio))}
          onDecline={() => setDpr(1)}
          flipflops={3}
          onFallback={onUnsupported}
        >
          <Pipeline dark={dark} />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
