"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

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
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-line bg-bg/70 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav className="page flex h-16 items-center justify-between md:h-20">
        {/* The intro curtain measures this element and flies its own copy of the
            wordmark onto it, so the two must stay typographically identical —
            hence the shared `wordmark` utility rather than loose classes. */}
        <Link href="/" data-brand className="wordmark text-sm text-fg">
          {site.brand}
          <span className="text-accent">.</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          {site.available && (
            <a href={`mailto:${site.email}`} className="hidden items-center gap-2 border-y border-line-strong px-3 py-1.5 transition-colors hover:bg-fg/10 sm:inline-flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span className="label text-muted">
                Let&apos;s talk
              </span>
            </a>
          )}

          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
