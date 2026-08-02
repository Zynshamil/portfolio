"use client";

import { useTheme } from "./theme-provider";

/**
 * Light/dark switch.
 *
 * Both icons are always rendered and CSS picks the visible one from the
 * `data-theme` attribute on <html>. That keeps the markup identical on the
 * server and the client — no hydration mismatch, and no icon flip after mount.
 */
export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Switch between light and dark theme"
      title="Switch theme"
      className="relative grid h-9 w-9 place-items-center rounded-full border border-line-strong text-fg transition-colors duration-300 hover:border-fg/40 hover:bg-fg/[0.06]"
    >
      {/* Sun — shown in dark mode, where the button takes you to light. */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden
        className="theme-icon theme-icon-sun col-start-1 row-start-1 h-[18px] w-[18px]"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.6v2.2M12 19.2v2.2M4.2 12H2M22 12h-2.2M6.5 6.5 4.9 4.9M19.1 19.1l-1.6-1.6M17.5 6.5l1.6-1.6M4.9 19.1l1.6-1.6" />
      </svg>

      {/* Moon — shown in light mode. */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="theme-icon theme-icon-moon col-start-1 row-start-1 h-[18px] w-[18px]"
      >
        <path d="M20.5 14.3A8.5 8.5 0 1 1 9.7 3.5a6.8 6.8 0 0 0 10.8 10.8Z" />
      </svg>
    </button>
  );
}
