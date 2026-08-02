import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { faqs } from "@/content/site";

/**
 * Built on <details>/<summary>: keyboard accessible, findable by in-page
 * search, and works with JavaScript disabled. No accordion library needed.
 */
export function Faq() {
  if (faqs.length === 0) return null;

  return (
    <Section
      eyebrow="Before you email"
      index="06"
      title={
        <>
          The questions people ask{" "}
          <span className="serif-em text-muted">first</span>.
        </>
      }
    >
      <div className="max-w-3xl">
        {faqs.map((faq, index) => (
          <Reveal key={faq.q} delay={index * 0.05}>
            <details className="group border-t border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg tracking-tight transition-colors hover:text-accent">
                {faq.q}
                <span
                  className="shrink-0 text-muted transition-transform duration-300 group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="max-w-2xl pb-7 text-muted text-pretty">{faq.a}</p>
            </details>
          </Reveal>
        ))}
        <div className="border-t border-line" aria-hidden />
      </div>
    </Section>
  );
}
