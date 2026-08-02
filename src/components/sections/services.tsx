import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { services } from "@/content/site";

export function Services() {
  return (
    <Section
      id="services"
      eyebrow="What I do"
      index="02"
      title={
        <>
          Three ways I&apos;m usually{" "}
          <span className="serif-em text-accent">brought in</span>.
        </>
      }
      intro="Whether you need a feature shipped, an experience built, or a codebase pulled out of the fire — the engagement is scoped and priced before we start."
    >
      <div className="grid gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-3">
        {services.map((service, index) => (
          <Reveal
            key={service.title}
            delay={index * 0.08}
            className="flex flex-col bg-bg p-7 transition-colors duration-500 hover:bg-elevated md:p-9"
          >
            <span className="eyebrow">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-6 text-2xl tracking-tight">{service.title}</h3>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-muted text-pretty">
              {service.body}
            </p>
            <ul className="mt-7 space-y-2 border-t border-line pt-5">
              {service.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 font-mono text-[12px] text-subtle"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
