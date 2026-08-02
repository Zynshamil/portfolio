"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

type Variant = "primary" | "ghost";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-colors duration-300 will-change-transform";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-ink hover:bg-fg",
  ghost:
    "border border-line-strong text-fg hover:border-fg/40 hover:bg-fg/[0.05]",
};

/**
 * CTA that leans toward the cursor. The pull is small on purpose — enough to
 * feel responsive, not enough to make the button hard to actually click. Skipped
 * entirely for reduced-motion visitors and coarse pointers.
 */
export function CtaButton({
  href,
  children,
  variant = "primary",
  className,
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
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

  const isExternal = external ?? (href.startsWith("http") || href.startsWith("mailto:"));

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
    className: cn(base, variants[variant], className),
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

/** Text link with an underline that wipes in from the left on hover. */
export function UnderlineLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");
  const classes = cn(
    "group relative inline-block text-fg transition-colors hover:text-accent",
    className,
  );
  const inner = (
    <>
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100" />
    </>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={classes}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}
