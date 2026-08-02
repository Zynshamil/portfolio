"use client";

import { useEffect, useState } from "react";

export type Tier = "off" | "low" | "mid" | "high";

export type Quality = {
  tier: Tier;
  /** Number of particles in the field. */
  count: number;
  /** Clamped device pixel ratio range handed to the renderer. */
  dpr: [number, number];
  /** False when the user asked for reduced motion — scene renders one still frame. */
  animate: boolean;
};

const PRESETS: Record<Exclude<Tier, "off">, Omit<Quality, "tier" | "animate">> = {
  low: { count: 6000, dpr: [1, 1.25] },
  mid: { count: 20000, dpr: [1, 1.5] },
  high: { count: 44000, dpr: [1, 1.75] },
};

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ??
        canvas.getContext("webgl") ??
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

/**
 * Picks a render budget from what the device tells us about itself, once, on
 * mount. Deliberately pessimistic: it is far better to under-render on a
 * capable machine than to drop frames on a recruiter's three-year-old phone.
 *
 * Returns null until measured so callers can hold the CSS fallback in place
 * rather than flashing an empty canvas.
 */
export function useQuality(): Quality | null {
  const [quality, setQuality] = useState<Quality | null>(null);

  useEffect(() => {
    if (!supportsWebGL()) {
      setQuality({ tier: "off", count: 0, dpr: [1, 1], animate: false });
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    const memory =
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    const narrow = window.innerWidth < 768;

    let tier: Exclude<Tier, "off">;
    if (narrow || coarse || cores <= 4 || memory <= 4) {
      tier = "low";
    } else if (cores <= 8 || memory <= 8) {
      tier = "mid";
    } else {
      tier = "high";
    }

    setQuality({ tier, ...PRESETS[tier], animate: !reduced });
  }, []);

  return quality;
}
