"use client";

import { motion, useReducedMotion } from "motion/react";
import { HeroCanvas } from "@/components/three/hero-canvas";
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
    <section className="relative flex min-h-svh items-center overflow-hidden pt-28 pb-20">
      <HeroCanvas />

      {/* Fades the scene into the page so the section boundary is invisible. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-bg to-transparent"
        aria-hidden
      />

      <div className="page relative z-10">
        {site.available && (
          <motion.div
            {...fade(0.1)}
            className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-bg/50 px-4 py-2 backdrop-blur-sm"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <span className="font-mono text-[11px] tracking-wider text-muted">
              {site.availableText}
            </span>
          </motion.div>
        )}

        {/* One block per line, so the copy breaks where it was written rather
            than wherever the container happens to run out. */}
        <h1 className="text-hero">
          {hero.headlineLines.map((line, index) => (
            <span key={line} className="block">
              <SplitWords
                text={line}
                // The last line is the punchline, so it carries the accent.
                wordClassName={
                  index === hero.headlineLines.length - 1
                    ? "text-accent"
                    : undefined
                }
                delay={0.15 + index * 0.12}
                start={ready}
              />
            </span>
          ))}
        </h1>

        <motion.p
          {...fade(0.75)}
          className="mt-8 max-w-xl text-lead text-muted text-pretty"
        >
          {hero.intro}
        </motion.p>

        <motion.div {...fade(0.88)} className="mt-10 flex flex-wrap gap-3">
          <CtaButton href="/#work">See the work</CtaButton>
          <CtaButton
            href={site.callUrl || `mailto:${site.email}`}
            variant="ghost"
          >
            {site.callUrl ? "Book a call" : "Start a project"}
          </CtaButton>
        </motion.div>

        <motion.dl
          {...fade(1)}
          className="mt-16 flex flex-wrap gap-x-12 gap-y-6 border-t border-line pt-8"
        >
          {hero.stats.map((stat) => (
            <div key={stat.label}>
              <dt className="eyebrow">{stat.label}</dt>
              <dd className="mt-1 text-3xl tracking-tight tabular-nums">
                {stat.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
