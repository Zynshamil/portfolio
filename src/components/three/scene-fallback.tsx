/**
 * The layer that sits underneath the WebGL canvas. It is what visitors see
 * before the 3D bundle loads, on devices without WebGL, and behind the
 * particles at all times — so the hero never renders as an empty black box.
 */
export function SceneFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute top-1/2 left-1/2 size-[75vmin] -translate-x-1/2 -translate-y-1/2 rounded-pill opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--glow-accent), var(--glow-indigo) 45%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/3 left-1/2 size-[40vmin] -translate-x-1/2 rounded-pill opacity-60 blur-2xl"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--glow-halo), transparent 70%)",
        }}
      />
    </div>
  );
}
