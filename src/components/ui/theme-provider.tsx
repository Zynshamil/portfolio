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
import { THEME_KEY, type ResolvedTheme, type Theme } from "@/lib/theme";

type ThemeContextValue = {
  /** What the visitor asked for — "system" until they pick a side. */
  theme: Theme;
  /** What is actually on screen. Null on the server and during hydration. */
  resolvedTheme: ResolvedTheme | null;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** How long the cross-fade class stays on <html> after a switch. */
const SWITCH_MS = 340;

const LIGHT_QUERY = "(prefers-color-scheme: light)";

/* ------------------------------------------------------------------ *
 * The preference lives in localStorage, not in React, so it is read as an
 * external store: the value is already on <html> before React boots, and other
 * tabs can change it underneath us.
 * ------------------------------------------------------------------ */
const listeners = new Set<() => void>();

function readPreference(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

function writePreference(next: Theme) {
  try {
    if (next === "system") window.localStorage.removeItem(THEME_KEY);
    else window.localStorage.setItem(THEME_KEY, next);
  } catch {
    // Private mode or blocked storage — the session still switches.
  }
  listeners.forEach((notify) => notify());
}

function subscribePreference(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  // "storage" only fires for other tabs, which is exactly what we cannot see.
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function subscribeSystem(onStoreChange: () => void) {
  const query = window.matchMedia(LIGHT_QUERY);
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
}

function readSystem(): ResolvedTheme {
  return window.matchMedia(LIGHT_QUERY).matches ? "light" : "dark";
}

const serverPreference = () => "system" as Theme;
const serverSystem = () => null;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribePreference,
    readPreference,
    serverPreference,
  );
  const systemTheme = useSyncExternalStore(
    subscribeSystem,
    readSystem,
    serverSystem,
  );

  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const switchTimer = useRef<number | undefined>(undefined);

  // The inline script in the root layout already stamped this before first
  // paint; keeping it in sync here covers later switches and system changes.
  useEffect(() => {
    if (resolvedTheme) document.documentElement.dataset.theme = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => () => window.clearTimeout(switchTimer.current), []);

  const setTheme = useCallback((next: Theme) => {
    writePreference(next);

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

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  }, [resolvedTheme, setTheme]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside <ThemeProvider>");
  return context;
}
