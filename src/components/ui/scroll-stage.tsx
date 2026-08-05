"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  cubicBezier,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "motion/react";

import { site, stage as content } from "@/content/site";

/**
 * Scroll spent on the stage, on top of the screen the hero already occupies.
 * This is the one knob for pacing: raise it and every phase below stretches out
 * proportionally, because they are all expressed as fractions of it.
 */
const STAGE_SVH = 170;

/** Progress at which the hero has finished folding into the card. */
const FOLD_END = 0.52;

/** Where the card's centre sits, as a fraction of the viewport height. Dead
 *  centre: the marquee runs straight through it and the wordmark is written
 *  across it, so the whole composition shares one axis. */
const CARD_CENTRE = 0.5;

/** The card is a share of the viewport width, floored so it stays a picture
 *  rather than a stamp on a phone, and capped so it stays a card on a wide
 *  monitor. The last term keeps it inside the screen on very narrow ones. */
const CARD_WIDTH_SHARE = 0.46;
const CARD_MIN_WIDTH = 260;
const CARD_MAX_WIDTH = 640;
const CARD_WIDTH_LIMIT = 0.82;

/** Landscape, like a plate on a page. Height gives way first on short screens,
 *  and the width follows it down so the proportion never changes. */
const CARD_ASPECT = 0.64;
const CARD_HEIGHT_LIMIT = 0.46;

/** Slow out of the full screen, long settle into the card. */
const EASE = cubicBezier(0.5, 0, 0.12, 1);

/* ---- The wordmark's flight ----------------------------------------- *
 * Three consecutive windows of the same scroll: the name writes itself
 * across the card, is carried to the header, and swaps with the nav logo
 * once the two are superimposed. They are spelled out here rather than
 * inline because the nav logo's fade has to be the exact negative of them
 * — two wordmarks visible at once gives the whole trick away.
 * -------------------------------------------------------------------- */
const NAME_IN: number[] = [0.5, 0.68];
const NAME_TRAVEL: number[] = [0.74, 0.96];
const NAME_SWAP: number[] = [0.94, 0.99];

/** Slow-in, slow-out — the name feels carried to the corner, not thrown. */
const TRAVEL_EASE = cubicBezier(0.76, 0, 0.24, 1);
/** The rise, matched to the opening curtain's letters. */
const RISE_EASE = cubicBezier(0.16, 1, 0.3, 1);

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

/**
 * False through the server render and the hydrating one, true after — which is
 * the gate a portal needs, since `document.body` does not exist for either.
 * Written as a store subscription rather than as an effect that sets state, so
 * it costs one render rather than a render and a cascade.
 */
const neverChanges = () => () => {};
const useHydrated = () =>
  useSyncExternalStore(
    neverChanges,
    () => true,
    () => false,
  );

type Props = {
  /** The field and poster texture. Held full-screen for the whole stage. */
  backdrop: ReactNode;
  /** The hero's copy, which is what actually folds into the card. */
  hero: ReactNode;
  /** Everything the page continues with once the stage releases. */
  children: ReactNode;
};

/**
 * The hero does not scroll away — it is pinned, and its copy folds down into a
 * card at the centre of the screen while the composition assembles around it:
 * the wordmark written across the card, and a marquee running behind it. The
 * wordmark then leaves the same way it arrived in the first place — carried up
 * to the corner, where it becomes the nav logo.
 *
 * The one thing that never moves is the field. It is mounted here, behind
 * everything, and is untouched by the fold — so there is a single animation on
 * screen at all times, the card sits *on* it rather than carrying its own copy
 * of it, and the picture behind the card is continuous with the picture around
 * it. That continuity is the whole trick; the moment the field belongs to the
 * shrinking element instead of the stage, the seam gives the effect away.
 *
 * Every value is read straight off scroll position rather than played on a
 * timer, so it tracks the wheel exactly and unwinds cleanly on the way back up.
 */
