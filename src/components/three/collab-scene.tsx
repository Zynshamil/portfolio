"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { collaborators } from "@/content/site";
import { useTheme } from "@/components/ui/theme-provider";
import { DEFAULT_THEME } from "@/lib/theme";
import { NETWORK_PALETTES } from "./palettes";
import { useQuality } from "./use-quality";

/** One hub per organisation on the ring below — the section's actual subject. */
const HUB_COUNT = collaborators.length;
/** Smaller bodies weaving through the ring, so links keep making and breaking. */
const SAT_COUNT = 16;
const NODE_COUNT = HUB_COUNT + SAT_COUNT;

/** Above this separation two nodes are considered "not collaborating". */
const LINK_DIST = 1.45;
/** Upper bound on simultaneously visible connections. */
const LINKS_MAX = 72;
/** Packets in flight along those connections. */
const PULSE_COUNT = 20;

/** Radius of the hub ring; satellites orbit inside and just past it. */
const RING_RADIUS = 2.15;

/** The tiny screen-space node glow. Additive-square for a soft cusp. */
const nodeVertex = /* glsl */ `
  attribute float aScale;
  attribute float aSeed;
  attribute vec3  aColor;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  varying vec3  vColor;
  varying float vHalo;
  void main() {
    vColor = aColor;
    // Hubs carry a wider, softer corona than the satellites around them.
    vHalo = smoothstep(1.0, 1.6, aScale);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float pulse = 0.62 + 0.38 * sin(uTime * 1.8 + aSeed * 6.2831);
    gl_PointSize = aScale * uSize * pulse * uPixelRatio / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const nodeFragment = /* glsl */ `
  precision mediump float;
  varying vec3  vColor;
  varying float vHalo;
  uniform float uOpacity;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv) * 2.0;
    float alpha = smoothstep(1.0, 0.0, d);
    alpha *= alpha;
    // A hard little core inside the falloff reads as a node rather than a blur.
    alpha += vHalo * smoothstep(0.42, 0.0, d) * 0.6;
    gl_FragColor = vec4(vColor, alpha * uOpacity);
  }
`;

/** Lines keep their own alpha per vertex so each link can fade with distance. */
const linkVertex = /* glsl */ `
  attribute float aAlpha;
  varying float vAlpha;
  void main() {
    vAlpha = aAlpha;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const linkFragment = /* glsl */ `
  precision mediump float;
  varying float vAlpha;
  uniform vec3  uLineColor;
  uniform float uOpacity;
  void main() {
    gl_FragColor = vec4(uLineColor, vAlpha * uOpacity);
  }
`;

/** Packets riding the links. Sized in world space so they shrink with depth. */
const pulseVertex = /* glsl */ `
  attribute float aAlpha;
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vAlpha;
  void main() {
    vAlpha = aAlpha;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * uPixelRatio / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const pulseFragment = /* glsl */ `
  precision mediump float;
  varying float vAlpha;
  uniform vec3  uColor;
  uniform float uOpacity;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv) * 2.0;
    float core = smoothstep(0.55, 0.0, d);
    float glow = smoothstep(1.0, 0.0, d) * 0.45;
    gl_FragColor = vec4(uColor, (core + glow) * vAlpha * uOpacity);
  }
