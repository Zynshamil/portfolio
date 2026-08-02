"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useTheme } from "@/components/ui/theme-provider";
import { ParticleField } from "./particle-field";
import { SceneFallback } from "./scene-fallback";
import { useQuality } from "./use-quality";

/**
 * Hero WebGL scene.
 *
 * Three things keep this cheap: the render budget is chosen from device
 * capability before the first frame, the loop is cut to `never` whenever the
 * hero scrolls out of view or the tab is hidden, and reduced-motion visitors
 * get a single still frame instead of an animation.
 */
export function HeroScene() {
  const quality = useQuality();
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

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
      { rootMargin: "120px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Both the quality tier and the theme resolve in mount effects, so waiting for
  // them costs nothing and avoids painting the field in the wrong palette first.
  const showCanvas =
    quality !== null && quality.tier !== "off" && resolvedTheme !== null;

  return (
    <div ref={containerRef} className="absolute inset-0">
      <SceneFallback />
      {showCanvas && (
        <Canvas
          className="!absolute inset-0"
          dpr={quality.dpr}
          frameloop={
            !quality.animate ? "demand" : inView && tabVisible ? "always" : "never"
          }
          camera={{ position: [0, 0, 3.6], fov: 42 }}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
          }}
          style={{ pointerEvents: "none" }}
        >
          <ParticleField
            count={quality.count}
            animate={quality.animate}
            pointer={pointer}
            theme={resolvedTheme}
          />
        </Canvas>
      )}
    </div>
  );
}
