"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { ResolvedTheme } from "@/lib/theme";
import { particleFragment, particleVertex } from "./shaders";

type Props = {
  count: number;
  animate: boolean;
  pointer: React.RefObject<{ x: number; y: number }>;
  theme: ResolvedTheme;
  variant?: "hero" | "intro";
};

/** Frozen clock value used for the still frame when motion is reduced. */
const STILL_TIME = 12;

/**
 * Additive blending is what gives the dark field its glow, but on paper it only
 * washes toward white — so the light palette draws darker-than-page particles
 * with normal blending instead, and takes its colours from the light tokens
 * (warm neutral shading up to the deepened accent) so the field belongs to the
 * same palette as the type in front of it.
 *
 * The opacity targets are low because ~44k overlapping sprites accumulate hard:
 * anything much above this saturates into a wall that swallows the headline.
 */
const PALETTES: Record<
  ResolvedTheme,
  {
    low: string;
    high: string;
    sparkle: number;
    blending: THREE.Blending;
    opacity: number;
  }
> = {
  dark: {
    low: "#242832",
    high: "#6f93ff",
    sparkle: 0.3,
    blending: THREE.AdditiveBlending,
    opacity: 0.026,
  },
  light: {
    low: "#9ca8bb",
    high: "#2457d6",
    sparkle: -0.12,
    blending: THREE.NormalBlending,
    opacity: 0.018,
  },
};

const INTRO_PALETTE = {
  low: "#2855a0",
  high: "#ffd447",
  sparkle: 0.38,
  blending: THREE.AdditiveBlending,
  opacity: 0.034,
};

export function ParticleField({
  count,
  animate,
  pointer,
  theme,
  variant = "hero",
}: Props) {
  const palette = variant === "intro" ? INTRO_PALETTE : PALETTES[theme];
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport, invalidate } = useThree();

  // Reused across frames so the render loop allocates nothing.
  const pointerWorld = useRef(new THREE.Vector3());
  const smoothed = useRef({ x: 0, y: 0 });

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const seeds = new Float32Array(count);

    // Fibonacci distribution gives an even spread with no polar clustering.
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / Math.max(count - 1, 1)) * 2;
      const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;

      // Cubed random pushes most points onto a tight shell and lets a few
      // drift out into a halo, which is what stops it reading as a hard ball.
      const radius = 1 + Math.pow(Math.random(), 3) * 0.9;

      positions[i * 3] = Math.cos(theta) * ringRadius * radius;
      positions[i * 3 + 1] = y * radius;
      positions[i * 3 + 2] = Math.sin(theta) * ringRadius * radius;

      scales[i] = 0.5 + Math.random() * 1.6;
      seeds[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    // Displacement happens in the shader, so the CPU-side bounds are wrong.
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4);
    return geo;
  }, [count]);

  /**
   * Seed values only. R3F *clones* whatever is passed as `uniforms`, so this
   * object is not the one the material renders with — every later write has to
   * go through `materialRef.current.uniforms` or it lands on a detached copy
   * and the field stays transparent and frozen.
   */
  const seedUniforms = useMemo(
    () => ({
      uTime: { value: animate ? 0 : STILL_TIME },
      uSize: { value: 54 },
      uPixelRatio: { value: 1 },
      uAmplitude: { value: 0.42 },
      uPointer: { value: new THREE.Vector3(999, 999, 999) },
      uPointerStrength: { value: 0.48 },
      uColorLow: { value: new THREE.Color(palette.low) },
      uColorHigh: { value: new THREE.Color(palette.high) },
      uSparkle: { value: palette.sparkle },
      uOpacity: { value: 0 },
    }),
    // Mount-time snapshot; the effect below owns every subsequent change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Repaint the live material when the theme flips. Blending is re-read from the
  // material on every draw, so swapping it needs no recompile and no remount.
  useEffect(() => {
    const material = materialRef.current;
    if (!material) return;
    const u = material.uniforms;
    u.uColorLow.value.set(palette.low);
    u.uColorHigh.value.set(palette.high);
    u.uSparkle.value = palette.sparkle;
    material.blending = palette.blending;
    // The reduced-motion path renders on demand, so it gets no frames to damp
    // the fade across and the new colours would sit unrendered in the uniforms.
    if (!animate) u.uOpacity.value = palette.opacity;
    invalidate();
  }, [palette, invalidate, animate]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const uniforms = materialRef.current?.uniforms;
    if (!uniforms) return;

    // Fade in rather than popping, on both the animated and still paths.
    uniforms.uOpacity.value = THREE.MathUtils.damp(
      uniforms.uOpacity.value,
      palette.opacity,
      2.2,
      dt,
    );
    uniforms.uPixelRatio.value = state.gl.getPixelRatio();

    if (!animate) return;

    uniforms.uTime.value = state.clock.elapsedTime;

    // Pointer, smoothed then converted into the rotating group's local frame
    // so the crater tracks the cursor even while the field turns.
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

    if (pointsRef.current) {
      pointerWorld.current.set(
        (smoothed.current.x * viewport.width) / 2,
        (smoothed.current.y * viewport.height) / 2,
        0.6,
      );
      pointsRef.current.worldToLocal(pointerWorld.current);
      uniforms.uPointer.value.copy(pointerWorld.current);
    }

    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.rotation.y = t * 0.055 + smoothed.current.x * 0.22;
      groupRef.current.rotation.x = -smoothed.current.y * 0.16;
      groupRef.current.position.y = Math.sin(t * 0.35) * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={particleVertex}
          fragmentShader={particleFragment}
          uniforms={seedUniforms}
          transparent
          depthWrite={false}
          blending={palette.blending}
        />
      </points>
    </group>
  );
}