`;

type NodeOrbit = {
  radius: number;
  speed: number;
  phase: number;
  bob: number;
  bobSpeed: number;
  tilt: number;
  squash: number;
};

/**
 * Hubs share one angular speed, so the ring turns as a rigid body and keeps its
 * shape; satellites each get their own, so they keep overtaking and falling
 * behind it. That difference is what makes the link test below constantly
 * form and dissolve connections instead of settling into a fixed lattice.
 */
const HUB_SPEED = 0.11;

const orbits: NodeOrbit[] = Array.from({ length: NODE_COUNT }, (_, i) => {
  if (i < HUB_COUNT) {
    return {
      radius: RING_RADIUS,
      speed: HUB_SPEED,
      phase: (i / HUB_COUNT) * Math.PI * 2,
      bob: 0.22,
      bobSpeed: 0.35 + i * 0.07,
      tilt: 0.18,
      squash: 1,
    };
  }
  return {
    radius: 0.5 + Math.pow(Math.random(), 0.8) * 2.4,
    speed: 0.06 + Math.random() * 0.26,
    phase: Math.random() * Math.PI * 2,
    bob: 0.2 + Math.random() * 0.6,
    bobSpeed: 0.3 + Math.random() * 0.5,
    tilt: (Math.random() - 0.5) * 0.9,
    squash: 0.85 + Math.random() * 0.3,
  };
});

type Pulse = {
  /** Node indices this packet is travelling between, or -1 when idle. */
  from: number;
  to: number;
  /** Progress along the link, 0 → 1. */
  t: number;
  speed: number;
};

/**
 * The collaboration network: a ring of hubs — one per organisation listed in
 * this section — orbited by smaller peers, with every pair inside reach lit as
 * a temporary link and packets of light running along the live ones. Reads as
 * work moving between places rather than a decorative particle cloud.
 */
function CollaborationNetwork({
  animate,
  pointer,
}: {
  animate: boolean;
  pointer: React.RefObject<{ x: number; y: number }>;
}) {
  const { theme } = useTheme();
  const palette = NETWORK_PALETTES[theme ?? DEFAULT_THEME];
  const { invalidate } = useThree();

  const groupRef = useRef<THREE.Group>(null);
  const nodeMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const linkMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const pulseMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const smoothed = useRef({ x: 0, y: 0 });

  // CPU buffer for orbit integration; every GPU buffer below reads from it.
  const nodePosition = useRef(new Float32Array(NODE_COUNT * 3)).current;
  /** Node index pairs for the links emitted this frame — the routes a packet
   *  may be dispatched along. */
  const linkPairs = useRef(new Int16Array(LINKS_MAX * 2)).current;
  const pulses = useRef<Pulse[]>(
    Array.from({ length: PULSE_COUNT }, () => ({
      from: -1,
      to: -1,
      t: 0,
      speed: 0.35 + Math.random() * 0.5,
    })),
  ).current;

  const { nodeGeo, linksGeo, pulseGeo, nodeColorAttr, nodePosAttr } =
    useMemo(() => {
      const positions = new Float32Array(NODE_COUNT * 3);
      const colors = new Float32Array(NODE_COUNT * 3);
      const scales = new Float32Array(NODE_COUNT);
      const seeds = new Float32Array(NODE_COUNT);

      for (let i = 0; i < NODE_COUNT; i++) {
        positions[i * 3] = orbits[i].radius;
        // Hubs are deliberately the largest thing on screen after the type.
        scales[i] = i < HUB_COUNT ? 1.7 : 0.55 + Math.random() * 0.4;
        seeds[i] = Math.random();
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
      geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
      geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
      geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 8);

      const links = new THREE.BufferGeometry();
      links.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(LINKS_MAX * 6), 3),
      );
      links.setAttribute(
        "aAlpha",
        new THREE.BufferAttribute(new Float32Array(LINKS_MAX * 2), 1),
      );
      links.setDrawRange(0, 0);
      links.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 8);

      const pulseGeometry = new THREE.BufferGeometry();
      pulseGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(PULSE_COUNT * 3), 3),
      );
      pulseGeometry.setAttribute(
        "aAlpha",
        new THREE.BufferAttribute(new Float32Array(PULSE_COUNT), 1),
      );
      pulseGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 8);

      return {
        nodeGeo: geo,
        linksGeo: links,
        pulseGeo: pulseGeometry,
        nodeColorAttr: geo.getAttribute("aColor") as THREE.BufferAttribute,
        nodePosAttr: geo.getAttribute("position") as THREE.BufferAttribute,
      };
    }, []);

  // Repaint the live nodes and links when the theme flips, so the scene belongs
  // to the same palette as the cards in front of it.
  useEffect(() => {
    const temp = new THREE.Color();
    const colors = nodeColorAttr.array as Float32Array;
    for (let i = 0; i < NODE_COUNT; i++) {
      // Hubs take the accent; the peers alternate through the cooler pair.
      temp.set(
        i < HUB_COUNT ? palette.hub : i % 2 ? palette.peer : palette.spark,
      );
      temp.toArray(colors, i * 3);
    }
    nodeColorAttr.needsUpdate = true;
    (
      linkMaterialRef.current?.uniforms.uLineColor.value as THREE.Color
    )?.set(palette.line);
    (pulseMaterialRef.current?.uniforms.uColor.value as THREE.Color)?.set(
      palette.hub,
    );
    invalidate();
  }, [palette, nodeColorAttr, invalidate]);

  const nodeUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 26 },
      uPixelRatio: { value: 1 },
      uOpacity: { value: 0 },
    }),
    [],
  );

  const linkUniforms = useMemo(
    () => ({
      uLineColor: { value: new THREE.Color(palette.line) },
      uOpacity: { value: 0 },
    }),
    // Mount-time snapshot; the theme effect above owns every later change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const pulseUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(palette.hub) },
      uSize: { value: 34 },
      uPixelRatio: { value: 1 },
      uOpacity: { value: 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // The reduced-motion path draws one still frame, so it gets no render loop to
  // damp the fade across — set the opacities directly or it stays invisible.
  useEffect(() => {
    if (animate) return;
    if (nodeMaterialRef.current)
      nodeMaterialRef.current.uniforms.uOpacity.value = palette.opacity;
    if (pulseMaterialRef.current)
      pulseMaterialRef.current.uniforms.uOpacity.value = palette.opacity;
    invalidate();
  }, [animate, palette, invalidate]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const timeScale = animate ? t : 0;

    const nUniforms = nodeMaterialRef.current?.uniforms;
    const lUniforms = linkMaterialRef.current?.uniforms;
    const pUniforms = pulseMaterialRef.current?.uniforms;

    if (nUniforms) {
      nUniforms.uOpacity.value = THREE.MathUtils.damp(
        nUniforms.uOpacity.value,
        palette.opacity,
        2,
        dt,
      );
      nUniforms.uPixelRatio.value = state.gl.getPixelRatio();
      nUniforms.uTime.value = timeScale;
    }
    if (lUniforms) lUniforms.uOpacity.value = palette.opacity * 0.5;
    if (pUniforms) {
      pUniforms.uOpacity.value = THREE.MathUtils.damp(
        pUniforms.uOpacity.value,
        palette.opacity,
        2,
        dt,
      );
      pUniforms.uPixelRatio.value = state.gl.getPixelRatio();
    }

    // Integrate each node along its own tilted orbit.
    for (let i = 0; i < NODE_COUNT; i++) {
      const o = orbits[i];
      const angle = o.phase + timeScale * o.speed;
      nodePosition[i * 3] = Math.cos(angle) * o.radius * o.squash;
      nodePosition[i * 3 + 1] =
        Math.sin(timeScale * o.bobSpeed + o.phase) * o.bob +
        Math.sin(angle * 2) * 0.12;
      nodePosition[i * 3 + 2] =
        Math.sin(angle) * o.radius + Math.cos(angle * o.tilt) * o.tilt;
    }
    (nodePosAttr.array as Float32Array).set(nodePosition);
    nodePosAttr.needsUpdate = true;

    // Links. The hub ring is always wired to its neighbours — that spine is the
    // standing relationship — and everything else lights up only while it is
    // close enough, fading smoothly toward the cutoff.
    const posAttr = linksGeo.getAttribute("position");
    const alphaAttr = linksGeo.getAttribute("aAlpha");
    const p = posAttr.array as Float32Array;
    const a = alphaAttr.array as Float32Array;
    let linkCount = 0;

    const writeLink = (i: number, j: number, strength: number) => {
      const k = linkCount * 6;
      const i3 = i * 3;
      const j3 = j * 3;
      p[k] = nodePosition[i3];
      p[k + 1] = nodePosition[i3 + 1];
      p[k + 2] = nodePosition[i3 + 2];
      p[k + 3] = nodePosition[j3];
      p[k + 4] = nodePosition[j3 + 1];
      p[k + 5] = nodePosition[j3 + 2];
      const v = linkCount * 2;
      a[v] = strength;
      a[v + 1] = strength;
      linkPairs[v] = i;
      linkPairs[v + 1] = j;
      linkCount++;
    };

    for (let i = 0; i < HUB_COUNT; i++) {
      writeLink(i, (i + 1) % HUB_COUNT, 0.42);
    }

    for (let i = 0; i < NODE_COUNT && linkCount < LINKS_MAX; i++) {
      const i3 = i * 3;
      const ix = nodePosition[i3];
      const iy = nodePosition[i3 + 1];
      const iz = nodePosition[i3 + 2];
      // Hub-to-hub pairs are already spoken for by the ring spine above.
      const start = i < HUB_COUNT ? Math.max(i + 1, HUB_COUNT) : i + 1;
      for (let j = start; j < NODE_COUNT && linkCount < LINKS_MAX; j++) {
        const j3 = j * 3;
        const dx = ix - nodePosition[j3];
        const dy = iy - nodePosition[j3 + 1];
        const dz = iz - nodePosition[j3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist >= LINK_DIST) continue;
        writeLink(i, j, Math.pow(1 - dist / LINK_DIST, 1.6));
      }
    }

    posAttr.needsUpdate = true;
    alphaAttr.needsUpdate = true;
    linksGeo.setDrawRange(0, linkCount * 2);

    // Packets. Each rides one link end to end, then gets dispatched down
    // whichever route happens to be open at that moment.
    const pulsePos = pulseGeo.getAttribute("position");
    const pulseAlpha = pulseGeo.getAttribute("aAlpha");
    const pp = pulsePos.array as Float32Array;
    const pa = pulseAlpha.array as Float32Array;

    for (let i = 0; i < PULSE_COUNT; i++) {
      const pulse = pulses[i];

      if (pulse.from < 0 || pulse.t >= 1) {
        if (linkCount === 0) {
          pa[i] = 0;
          continue;
        }
        const route = Math.floor(Math.random() * linkCount) * 2;
        pulse.from = linkPairs[route];
        pulse.to = linkPairs[route + 1];
        // Stagger the still frame so reduced-motion visitors don't see every
        // packet stacked on the same starting node.
        pulse.t = animate ? 0 : Math.random();
        pulse.speed = 0.35 + Math.random() * 0.5;
      } else if (animate) {
        pulse.t += pulse.speed * dt;
      }

      const clamped = Math.min(pulse.t, 1);
      const f3 = pulse.from * 3;
      const t3 = pulse.to * 3;
      pp[i * 3] =
        nodePosition[f3] + (nodePosition[t3] - nodePosition[f3]) * clamped;
      pp[i * 3 + 1] =
        nodePosition[f3 + 1] +
        (nodePosition[t3 + 1] - nodePosition[f3 + 1]) * clamped;
      pp[i * 3 + 2] =
        nodePosition[f3 + 2] +
        (nodePosition[t3 + 2] - nodePosition[f3 + 2]) * clamped;
      // Fade in off the sender and out into the receiver, so packets appear to
      // be absorbed rather than to blink out mid-flight.
      pa[i] = Math.sin(clamped * Math.PI);
    }
    pulsePos.needsUpdate = true;
    pulseAlpha.needsUpdate = true;

    smoothed.current.x = THREE.MathUtils.damp(
      smoothed.current.x,
      pointer.current.x,
      4,
      dt,
    );
    smoothed.current.y = THREE.MathUtils.damp(
      smoothed.current.y,
      pointer.current.y,
      4,
      dt,
    );

    if (groupRef.current) {
      groupRef.current.rotation.y = timeScale * 0.05 + smoothed.current.x * 0.1;
      groupRef.current.rotation.x =
        Math.sin(timeScale * 0.3) * 0.06 - smoothed.current.y * 0.08 - 0.12;
      groupRef.current.position.y = animate ? Math.sin(t * 0.4) * 0.1 : 0;
    }
  });

  return (
    // Flattened and spread, so the network reads as a band running the width of
    // the section behind the cards rather than a ball behind the middle of it.
    <group ref={groupRef} scale={[1.35, 0.78, 1]}>
      <lineSegments geometry={linksGeo} frustumCulled={false}>
        <shaderMaterial
          ref={linkMaterialRef}
          vertexShader={linkVertex}
          fragmentShader={linkFragment}
          uniforms={linkUniforms}
          transparent
          depthWrite={false}
          blending={palette.blending}
        />
      </lineSegments>
      <points geometry={nodeGeo} frustumCulled={false}>
        <shaderMaterial
          ref={nodeMaterialRef}
          vertexShader={nodeVertex}
          fragmentShader={nodeFragment}
          uniforms={nodeUniforms}
          transparent
          depthWrite={false}
          blending={palette.blending}
        />
      </points>
      <points geometry={pulseGeo} frustumCulled={false}>
        <shaderMaterial
          ref={pulseMaterialRef}
          vertexShader={pulseVertex}
          fragmentShader={pulseFragment}
          uniforms={pulseUniforms}
          transparent
          depthWrite={false}
          blending={palette.blending}
        />
      </points>
    </group>
  );
}

/** The canvas that hosts the network, gated behind the same quality/theme logic
 *  as the hero so nothing paints until WebGL and the palette are both ready. */
export function CollaborationScene() {
  const quality = useQuality();
  const { theme } = useTheme();
  const pointer = useRef({ x: 0, y: 0 });
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "160px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const showCanvas =
    quality !== null && quality.tier !== "off" && theme !== null;

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0">
      {showCanvas && (
        <Canvas
          className="!absolute inset-0"
          dpr={quality.dpr}
          frameloop={
            !quality.animate ? "demand" : inView && tabVisible ? "always" : "never"
          }
          camera={{ position: [0, 0, 5.4], fov: 46 }}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
          }}
          style={{ pointerEvents: "none" }}
        >
          <CollaborationNetwork animate={quality.animate} pointer={pointer} />
        </Canvas>
      )}
    </div>
  );
}
