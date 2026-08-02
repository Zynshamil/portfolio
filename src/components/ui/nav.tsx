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
            same family, size, tracking and the leading-none tight box. */}
        <Link
          href="/"
          data-brand
          className="font-mono text-sm leading-none tracking-tight text-fg"
        >
          {site.brand}
          <span className="text-accent">.</span>
        </Link>

        <div className="flex items-center gap-4">
          {site.available && (
            <span className="hidden items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 sm:inline-flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span className="font-mono text-[11px] tracking-wider text-muted uppercase">
                Available
              </span>
            </span>
          )}

          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
