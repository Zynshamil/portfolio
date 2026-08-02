import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { process } from "@/content/site";

export function Process() {
  return (
    <Section
      eyebrow="How it works"
      index="03"
      title={
        <>
          Hiring a stranger is a{" "}
          <span className="serif-em text-accent">risk</span>. Here&apos;s how I
          lower it.
        </>
      }
    >
      <ol className="grid gap-10 md:grid-cols-3 md:gap-12">
        {process.map((step, index) => (
          <Reveal as="li" key={step.step} delay={index * 0.1}>
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm text-accent">{step.step}</span>
              <span className="h-px flex-1 bg-line" aria-hidden />
            </div>
            <h3 className="mt-6 text-xl tracking-tight">{step.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted text-pretty">
              {step.body}
            </p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
