"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { PulseDot } from "./pulse-dot";
import { ThemeMenu } from "./theme-menu";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-(--motion-slow)",
        scrolled
          ? "border-b border-line bg-bg/70 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav className="page flex h-16 items-center justify-between md:h-20">
        {/* The intro curtain measures this element and flies its own copy of the
            wordmark onto it, so the two must stay typographically identical —
            hence the shared `wordmark` utility rather than loose classes, and
            the matching `font-secondary` at both ends. */}
        <Link
          href="/"
          data-brand
          className="font-secondary wordmark text-sm text-fg"
        >
          {site.brand}
          <span className="text-accent">.</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          {site.available && (
            <a
              href={`mailto:${site.email}`}
              className="rule-tag hidden transition-colors hover:bg-surface-hover sm:inline-flex"
            >
              <PulseDot />
              <span className="label text-muted">Let&apos;s talk</span>
            </a>
          )}

          <ThemeMenu />
        </div>
      </nav>
    </header>
  );
}
