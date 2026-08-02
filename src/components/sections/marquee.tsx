import { marquee } from "@/content/site";

/**
 * Infinite capability ticker. The list is rendered twice and the track
 * translates exactly -50%, so the loop point is seamless.
 */
export function Marquee() {
  const items = [...marquee, ...marquee];

  return (
    <div className="relative overflow-hidden border-y border-line py-5">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-bg to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-bg to-transparent"
        aria-hidden
      />
      <div className="flex w-max animate-marquee items-center gap-10 will-change-transform">
        {items.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-10">
            <span className="font-mono text-sm tracking-tight whitespace-nowrap text-muted">
              {item}
            </span>
            <span className="h-1 w-1 rounded-full bg-accent/50" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}
