"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const wordChild: Variants = {
  hidden: { y: "105%" },
  visible: { y: 0, transition: { duration: 0.85, ease: EASE } },
};

/**
 * Headline that rises word by word from behind a clipping mask. Each word gets
 * its own overflow-hidden wrapper so descenders are never sliced, and the
 * inter-word space sits outside the mask so lines still wrap normally.
 */
export function SplitWords({
  text,
  className,
  wordClassName,
  delay = 0,
  start = true,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  /** Held back until the intro curtain has cleared the headline. */
  start?: boolean;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  // Still carries the per-word styling — it is colour and typeface, not motion.
  if (reduced)
    return (
      <span className={className}>
        {wordClassName ? <span className={wordClassName}>{text}</span> : text}
      </span>
    );

  return (
    <motion.span
      className={cn("inline", className)}
      initial="hidden"
      animate={start ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.045, delayChildren: delay },
        },
      }}
      aria-label={text}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`} aria-hidden>
          <span className="inline-block overflow-hidden pb-[0.14em] align-bottom">
            <motion.span
              className={cn("inline-block", wordClassName)}
              variants={wordChild}
            >
              {word}
            </motion.span>
          </span>
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </motion.span>
  );
}
