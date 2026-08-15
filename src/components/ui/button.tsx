"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

const MotionLink = motion.create(Link);

// The 800 is drawn for the hero, where the surrounding section sets the
// secondary family and the weight is a real face. The 404 uses the same button
// under the primary family, which stops at 700 and renders it as Bold — same
// pixels either way, so the button keeps one declaration rather than two.
const styles =
  "group relative inline-flex items-center justify-center gap-2 rounded-sm bg-accent px-7 py-3.5 text-sm font-extrabold tracking-[0.08em] text-accent-ink uppercase shadow-[4px_4px_0_var(--offset)] transition-[background-color,box-shadow] duration-300 will-change-transform hover:bg-fg hover:shadow-[2px_2px_0_var(--offset)]";

/**
 * CTA that leans toward the cursor. The pull is small on purpose — enough to
 * feel responsive, not enough to make the button hard to actually click. Skipped
 * entirely for reduced-motion visitors and coarse pointers.
 */
export function CtaButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (reduced || event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.25);
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.25);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const isExternal = href.startsWith("http") || href.startsWith("mailto:");

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="relative z-10 translate-x-0 transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </>
  );

  const motionProps = {
    ref,
    className: styles,
    style: { x: springX, y: springY },
    onPointerMove: onMove,
    onPointerLeave: reset,
  };

  if (isExternal) {
    return (
      <motion.a
        {...motionProps}
        href={href}
        target={href.startsWith("mailto:") ? undefined : "_blank"}
        rel="noreferrer noopener"
      >
        {content}
      </motion.a>
    );
  }

  return (
    <MotionLink {...motionProps} href={href}>
      {content}
    </MotionLink>
  );
}
