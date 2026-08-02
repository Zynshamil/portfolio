"use client";

import dynamic from "next/dynamic";
import { SceneFallback } from "./scene-fallback";

/**
 * Keeps three.js out of the initial JavaScript payload. The hero paints its
 * text and CSS gradient immediately; the ~400kB WebGL chunk streams in after.
 */
export const HeroCanvas = dynamic(
  () => import("./hero-scene").then((mod) => mod.HeroScene),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0">
        <SceneFallback />
      </div>
    ),
  },
);
