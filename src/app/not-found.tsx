import { CtaButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-svh items-center">
      <div className="page">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-8 text-display max-w-[12ch] text-balance">
          This page <span className="serif-em text-accent">doesn&apos;t exist</span>.
        </h1>
        <p className="mt-8 max-w-md text-lead text-muted">
          The link may be out of date, or the case study may have moved.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <CtaButton href="/">Back to home</CtaButton>
          <CtaButton href="/#work" variant="ghost">
            See the work
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
