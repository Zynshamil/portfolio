"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import { stagger, useAnimate, useReducedMotion } from "motion/react";
import { site } from "@/content/site";
import { IntroCanvas } from "@/components/three/intro-canvas";

const EASE = [0.16, 1, 0.3, 1] as const;
/** Slow-in, slow-out — the name feels carried to the corner, not thrown. */
const TRAVEL_EASE = [0.76, 0, 0.24, 1] as const;

const HOLD_MS = 1100;
/** If anything above throws or stalls, the page must still become usable. */
const FAILSAFE_MS = 6000;

/** True once the curtain is gone, so hero animations don't play behind it. */
const IntroContext = createContext(true);
export const useIntroDone = () => useContext(IntroContext);

const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function IntroProvider({ children }: { children: ReactNode }) {
  // The server can't know whether the intro already played, so it always emits
  // the curtain; the pre-paint script decides visibility, and this effect —
  // which runs before the browser paints — throws it away when it isn't needed.
  const [running, setRunning] = useState(true);

  useIsoLayoutEffect(() => {
    if (document.documentElement.dataset.intro !== "running") setRunning(false);
  }, []);

  // Stable, so an unrelated re-render can never restart the animation.
  const end = useCallback(() => setRunning(false), []);

  return (
    <IntroContext.Provider value={!running}>
      {running && <IntroCurtain onDone={end} />}
      {children}
    </IntroContext.Provider>
  );
}

function IntroCurtain({ onDone }: { onDone: () => void }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reduced = useReducedMotion();

  useEffect(() => {
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const finish = () => {
      if (settled) return;
      settled = true;
      // Uncovers the real nav logo in the same frame the curtain unmounts, so
      // the handoff between the two identical wordmarks is invisible.
      document.documentElement.dataset.intro = "done";
      onDone();
    };

    if (reduced) {
      finish();
      return;
    }

    const root = scope.current;
    const name = root.querySelector<HTMLElement>("[data-intro-name]");
    const panel = root.querySelector<HTMLElement>("[data-intro-panel]");
    const dot = root.querySelector<HTMLElement>("[data-intro-dot]");
    const chars = root.querySelectorAll<HTMLElement>("[data-intro-char]");
    const brand = document.querySelector<HTMLElement>("[data-brand]");

    if (!name || !panel) {
      finish();
      return;
    }

    // A restored scroll position would put the nav logo somewhere the name is
    // about to fly to, and the page has to start at the top anyway.
    window.scrollTo(0, 0);

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, ms);
      });

    const run = async () => {
      await animate(
        chars,
        { y: ["105%", "0%"] },
        { duration: 0.9, delay: stagger(0.04), ease: EASE },
      );
      if (settled) return;

      await sleep(HOLD_MS);
      if (settled) return;

      // FLIP: measure where the name is now and where the nav logo already
      // sits, then close the gap with transforms only. Because the two share a
      // typeface and tracking, matching their widths matches every glyph.
      const from = name.getBoundingClientRect();
      const to = brand?.getBoundingClientRect();

      animate(panel, { opacity: 0 }, { duration: 0.7, delay: 0.4, ease: EASE });

      if (!to?.width) {
        // No logo to land on — bow out rather than leave the name floating.
        await animate(
          name,
          { opacity: 0, y: -32 },
          { duration: 0.6, ease: EASE },
        );
        return finish();
      }

      // The white is leaving, so the ink has to become the page's own colour.
      animate(name, { color: "var(--fg)" }, { duration: 0.5, delay: 0.5 });
      if (dot)
        animate(dot, { color: "var(--accent)" }, { duration: 0.5, delay: 0.5 });

      await animate(
        name,
        {
          x: to.left - from.left,
          y: to.top - from.top,
          scale: to.width / from.width,
        },
        { duration: 1.15, ease: TRAVEL_EASE },
      );

      finish();
    };

    run().catch(finish);
    const failsafe = setTimeout(finish, FAILSAFE_MS);

    return () => {
      settled = true;
      clearTimeout(timer);
      clearTimeout(failsafe);
    };
    // `onDone` only ever unmounts this component, so it cannot restart the run.
  }, [animate, onDone, reduced, scope]);

  const letters = [...site.brand];

  return (
    <div
      id="intro"
      ref={scope}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-100"
    >
      <div data-intro-panel className="absolute inset-0 overflow-hidden bg-[#153d8a]">
        <div className="absolute -top-[28vmin] -right-[20vmin] h-[72vmin] w-[72vmin] rounded-full border-[min(1.25vw,14px)] border-[#ffd447]/85" />
        <div className="absolute top-[14%] right-[11%] h-[15vmin] w-[15vmin] rounded-full bg-[#ed5d32]" />
        <p className="absolute top-7 left-7 text-[10px] font-extrabold tracking-[0.18em] text-[#ffd447] uppercase sm:top-10 sm:left-10">
          Full-stack developer / India + worldwide
        </p>
        <p className="absolute right-7 bottom-7 text-right text-[10px] font-extrabold tracking-[0.18em] text-[#ffd447] uppercase sm:right-10 sm:bottom-10">
          Websites · apps · systems
        </p>
      </div>
      <div className="absolute inset-0 opacity-90 mix-blend-screen">
        <IntroCanvas />
      </div>

      <div className="absolute inset-0 grid place-items-center">
        <span
          data-intro-name
          // Transforms measure from the corner the name is flying to, which is
          // what makes the FLIP arithmetic above a straight subtraction.
          className="wordmark intro-sign inline-block origin-top-left whitespace-nowrap will-change-transform"
          style={{ fontSize: "clamp(2.25rem, 11vw, 7rem)" }}
        >
          {letters.map((letter, index) => (
            <Masked key={`${letter}-${index}`}>
              {letter === " " ? " " : letter}
            </Masked>
          ))}
          {/* The nav logo ends in an accent full stop, so this copy carries one
              too — deepened for legibility while the backdrop is still white. */}
          <Masked dot>.</Masked>
        </span>
      </div>
    </div>
  );
}

/**
 * One glyph waiting below a clipping mask. The starting offset is an inline
 * style rather than a Motion `initial`, because the curtain is painted from
 * server HTML — the letters have to already be out of sight in that first
 * frame, before any JavaScript has had a chance to run.
 */
function Masked({ children, dot }: { children: ReactNode; dot?: boolean }) {
  return (
    // The wordmark is all caps, so there are no descenders to clear — just
    // enough slack that the mask's edge never shaves the baseline.
    <span className="inline-block overflow-hidden pb-[0.04em] align-bottom">
      <span
        data-intro-char
        data-intro-dot={dot ? "" : undefined}
        className={dot ? "inline-block text-[#ed5d32]" : "inline-block"}
        style={{ transform: "translateY(105%)" }}
      >
        {children}
      </span>
    </span>
  );
}