export function ScrollStage({ backdrop, hero, children }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // `end end` puts progress 1 on the exact offset where the pin releases, so
  // the whole composition is spent while the stage is still held.
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  });

  const stage = useRef<HTMLDivElement>(null);
  const contentBox = useRef<HTMLDivElement>(null);
  const [{ w, h }, setSize] = useState({ w: 0, h: 0 });

  // Measured off the pinned element rather than off `window`, because on mobile
  // `svh` and `innerHeight` disagree by the height of the browser chrome — and
  // the card has to land exactly on the box it is folding inside.
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

  const cardHeight = Math.min(
    Math.min(
      Math.max(w * CARD_WIDTH_SHARE, CARD_MIN_WIDTH),
      CARD_MAX_WIDTH,
      w * CARD_WIDTH_LIMIT,
    ) * CARD_ASPECT,
    h * CARD_HEIGHT_LIMIT,
  );
  const cardWidth = cardHeight / CARD_ASPECT;
  const cardY = CARD_CENTRE * h;

  /**
   * How far the headline's centre sits from the centre of the hero, unscaled.
   * The badge above it and the paragraph below it are not symmetrical, so
   * without this the headline would settle off-centre in the card by whatever
   * that imbalance came to. Read from layout offsets rather than from a
   * rectangle, because those are immune to the transforms running above.
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

  // The card's box: a frame that crops. Only its own size animates, and its
  // children are absolutely positioned, so no layout escapes it.
  const frameWidth = useTransform(scrollYProgress, [0, FOLD_END], [w, cardWidth], {
    ease: EASE,
  });
  const frameHeight = useTransform(
    scrollYProgress,
    [0, FOLD_END],
    [h, cardHeight],
    { ease: EASE },
  );
  const frameX = useTransform(frameWidth, (value) => -value / 2);
  const frameY = useTransform(
    scrollYProgress,
    [0, FOLD_END],
    [-h / 2, cardY - h / 2 - cardHeight / 2],
    { ease: EASE },
  );

  // The hero inside keeps its full viewport size and is only ever transformed.
  // Its scale matches the frame's exactly, so the headline holds its share of
  // the card throughout and is never cropped; everything stacked around it is
  // cropped away, which is what turns the hero into a plate of its own title.
  const heroScale = useTransform(
    scrollYProgress,
    [0, FOLD_END],
    [1, measured ? cardWidth / w : 1],
    { ease: EASE },
  );
  const heroY = useTransform(
    scrollYProgress,
    [0, FOLD_END],
    [-h / 2, cardY - focus * (cardWidth / Math.max(w, 1)) - h / 2],
    { ease: EASE },
  );

  const copy = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  // Drawn on the card rather than on the hero, so the rule stays two crisp
  // pixels wide instead of shrinking away with everything else.
  const frameOpacity = useTransform(scrollYProgress, [0.24, 0.5], [0, 1]);
  // A wash the same shade for both themes, so the card reads as a lighter pane
  // laid over the field — the same picture underneath, one stop brighter.
  const paneOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);

  // Clears out as the name lifts off, so the caption is not left sitting in
  // the flight path with the thing it captions gone.
  const wordmarkOpacity = useTransform(
    scrollYProgress,
    [0.44, 0.6, NAME_TRAVEL[0], NAME_TRAVEL[0] + 0.06],
    [0, 1, 1, 0],
  );
  const wordmarkY = useTransform(scrollYProgress, [0.44, 0.6], [16, 0]);

  const marqueeOpacity = useTransform(scrollYProgress, [0.4, 0.58], [0, 1]);
  const marqueeY = useTransform(scrollYProgress, [0.4, 0.58], [30, 0]);

  // The negative of the flying copy: the nav logo steps aside just before the
  // big one is written, and steps back in underneath it once it has landed.
  const brandFade = useTransform(
    scrollYProgress,
    [NAME_IN[0] - 0.08, NAME_IN[0], NAME_SWAP[0], NAME_SWAP[1]],
    [1, 0, 0, 1],
  );
  useMotionValueEvent(brandFade, "change", (value) => {
    if (reduced) return;
    document.documentElement.style.setProperty("--brand-visible", `${value}`);
  });
  useEffect(
    () => () => {
      document.documentElement.style.removeProperty("--brand-visible");
    },
    [],
  );

  // A last, small lift before the pin lets go, so the handoff to the next
  // section starts as a drift rather than as the page suddenly moving again.
  const exit = useTransform(scrollYProgress, [0.86, 1], [0, -h * 0.06]);

  if (reduced) {
    return (
      <>
        <div className="relative isolate overflow-hidden">
          {backdrop}
          {hero}
        </div>
        <section className="relative isolate overflow-hidden py-16">
          <div className="flex justify-center px-6">
            <Wordmark />
          </div>
          <div className="mt-10">
            <Marquee />
          </div>
        </section>
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
          {/* Outside the drifting wrapper below and outside the card: the field
              is the one fixed point the rest of the stage moves against. */}
          {backdrop}

          <motion.div className="absolute inset-0" style={{ y: exit }}>
            {/* Behind the card, crossing it — the card occludes the middle of
                every line, which is what makes the two read as one plane. */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
              <motion.div style={{ opacity: marqueeOpacity, y: marqueeY }}>
                <Marquee />
              </motion.div>
            </div>

            {/* The card. Full screen at rest, so the hero is untouched until
                the first scroll. */}
            <motion.div
              className={
                measured
                  ? "absolute left-1/2 top-1/2 z-10 overflow-hidden"
                  : "absolute inset-0 z-10 overflow-hidden"
              }
              style={
                measured
                  ? {
                      width: frameWidth,
                      height: frameHeight,
                      x: frameX,
                      y: frameY,
                    }
                  : undefined
              }
            >
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-fg/7"
                style={{ opacity: paneOpacity }}
              />

              <motion.div
                ref={contentBox}
                className={
                  measured ? "absolute left-1/2 top-1/2" : "absolute inset-0"
                }
                style={
                  measured
                    ? ({
                        width: w,
                        height: h,
                        x: -w / 2,
                        y: heroY,
                        scale: heroScale,
                        // Handed to the hero as a custom property rather than
                        // as a prop, so the hero stays a plain section that can
                        // still be rendered on the server and dropped in
                        // anywhere else.
                        "--hero-copy": copy,
                      } as MotionStyle)
                    : undefined
                }
              >
                {hero}
              </motion.div>

              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 border-2 border-accent"
                style={{ opacity: frameOpacity }}
              />
            </motion.div>

            <motion.div
              // Clear of the fixed header above and of the card below.
              className="absolute inset-x-0 top-[14svh] z-20 flex justify-center px-6"
              style={{ opacity: wordmarkOpacity, y: wordmarkY }}
            >
              <Wordmark />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Written across the card, overhanging it on both sides — then carried
          into the header. Deliberately not a child of the stage: see below. */}
      <FlyingName progress={scrollYProgress} />

      {children}
    </>
  );
}

