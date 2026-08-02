/**
 * Arms the intro curtain before the first paint. The overlay markup is
 * server-rendered but hidden by default in CSS, so anyone without JavaScript
 * lands straight on the site; only `data-intro="running"` switches it on.
 *
 * It runs on every document load, so a refresh replays the opening. Client-side
 * navigation between pages does not — the provider stays mounted, and this
 * script only executes when the browser parses a fresh document.
 *
 * Kept as a string because it has to be inlined into the HTML, not bundled.
 */
export const introInitScript = `document.documentElement.dataset.intro="running"`;
