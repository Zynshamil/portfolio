"use client";

import { motion, useReducedMotion } from "motion/react";
import { CtaButton } from "@/components/ui/button";
import { SplitWords } from "@/components/ui/reveal";
import { useIntroDone } from "@/components/ui/intro";
import { hero, site } from "@/content/site";

const EASE = [0.16, 1, 0.3, 1] as const;

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

  return (
    <section className="relative flex min-h-svh items-center overflow-hidden border-b-4 border-accent px-0 py-24 md:py-28">
      <div className="poster-field pointer-events-none absolute inset-0" aria-hidden />

      <div className="page relative z-10 flex flex-col items-center text-center">
        {site.available && (
          <motion.div
            {...fade(0.1)}
            className="mb-8 inline-flex items-center gap-2.5 border-y border-line-strong bg-bg/25 px-3 py-2"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <span className="label text-muted">
              {site.availableText}
            </span>
          </motion.div>
        )}

        {/* One block per line, so the copy breaks where it was written rather
            than wherever the container happens to run out. */}
        <h1 className="text-hero text-hero-centred text-accent poster-shadow">
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

        <motion.p
          {...fade(0.75)}
          className="mt-7 max-w-2xl text-lead text-muted text-pretty"
        >
          {hero.intro}
        </motion.p>

        <motion.div {...fade(0.88)} className="mt-9 flex flex-wrap justify-center gap-3">
          <CtaButton href={site.callUrl || `mailto:${site.email}`}>
            {site.callUrl ? "Book a call" : "Start a project"}
          </CtaButton>
        </motion.div>

      </div>
    </section>
  );
}
