import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ProjectCover } from "@/components/work/project-cover";
import { featuredProjects, otherProjects, type Project } from "@/content/site";

function FeaturedCard({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal as="article" delay={index * 0.08}>
      <Link
        href={`/work/${project.slug}`}
        className="group block rounded-card border border-line transition-colors duration-500 hover:border-line-strong"
      >
        <ProjectCover
          project={project}
          priority={index === 0}
          className="aspect-16/10 rounded-t-card"
        />

        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3">
            <span className="eyebrow">{project.year}</span>
            <span className="h-px flex-1 bg-line" aria-hidden />
            <span className="eyebrow">{project.role}</span>
          </div>

          <h3 className="mt-5 text-2xl tracking-tight transition-colors group-hover:text-accent md:text-3xl">
            {project.title}
          </h3>
          <p className="mt-3 max-w-lg text-muted text-pretty">{project.tagline}</p>

          <dl className="mt-7 grid grid-cols-3 gap-4 border-t border-line pt-6">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <dd className="text-xl tracking-tight tabular-nums md:text-2xl">
                  {metric.value}
                </dd>
                <dt className="mt-1 text-[11px] leading-tight text-subtle">
                  {metric.label}
                </dt>
              </div>
            ))}
          </dl>

          <div className="mt-7 flex flex-wrap items-center gap-2">
            {project.stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-subtle"
              >
                {tech}
              </span>
            ))}
            <span className="ml-auto text-sm text-muted transition-colors group-hover:text-accent">
              Case study{" "}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

function CompactRow({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal as="li" delay={index * 0.06}>
      <Link
        href={`/work/${project.slug}`}
        className="group flex flex-col gap-3 border-t border-line py-6 transition-colors hover:border-line-strong md:flex-row md:items-center md:gap-8"
      >
        <span className="eyebrow w-12 shrink-0">{project.year}</span>
        <span className="text-xl tracking-tight transition-colors group-hover:text-accent md:w-56 md:shrink-0">
          {project.title}
        </span>
        <span className="flex-1 text-sm text-muted text-pretty">
          {project.tagline}
        </span>
        <span
          className="text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent"
          aria-hidden
        >
          →
        </span>
      </Link>
    </Reveal>
  );
}

export function Work() {
  return (
    <Section
      id="work"
      eyebrow="Selected work"
      index="01"
      title={
        <>
          Case studies, not{" "}
          <span className="serif-em text-muted">screenshots</span>.
        </>
      }
      intro="Every project below states the problem, what I actually did, and what changed as a result. If a number is on this page, it came from production."
    >
      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        {featuredProjects.map((project, index) => (
          <FeaturedCard key={project.slug} project={project} index={index} />
        ))}
      </div>

      {otherProjects.length > 0 && (
        <ul className="mt-20">
          {otherProjects.map((project, index) => (
            <CompactRow key={project.slug} project={project} index={index} />
          ))}
          <li className="border-t border-line" aria-hidden />
        </ul>
      )}
    </Section>
  );
}
