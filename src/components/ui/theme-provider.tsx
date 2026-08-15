"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { normalizeTheme, THEME_KEY, type Theme } from "@/lib/theme";

type ThemeContextValue = {
  /**
   * The palette on screen. Blue unless the visitor picked another from the nav
   * menu — the system preference is never consulted. Null on the server and
   * during hydration.
   */
  theme: Theme | null;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** How long the cross-fade class stays on <html> after a switch. */
const SWITCH_MS = 340;

/* ------------------------------------------------------------------ *
 * The preference lives in localStorage, not in React, so it is read as an
 * external store: the value is already on <html> before React boots, and other
 * tabs can change it underneath us.
 * ------------------------------------------------------------------ */
const listeners = new Set<() => void>();

function readTheme(): Theme {
  try {
    return normalizeTheme(window.localStorage.getItem(THEME_KEY));
  } catch {
    return normalizeTheme(null);
  }
}

function writeTheme(next: Theme) {
  try {
    window.localStorage.setItem(THEME_KEY, next);
  } catch {
    // Private mode or blocked storage — the session still switches.
  }
  listeners.forEach((notify) => notify());
}

function subscribeTheme(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  // "storage" only fires for other tabs, which is exactly what we cannot see.
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

// Null rather than the default, so nothing paints in a palette the stored
// preference is about to overturn on the first client render.
const serverTheme = () => null;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore<Theme | null>(
    subscribeTheme,
    readTheme,
    serverTheme,
  );

  const switchTimer = useRef<number | undefined>(undefined);

  // The inline script in the root layout already stamped this before first
  // paint; keeping it in sync here covers later switches and other tabs.
  useEffect(() => {
    if (theme) document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => () => window.clearTimeout(switchTimer.current), []);

  const setTheme = useCallback((next: Theme) => {
    writeTheme(next);

    // Colours snap by default. Opting into transitions only for the duration of
    // a deliberate switch keeps scrolling cheap but makes the flip feel intentional.
    const root = document.documentElement;
    root.classList.add("theme-switching");
    window.clearTimeout(switchTimer.current);
    switchTimer.current = window.setTimeout(
      () => root.classList.remove("theme-switching"),
      SWITCH_MS,
    );
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside <ThemeProvider>");
  return context;
}
