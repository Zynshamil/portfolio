"use client";

import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { useTheme } from "@/components/ui/theme-provider";
import { ParticleField } from "./particle-field";
import { useQuality } from "./use-quality";

/** A brief, gold-on-cobalt moving object for the opening curtain. */
function IntroScene() {
  const quality = useQuality();
  const { theme } = useTheme();
  const pointer = useRef({ x: 0, y: 0 });

  if (!quality || !theme || quality.tier === "off") return null;

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={quality.dpr}
      frameloop={quality.animate ? "always" : "demand"}
      camera={{ position: [0, 0, 3.6], fov: 42 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <ParticleField
        count={Math.min(quality.count, 20000)}
        animate={quality.animate}
        pointer={pointer}
        theme={theme}
        variant="intro"
      />
    </Canvas>
  );
}

export const IntroCanvas = dynamic(async () => IntroScene, { ssr: false });
