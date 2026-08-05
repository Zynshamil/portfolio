import { CtaButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-svh items-center">
      <div className="page">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-8 text-display max-w-[12ch] text-balance">
          {/* The full stop rides inside the paint — left outside, it reads as a
              stray square sitting off the end of the block. */}
          This page <span className="mark-em">doesn&apos;t exist.</span>
        </h1>
        <p className="mt-8 max-w-md text-lead text-muted">
          The link may be out of date, or the page may have moved.
        </p>
        <div className="mt-10">
          <CtaButton href="/">Back to home</CtaButton>
        </div>
      </div>
    </section>
  );
}
