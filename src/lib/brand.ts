/**
 * The sign-paint colours.
 *
 * Deliberately not part of any palette: the intro curtain, the browser chrome
 * and the share card are the site introducing itself, and they look the same
 * whichever of the four palettes the visitor goes on to choose.
 *
 * ⚠️ Mirrored as `--brand-blue` / `--brand-gold` / `--brand-orange` in §1 of
 * `globals.css`, which is where anything styled with a class should reach for
 * them (`bg-brand-blue`, `text-brand-gold`, …). This file is only for the
 * places that need a literal in JavaScript and cannot read a custom property:
 * the `viewport` export, and the OG image, which is rasterised at build time
 * with no stylesheet in scope. Change one, change the other.
 */
export const BRAND = {
  /** The page's cobalt. Also the blue palette's `--bg`. */
  blue: "#153d8a",
  /** The colour the important words are painted in. */
  gold: "#ffd447",
  /** Print registration accent — the offset block under the CTA. */
  orange: "#ed5d32",
} as const;

/**
 * Ink for the share card, which is drawn on the cobalt above rather than on a
 * palette. Kept beside the brand colours because it only ever appears there.
 */
export const BRAND_INK = {
  /** Headline on cobalt — the blue palette's `--fg`. */
  paper: "#fff6d5",
  /** Supporting lines on cobalt — the blue palette's `--fg-muted`. */
  muted: "#d9e4ff",
  /** Fine print on cobalt — the blue palette's `--fg-subtle`. */
  subtle: "#afc5ed",
  /** Hairline rules on cobalt — the blue palette's `--line`. */
  rule: "rgba(255, 230, 121, 0.3)",
} as const;
