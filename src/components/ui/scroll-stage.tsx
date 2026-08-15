"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  cubicBezier,
  motion,
  useScroll,
  useTransform,
  type MotionStyle,
} from "motion/react";

/**
 * Scroll spent on the stage, on top of the screen the hero already occupies.
 * This is the one knob for pacing: raise it and the shrink and the hold below
 * stretch out proportionally, because they are expressed as fractions of it.
 */
const STAGE_SVH = 90;

/** Progress at which the headline has finished shrinking. The rest of the
 *  stage is a hold at that size — nothing animates, so the settled state is
 *  read as a state rather than as a moment on the way to somewhere else. */
const FOLD_END = 0.78;

/** How small the headline settles before it sinks. Narrow screens shrink less,
 *  because the type is already near its clamp floor there and any further
 *  reduction reads as a mistake rather than as a move. */
const SHRINK_SCALE = 0.46;
const SHRINK_SCALE_NARROW = 0.66;
const NARROW_WIDTH = 640;

/** Slow out of the full screen, long settle at the small size. */
const EASE = cubicBezier(0.5, 0, 0.12, 1);

/**
 * Not motion's `useReducedMotion`: that one reads the media query during the
 * first render, and the two branches below are structurally different, so a
 * reduced-motion visitor would hydrate a tree the server never sent. Starting
 * at `false` and correcting in an effect keeps the first render identical on
 * both sides — and costs nothing, because setting `false` over `false` is a
 * bail-out for everyone else.
 */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return reduced;
}

type Props = {
  /** The field and poster texture. Held full-screen for the whole stage. */
  backdrop: ReactNode;
  /** The hero's copy, which is what actually shrinks. */
  hero: ReactNode;
  /** Everything the page continues with once the stage releases. */
  children: ReactNode;
};

/**
 * The hero does not scroll away — it is pinned, and its copy shrinks toward the
 * centre of the screen and stops there. That settled state is the end of it:
 * the pin then releases and the whole stage scrolls off as one piece, carrying
 * the headline with it, so the handoff to the next section is ordinary page
 * scroll rather than one more animation.
 *
 * The one thing that never moves is the field. It is mounted here, behind
 * everything, and is untouched by the shrink — so there is a single animation
 * on screen at all times, and the picture the headline shrinks against is
 * continuous with the picture around it. That continuity is the whole trick;
 * the moment the field belongs to the shrinking element instead of the stage,
 * the seam gives the effect away.
 *
 * Every value is read straight off scroll position rather than played on a
 * timer, so it tracks the wheel exactly and unwinds cleanly on the way back up.
 */
export function ScrollStage({ backdrop, hero, children }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // `end end` puts progress 1 on the exact offset where the pin releases, so
  // the whole move is spent while the stage is still held.
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  });

  const stage = useRef<HTMLDivElement>(null);
  const contentBox = useRef<HTMLDivElement>(null);
  const [{ w, h }, setSize] = useState({ w: 0, h: 0 });

  // Measured off the pinned element rather than off `window`, because on mobile
  // `svh` and `innerHeight` disagree by the height of the browser chrome — and
  // the hero has to start out exactly filling the box it sits in.
  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      const box = entry.contentRect;
      setSize({ w: box.width, h: box.height });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const measured = w > 0 && h > 0;
  const shrink = w < NARROW_WIDTH ? SHRINK_SCALE_NARROW : SHRINK_SCALE;

  /**
   * How far the headline's centre sits from the centre of the hero, unscaled.
   * The badge above it and the paragraph below it are not symmetrical, so
   * without this the headline would settle off-centre by whatever that
   * imbalance came to — it holds its own layout space even once it has faded.
   * Read from layout offsets rather than from a rectangle, because those are
   * immune to the transforms running above.
   */
  const [focus, setFocus] = useState(0);
  useEffect(() => {
    const box = contentBox.current;
    const target = box?.querySelector<HTMLElement>("[data-hero-focus]");
    if (!box || !target || !measured) return;

    let offset = 0;
    let cursor: HTMLElement | null = target;
    while (cursor && cursor !== box) {
      offset += cursor.offsetTop;
      cursor = cursor.offsetParent as HTMLElement | null;
    }
    setFocus(offset + target.offsetHeight / 2 - h / 2);
  }, [measured, w, h]);

  // The hero keeps its full viewport size and is only ever transformed, so no
  // layout reflows as it goes and the type stays on its original grid.
  const heroScale = useTransform(scrollYProgress, [0, FOLD_END], [1, shrink], {
    ease: EASE,
  });
  // Scaling about the box's own centre keeps the box centred on the screen for
  // free, so the only correction this has to make is the headline's offset
  // from that centre — which is exactly what `focus` measures.
  const heroY = useTransform(
    scrollYProgress,
    [0, FOLD_END],
    [-h / 2, -h / 2 - focus * shrink],
    { ease: EASE },
  );

  // Everything around the headline goes early: at the small size it is a
  // smudge, and the headline is the only part worth carrying down.
  const copy = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  if (reduced) {
    return (
      <>
        <div className="relative isolate overflow-hidden">
          {backdrop}
          {hero}
        </div>
        {children}
      </>
    );
  }

  return (
    <>
      <div
        ref={track}
        className="relative"
        style={{ height: `${100 + STAGE_SVH}svh` }}
      >
        <div ref={stage} className="sticky top-0 h-svh overflow-hidden bg-bg">
          {/* The field is the one fixed point the headline shrinks against. */}
          {backdrop}

          <motion.div
            ref={contentBox}
            className={
              measured
                ? "absolute left-1/2 top-1/2 z-10"
                : "absolute inset-0 z-10"
            }
            style={
              measured
                ? ({
                    width: w,
                    height: h,
                    x: -w / 2,
                    y: heroY,
                    scale: heroScale,
                    // Handed to the hero as a custom property rather than as a
                    // prop, so the hero stays a plain section that can still be
                    // rendered on the server and dropped in anywhere else.
                    "--hero-copy": copy,
                  } as MotionStyle)
                : undefined
            }
          >
            {hero}
          </motion.div>
        </div>
      </div>

      {children}
    </>
  );
}
