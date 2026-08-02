import { Reveal } from "@/components/ui/reveal";
import { CtaButton } from "@/components/ui/button";
import { site } from "@/content/site";

const facts = [
  { label: "Response time", value: "Within 24 hours" },
  { label: "Based in", value: site.location },
  { label: "Engagements", value: "Fixed-price or weekly" },
];

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 border-t border-line py-28 md:py-40">
      <div className="page">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h2 className="mt-8 text-display max-w-[14ch] text-balance">
            Let&apos;s build something{" "}
            <span className="serif-em text-accent">worth shipping</span>.
          </h2>
          <p className="mt-8 max-w-xl text-lead text-muted text-pretty">
            Tell me what you&apos;re building and where it&apos;s stuck. If
            I&apos;m not the right person, I&apos;ll say so and point you at
            someone who is.
          </p>
        </Reveal>

        <Reveal delay={0.12} className="mt-12">
          <a
            href={`mailto:${site.email}`}
            className="group inline-block text-2xl tracking-tight break-all sm:text-4xl md:text-5xl"
          >
            <span className="bg-linear-to-r from-accent to-accent bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-out group-hover:bg-[length:100%_1px]">
              {site.email}
            </span>
          </a>
        </Reveal>

        <Reveal delay={0.2} className="mt-12 flex flex-wrap gap-3">
          <CtaButton href={site.callUrl || `mailto:${site.email}`}>
            {site.callUrl ? "Book a 20-minute call" : "Send me an email"}
          </CtaButton>
          <CtaButton href={site.resumeUrl} variant="ghost">
            Résumé
          </CtaButton>
        </Reveal>

        <Reveal delay={0.28}>
          <dl className="mt-20 grid gap-8 border-t border-line pt-10 sm:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="eyebrow">{fact.label}</dt>
                <dd className="mt-2 tracking-tight">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
