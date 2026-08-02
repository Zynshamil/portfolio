/** sessionStorage key. Present means the intro has already played this tab. */
export const INTRO_KEY = "portfolio-intro";

/**
 * Decides — before the first paint — whether the intro curtain is allowed to
 * show. The overlay markup is server-rendered and hidden by default in CSS, so
 * a returning visitor (and anyone without JavaScript) never sees a frame of it;
 * only `data-intro="running"` switches it on.
 * Kept as a string because it has to be inlined into the HTML, not bundled.
 */
export const introInitScript = `(function(){var d=document.documentElement;try{d.dataset.intro=sessionStorage.getItem("${INTRO_KEY}")?"done":"running"}catch(e){d.dataset.intro="done"}})()`;
