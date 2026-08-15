import * as THREE from "three";

import { BRAND } from "@/lib/brand";
import type { Theme } from "@/lib/theme";

/**
 * Scene colour, for every palette in `globals.css`.
 *
 * The two WebGL scenes used to carry their own copies of this, one per file,
 * which meant a palette was really registered in four places and the hero and
 * the collaborators section could drift apart without anyone noticing. They sit
 * together here so a palette is one block of colour end to end, and so the
 * `Record<Theme, …>` below fails the build the moment a theme is added to
 * `THEMES` without a scene colour to go with it.
 *
 * Both scenes share one rule: additive blending is what gives a dark field its
 * glow, but on a light page it only washes toward white — so the two light
 * palettes draw darker-than-page marks with normal blending instead, and take
 * their colours from their own ink rather than from the accent.
 */

/* ------------------------------------------------------------------ *
 * Hero — the particle field behind the headline
 * ------------------------------------------------------------------ */

export type FieldPalette = {
  low: string;
  high: string;
  sparkle: number;
  blending: THREE.Blending;
  /**
   * Kept low because ~44k overlapping sprites accumulate hard: anything much
   * above this saturates into a wall that swallows the headline.
   */
  opacity: number;
};

export const FIELD_PALETTES: Record<Theme, FieldPalette> = {
  blue: {
    low: "#242832",
    high: "#6f93ff",
    sparkle: 0.3,
    blending: THREE.AdditiveBlending,
    opacity: 0.026,
  },
  midnight: {
    low: "#1c1f26",
    high: "#8f9bb5",
    sparkle: 0.24,
    blending: THREE.AdditiveBlending,
    opacity: 0.022,
  },
  paper: {
    low: "#9ca8bb",
    high: "#2457d6",
    sparkle: -0.12,
    blending: THREE.NormalBlending,
    opacity: 0.018,
  },
  white: {
    low: "#aab5c8",
    high: "#2457d6",
    sparkle: -0.12,
    blending: THREE.NormalBlending,
    opacity: 0.016,
  },
};

/**
 * The same field, run for the intro curtain instead. It belongs to no palette —
 * the curtain is the brand's own cobalt and gold whatever the visitor has
 * chosen — so it takes its colours from `BRAND` rather than from the record
 * above. Brighter and denser than any of them, because it plays for two seconds
 * against a flat ground and then leaves.
 */
export const INTRO_FIELD_PALETTE: FieldPalette = {
  low: "#2855a0",
  high: BRAND.gold,
  sparkle: 0.38,
  blending: THREE.AdditiveBlending,
  opacity: 0.034,
};

/* ------------------------------------------------------------------ *
 * Collaborators — the network of hubs, links and packets
 * ------------------------------------------------------------------ */

export type NetworkPalette = {
  /** The organisation nodes. Accent-led on dark, ink-led on light. */
  hub: string;
  /** The smaller bodies orbiting them, alternating with `spark`. */
  peer: string;
  spark: string;
  /** The lines drawn between whatever is currently in reach. */
  line: string;
  blending: THREE.Blending;
  opacity: number;
};

export const NETWORK_PALETTES: Record<Theme, NetworkPalette> = {
  blue: {
    hub: BRAND.gold,
    peer: "#8ab0ff",
    spark: "#6f93ff",
    line: "#6f93ff",
    blending: THREE.AdditiveBlending,
    opacity: 0.55,
  },
  midnight: {
    hub: BRAND.gold,
    peer: "#9aa4bb",
    spark: "#c2cadb",
    line: "#7f89a3",
    blending: THREE.AdditiveBlending,
    opacity: 0.45,
  },
  paper: {
    hub: "#17469a",
    peer: "#2457d6",
    spark: "#6a86c9",
    line: "#2457d6",
    blending: THREE.NormalBlending,
    opacity: 0.5,
  },
  white: {
    hub: "#17469a",
    peer: "#2457d6",
    spark: "#7d95d0",
    line: "#3b6ad8",
    blending: THREE.NormalBlending,
    opacity: 0.45,
  },
};