/** The real name, set small above the card — the caption to the wordmark. */
function Wordmark() {
  return (
    <span className="wordmark text-[clamp(0.95rem,1.6vw,1.25rem)] tracking-[0.34em] text-fg/70">
      {content.signature}
    </span>
  );
}

/**
 * The name itself, written letter by letter across the card and then carried up
 * to the nav logo — the opening curtain's move, replayed on scroll instead of
 * on a clock, so it tracks the wheel and unwrites itself on the way back up.
 *
 * Portalled to the body and positioned against the viewport rather than drawn
 * inside the stage. `position: sticky` makes the stage a stacking context of
 * its own, so anything inside it paints under the fixed header no matter what
 * z-index it carries — and the header is precisely where this is going.
 */
function FlyingName({ progress }: { progress: MotionValue<number> }) {
  const layer = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLSpanElement>(null);
  const mounted = useHydrated();
  const [flip, setFlip] = useState({ x: 0, y: 0, scale: 1 });

  // FLIP, measured once per layout rather than per frame: where this copy rests
  // and where the nav logo already sits. Because the two share a typeface and
  // tracking, matching their widths matches every glyph.
  useEffect(() => {
    if (!mounted) return;
    let live = true;

    const measure = () => {
      const box = layer.current;
      const el = name.current;
      const target = document.querySelector<HTMLElement>("[data-brand]");
      if (!live || !box || !el || !target) return;

      const from = box.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      // Layout offsets, not a rectangle: the span is under a transform for most
      // of the scroll, and these are the only numbers immune to it.
      if (!el.offsetWidth || !to.width) return;

      setFlip({
        x: to.left - (from.left + el.offsetLeft),
        y: to.top - (from.top + el.offsetTop),
        scale: to.width / el.offsetWidth,
      });
    };

    measure();
    // The wordmark's width is the whole of the arithmetic above, and a fallback
    // face measures nothing like the real one.
    void document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);

    return () => {
      live = false;
      window.removeEventListener("resize", measure);
    };
  }, [mounted]);

  const travel = useTransform(progress, NAME_TRAVEL, [0, 1], {
    ease: TRAVEL_EASE,
  });
  const x = useTransform(travel, (value) => value * flip.x);
  const y = useTransform(travel, (value) => value * flip.y);
  const scale = useTransform(travel, (value) => 1 + (flip.scale - 1) * value);
  // The last stretch of the travel is spent superimposed on the nav logo, which
  // is fading up underneath — so this leaves without anything appearing to.
  const opacity = useTransform(progress, NAME_SWAP, [1, 0]);

  if (!mounted) return null;

  // The nav logo ends in an accent full stop, so this copy carries one too.
  const letters = [...site.brand, "."];
  // Each glyph gets half the window to itself; the other half is the stagger,
  // spread across all of them.
  const duration = (NAME_IN[1] - NAME_IN[0]) / 2;
  const step = duration / Math.max(letters.length - 1, 1);

  return createPortal(
    <div
      ref={layer}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-60 grid place-items-center overflow-hidden"
    >
      <motion.span
        ref={name}
        // Transforms measure from the corner the name is flying to, which is
        // what makes the FLIP arithmetic above a straight subtraction. Set in
        // the nav logo's own colours from the first frame, so the two are
        // indistinguishable at the moment they swap.
        className="wordmark inline-block origin-top-left whitespace-nowrap text-fg will-change-transform"
        style={{ fontSize: "clamp(2.25rem, 11vw, 7rem)", x, y, scale, opacity }}
      >
        {letters.map((letter, index) => (
          <RisingGlyph
            key={`${letter}-${index}`}
            progress={progress}
            start={NAME_IN[0] + index * step}
            end={NAME_IN[0] + index * step + duration}
            dot={letter === "."}
          >
            {/* Hard space: an ordinary one is the only thing inside its own
                mask, so it collapses — closing the gap in the name and
                throwing off the width the scale above is measured against. */}
            {letter === " " ? " " : letter}
          </RisingGlyph>
        ))}
      </motion.span>
    </div>,
    document.body,
  );
}

