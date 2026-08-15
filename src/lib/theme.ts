/** Which way a palette runs. The WebGL scenes and `color-scheme` need it. */
export type ThemeMode = "light" | "dark";

/**
 * The four palettes. The id is what lands in `data-theme` and in localStorage,
 * and — as `.theme-<id>` — what a swatch in the menu wears.
 *
 * ─── Adding a palette is three edits ────────────────────────────────
 *   1. `src/app/globals.css` §2 — a block setting the same token list as the
 *      others. Nothing outside that section is allowed to name a colour, so
 *      this is all the CSS a palette needs.
 *   2. this union, and an entry in `THEMES` below.
 *   3. `src/components/three/palettes.ts` — the WebGL scenes cannot read CSS
 *      custom properties, so they keep their own colour per palette.
 *
 * Steps 2 and 3 are enforced: those records are typed `Record<Theme, …>`, so
 * widening this union without them fails the build rather than shipping a
 * scene painted in the wrong palette.
 * ───────────────────────────────────────────────────────────────────
 */
export type Theme = "blue" | "midnight" | "paper" | "white";

export type ThemeMeta = {
  id: Theme;
  /** What the menu calls it. */
  label: string;
  mode: ThemeMode;
};

/**
 * Menu order, and the order arrow keys walk: the two darks, then the two
 * lights. Blue and paper are the house palette — the site's own point of view.
 * Midnight and white are the plain dark and plain light for anyone who wants
 * the work on a quieter ground; they keep the same blue-and-gold type colours,
 * so they read as this site with the volume down rather than a different one.
 */
export const THEMES: readonly ThemeMeta[] = [
  { id: "blue", label: "Sign blue", mode: "dark" },
  { id: "midnight", label: "Midnight", mode: "dark" },
  { id: "paper", label: "Paper", mode: "light" },
  { id: "white", label: "White", mode: "light" },
];

/** localStorage key. Absent means the blue theme. */
export const THEME_KEY = "portfolio-theme";

/**
 * The palette on `:root`. What every first-time visitor sees — the system
 * preference is deliberately not consulted, here or anywhere else: the page
 * leads with its own colour, and the other three are a choice.
 */
export const DEFAULT_THEME: Theme = "blue";

/**
 * Back when there were two palettes the stored value was the mode itself.
 * Returning visitors still carry those strings, so they map onto the heirs of
 * the palettes they picked rather than being silently reset.
 */
const LEGACY: Record<string, Theme> = { dark: "blue", light: "paper" };

const IDS = THEMES.map((theme) => theme.id);

export function normalizeTheme(value: string | null | undefined): Theme {
  const id = (value && LEGACY[value]) || value;
  return IDS.includes(id as Theme) ? (id as Theme) : DEFAULT_THEME;
}

export function themeMeta(id: Theme): ThemeMeta {
  return THEMES.find((theme) => theme.id === id) ?? THEMES[0];
}

/**
 * Runs before the first paint to stamp `data-theme` on <html>, so a visitor who
 * chose a palette never sees a frame of the default one.
 * Kept as a string because it has to be inlined into the HTML, not bundled —
 * hence the hand-inlined copy of `normalizeTheme` above.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");t=${JSON.stringify(LEGACY)}[t]||t;if(${JSON.stringify(IDS)}.indexOf(t)<0)t="${DEFAULT_THEME}";document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="${DEFAULT_THEME}"}})()`;
