"use client";

import { motion, useReducedMotion } from "motion/react";
import { HeroCanvas } from "@/components/three/hero-canvas";
import { CtaButton } from "@/components/ui/button";
import { PulseDot } from "@/components/ui/pulse-dot";
import { SplitWords } from "@/components/ui/reveal";
import { useIntroDone } from "@/components/ui/intro";
import { hero, site } from "@/content/site";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The hero's texture — the particle field and the poster gradients over it.
 *
 * Deliberately separate from the copy: the pinned stage shrinks the copy away
 * but leaves this running full-screen and untouched behind it, so there is only
 * ever one field on the page and it never moves. Needs a positioned ancestor to
 * fill; both the stage and any standalone use provide one.
 */
export function HeroBackdrop() {
  return (
    <>
      <div className="poster-field pointer-events-none absolute inset-0" aria-hidden />
      <HeroCanvas />
      {/* Settles the field into the flat page colour at the bottom edge, so
          whatever scrolls up next meets the same colour and there is no seam
          where the canvas stops. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-bg to-transparent"
        aria-hidden
      />
    </>
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  // The intro curtain covers this section, so the entrance waits for it —
  // otherwise the whole hero would have played out behind a white sheet.
  const ready = useIntroDone();
  // Staggered entrance for everything the headline does not cover.
  const fade = (delay: number) => ({
    initial: reduced ? undefined : { opacity: 0, y: 18 },
    animate: reduced || ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  // The stage drives this as it shrinks: everything around the headline goes,
  // because at that size it is a smudge. Unset everywhere else, so the
  // fallback leaves the hero exactly as it was.
  //
  // It sits on wrappers rather than on the animated elements themselves — the
  // entrance below animates `opacity`, and an animated value takes ownership of
  // the property, so a variable written to the same element would be erased the
  // moment the entrance ran.
  const supporting = { opacity: "var(--hero-copy, 1)" };

  return (
    // The whole section is the poster voice, not just the headline — the
    // availability tag, the standfirst and the CTA are the fine print around it
    // and belong to the same piece of print. Set once here and inherited, which
    // is also what `text-hero` and its `ch` measure are cut to.
    <section className="font-secondary relative flex min-h-svh items-center overflow-hidden px-0 py-24 md:py-28">
      <div className="page relative z-10 flex flex-col items-center text-center">
        {site.available && (
          <div style={supporting} className="mb-8">
            <motion.div {...fade(0.1)} className="rule-tag inline-flex bg-bg/25">
              <PulseDot />
              <span className="label text-muted">{site.availableText}</span>
            </motion.div>
          </div>
        )}

        {/* One block per line, so the copy breaks where it was written rather
            than wherever the container happens to run out.

            `data-hero-focus` marks what the stage centres as it shrinks: it
            measures this element's offset and cancels it out, so the headline
            lands dead centre no matter what is stacked above or below it. */}
        <h1
          data-hero-focus
          className="text-hero text-hero-centred text-accent poster-shadow"
        >
          {hero.headlineLines.map((line, index) => (
            <span key={line} className="block">
              <SplitWords
                text={line}
                wordClassName="text-accent"
                delay={0.15 + index * 0.12}
                start={ready}
              />
            </span>
          ))}
        </h1>

        <div style={supporting} className="flex flex-col items-center">
          <motion.p
            {...fade(0.75)}
            className="mt-7 max-w-2xl text-lead text-muted text-pretty"
          >
            {hero.intro}
          </motion.p>

          <motion.div
            {...fade(0.88)}
            className="mt-9 flex flex-wrap justify-center gap-3"
          >
            <CtaButton href={site.callUrl || `mailto:${site.email}`}>
              {site.callUrl ? "Book a call" : "Start a project"}
            </CtaButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
