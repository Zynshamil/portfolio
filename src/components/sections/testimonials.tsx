import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { testimonials } from "@/content/site";

export function Testimonials() {
  // Delete the entries in site.ts and this whole section disappears — better
  // no social proof than invented social proof.
  if (testimonials.length === 0) return null;

  return (
    <Section eyebrow="References" index="05">
      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        {testimonials.map((testimonial, index) => (
          <Reveal
            as="article"
            key={testimonial.author + index}
            delay={index * 0.08}
            className="flex flex-col rounded-card border border-line p-7 md:p-9"
          >
            <span className="serif-em text-5xl leading-none text-accent" aria-hidden>
              &ldquo;
            </span>
            <blockquote className="mt-4 flex-1 text-lead text-pretty">
              {testimonial.quote}
            </blockquote>
            <footer className="mt-8 border-t border-line pt-5">
              <p className="tracking-tight">{testimonial.author}</p>
              <p className="mt-1 font-mono text-[11px] text-subtle">
                {testimonial.title}
              </p>
            </footer>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
