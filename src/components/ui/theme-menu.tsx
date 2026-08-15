"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { THEMES, themeMeta, type ThemeMode } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useTheme } from "./theme-provider";

/**
 * Palette picker.
 *
 * Opens on hover, because switching palettes is the kind of thing a visitor
 * pokes at rather than commits to — but hover alone would strand keyboards and
 * touchscreens, so the trigger is a real menu button underneath: click toggles,
 * ArrowDown opens onto the first item, Escape closes, and moving focus out of
 * the group closes it too.
 *
 * Choosing does NOT close the menu. The whole page repaints behind the panel,
 * so staying open is what lets you flip through the four and watch them land.
 */

/** Grace period so clipping the corner of the panel doesn't close it. */
const CLOSE_DELAY = 140;

const GROUPS: { mode: ThemeMode; label: string }[] = [
  { mode: "dark", label: "Dark" },
  { mode: "light", label: "Light" },
];

export function ThemeMenu() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  const cancelClose = useCallback(() => {
    window.clearTimeout(closeTimer.current);
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY);
  }, [cancelClose]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  /** The items, read off the DOM so the ordering lives in one place: the markup. */
  const items = useCallback(
    () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLButtonElement>(
          '[role="menuitemradio"]',
        ) ?? [],
      ),
    [],
  );

  const focusItem = useCallback(
    (index: number) => {
      const list = items();
      if (list.length === 0) return;
      // Wrapping, so ArrowUp from the trigger lands on White.
      list[(index + list.length) % list.length]?.focus();
    },
    [items],
  );

  const close = useCallback((returnFocus: boolean) => {
    cancelClose();
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, [cancelClose]);

  // A press anywhere else dismisses it — the panel floats over the page, so it
  // should not survive an interaction that was aimed at something behind it.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  // Touch fires pointerenter on tap, which would race the click handler below;
  // hover intent is a mouse idea, so only a mouse gets it.
  const onPointerEnter = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    cancelClose();
    setOpen(true);
  };

  const onPointerLeave = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    scheduleClose();
  };

  const onTriggerKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      // The panel is inert until `open` lands, so focus has to wait a frame.
      requestAnimationFrame(() => focusItem(event.key === "ArrowDown" ? 0 : -1));
    }
  };

  const onPanelKeyDown = (event: React.KeyboardEvent) => {
    const list = items();
    const index = list.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusItem(index + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusItem(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusItem(0);
        break;
      case "End":
        event.preventDefault();
        focusItem(list.length - 1);
        break;
      case "Tab":
        close(false);
        break;
    }
  };

  // Only close on blur if focus actually left the group — moving between items
  // fires blur too.
  const onBlur = (event: React.FocusEvent) => {
    if (!rootRef.current?.contains(event.relatedTarget as Node | null)) {
      close(false);
    }
  };

  const activeLabel = theme ? themeMeta(theme).label : null;

  return (
    <div
      ref={rootRef}
      className="relative"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onBlur={onBlur}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={
          activeLabel ? `Colour theme: ${activeLabel}` : "Colour theme"
        }
        title="Colour theme"
        onClick={() => (open ? close(false) : setOpen(true))}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          "grid size-9 place-items-center rounded-pill border text-fg transition-colors",
          open
            ? "border-line-hover bg-surface-hover"
            : "border-line-strong hover:border-line-hover hover:bg-surface-hover",
        )}
      >
        {/* No theme class: this one samples whatever is on the page. */}
        <span className="theme-swatch" aria-hidden />
      </button>

      {/* `pt-2` rather than a margin, so the gap under the trigger belongs to
          the hover target and the pointer can cross it without the menu going. */}
      <div
        className={cn(
          "absolute top-full right-0 pt-2 transition duration-(--motion-fast) ease-out",
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
        inert={!open}
      >
        <div
          ref={panelRef}
          role="menu"
          aria-label="Colour theme"
          onKeyDown={onPanelKeyDown}
          className="panel min-w-44"
        >
          {GROUPS.map(({ mode, label }) => (
            <div key={mode} role="group" aria-label={label}>
              <p className="eyebrow px-2.5 pt-2 pb-1.5" aria-hidden>
                {label}
              </p>
              {THEMES.filter((meta) => meta.mode === mode).map((meta) => {
                const active = theme === meta.id;
                return (
                  <button
                    key={meta.id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => setTheme(meta.id)}
                    className={cn(
                      "panel-item transition-colors",
                      active
                        ? "bg-surface-active text-fg"
                        : "text-muted hover:bg-surface-hover hover:text-fg",
                    )}
                  >
                    <span
                      className={cn("theme-swatch", `theme-${meta.id}`)}
                      aria-hidden
                    />
                    <span className="label">{meta.label}</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                      className={cn(
                        "ml-auto size-3.5 text-accent transition-opacity",
                        active ? "opacity-100" : "opacity-0",
                      )}
                    >
                      <path d="m5 12.5 4.5 4.5L19 7" />
                    </svg>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