/** One glyph rising into its clipping mask across a slice of the scroll. */
function RisingGlyph({
  progress,
  start,
  end,
  dot,
  children,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  dot?: boolean;
  children: ReactNode;
}) {
  const y = useTransform(progress, [start, end], ["105%", "0%"], {
    ease: RISE_EASE,
  });

  return (
    // The wordmark is all caps, so there are no descenders to clear — just
    // enough slack that the mask's edge never shaves the baseline.
    <span className="inline-block overflow-hidden pb-[0.04em] align-bottom">
      <motion.span
        className={dot ? "inline-block text-accent" : "inline-block"}
        style={{ y }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Two lines of type running in opposite directions behind the card. Opposing
 * them is what stops the pair reading as one thick block sliding past.
 */
function Marquee() {
  return (
    <div
      aria-hidden
      className="pointer-events-none flex flex-col gap-1 overflow-hidden"
    >
      <div className="marquee-track">
        <MarqueeHalves className="text-accent/85" />
      </div>
      <div className="marquee-track-reverse">
        <MarqueeHalves className="text-fg/25" />
      </div>
    </div>
  );
}

function MarqueeHalves({ className }: { className: string }) {
  return (
    <>
      {/* Two identical halves — see the `marquee-x` keyframes for why. Each has
          to outrun the widest plausible screen on its own, or the loop shows
          daylight at the seam. */}
      {[0, 1].map((half) => (
        <span key={half} className="flex shrink-0">
          {Array.from({ length: 4 }, (_, i) => (
            <span
              key={i}
              className={`whitespace-nowrap px-6 text-[clamp(2rem,6.5vw,5.5rem)] font-black uppercase leading-[1.05] tracking-[-0.035em] ${className}`}
            >
              {content.marquee}
              <span className="px-6 opacity-50">✳</span>
            </span>
          ))}
        </span>
      ))}
    </>
  );
}
