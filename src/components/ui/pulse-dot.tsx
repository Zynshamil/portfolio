/**
 * The live dot that says someone is actually at the other end of this.
 *
 * Two stacked circles: one static, one expanding and fading behind it. It sits
 * in the nav badge and in the one over the hero, which is the whole reason it
 * is a component — the two are meant to be the same object seen twice, and a
 * second hand-written copy of this markup is how they stop being.
 *
 * Decorative: the sentence beside it already carries the meaning, so the ping
 * is hidden from assistive technology rather than announced as a bullet.
 */
export function PulseDot() {
  return (
    <span aria-hidden className="relative flex size-1.5">
      <span className="absolute inline-flex size-full animate-ping rounded-pill bg-accent opacity-70" />
      <span className="relative inline-flex size-1.5 rounded-pill bg-accent" />
    </span>
  );
}
