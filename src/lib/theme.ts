export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

/** localStorage key. Absent means "follow the system". */
export const THEME_KEY = "portfolio-theme";

/**
 * Runs before the first paint to stamp `data-theme` on <html>, so a visitor who
 * chose light never sees a frame of the dark palette (and vice versa).
 * Kept as a string because it has to be inlined into the HTML, not bundled.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})()`;
