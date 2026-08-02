import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/reveal";
import { CtaButton, UnderlineLink } from "@/components/ui/button";
import { ProjectCover } from "@/components/work/project-cover";
import { projects, site } from "@/content/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};

  return {
    title: `${project.title} — case study`,
    description: project.tagline,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} — ${site.name}`,
      description: project.tagline,
      url: `/work/${project.slug}`,
      type: "article",
    },
  };
}

export default async function CaseStudy({ params }: Params) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  const index = projects.findIndex((item) => item.slug === slug);
  const next = projects[(index + 1) % projects.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.tagline,
    author: { "@type": "Person", name: site.name, url: site.url },
    dateCreated: project.year,
    keywords: project.stack.join(", "),
  };

  return (
    <article className="pt-32 md:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="page">
        <Link
          href="/#work"
          className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-subtle uppercase transition-colors hover:text-fg"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          All work
        </Link>

        <h1 className="mt-10 text-display max-w-[14ch] text-balance">
          {project.title}
        </h1>
        <p className="mt-8 max-w-2xl text-lead text-muted text-pretty">
          {project.tagline}
        </p>

        <dl className="mt-14 grid grid-cols-2 gap-8 border-t border-line pt-8 md:grid-cols-4">
          <div>
            <dt className="eyebrow">Role</dt>
            <dd className="mt-2 tracking-tight">{project.role}</dd>
          </div>
          <div>
            <dt className="eyebrow">Timeline</dt>
            <dd className="mt-2 tracking-tight">{project.timeline}</dd>
          </div>
          <div>
            <dt className="eyebrow">Year</dt>
            <dd className="mt-2 tracking-tight">{project.year}</dd>
          </div>
          <div>
            <dt className="eyebrow">Stack</dt>
            <dd className="mt-2 text-sm text-muted">
              {project.stack.join(", ")}
            </dd>
          </div>
        </dl>
      </header>

      <div className="page mt-16">
        <ProjectCover
          project={project}
          priority
          className="aspect-16/9 rounded-card border border-line"
        />
      </div>

      <section className="page mt-20">
        <dl className="grid gap-8 border-y border-line py-10 sm:grid-cols-3">
          {project.metrics.map((metric) => (
            <Reveal key={metric.label}>
              <dd className="text-4xl tracking-tight tabular-nums md:text-5xl">
                {metric.value}
              </dd>
              <dt className="mt-2 text-sm text-muted">{metric.label}</dt>
            </Reveal>
          ))}
        </dl>
      </section>

      <div className="page mt-20 grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-8 lg:col-start-3">
          <Reveal>
            <h2 className="eyebrow">The problem</h2>
            <p className="mt-5 text-lead text-pretty">{project.problem}</p>
          </Reveal>

          <Reveal className="mt-16">
            <h2 className="eyebrow">What I did</h2>
            <ol className="mt-6 space-y-6">
              {project.approach.map((step, stepIndex) => (
                <li key={stepIndex} className="flex gap-5 border-t border-line pt-6">
                  <span className="font-mono text-xs text-accent">
                    {String(stepIndex + 1).padStart(2, "0")}
                  </span>
                  <p className="flex-1 text-muted text-pretty">{step}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal className="mt-16">
            <h2 className="eyebrow">The outcome</h2>
            <p className="mt-5 text-lead text-pretty">{project.outcome}</p>
          </Reveal>

          {(project.liveUrl || project.repoUrl) && (
            <Reveal className="mt-14 flex flex-wrap gap-8 border-t border-line pt-8 text-sm">
              {project.liveUrl && (
                <UnderlineLink href={project.liveUrl}>Visit live site ↗</UnderlineLink>
              )}
              {project.repoUrl && (
                <UnderlineLink href={project.repoUrl}>View source ↗</UnderlineLink>
              )}
            </Reveal>
          )}
        </div>
      </div>

      <section className="page mt-32 border-t border-line pt-16">
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Next case study</p>
            <Link
              href={`/work/${next.slug}`}
              className="group mt-4 block text-title transition-colors hover:text-accent"
            >
              {next.title}
              <span className="ml-3 inline-block transition-transform duration-300 group-hover:translate-x-2">
                →
              </span>
            </Link>
          </div>
          <CtaButton href="/#contact">Start a project</CtaButton>
        </Reveal>
      </section>
    </article>
  );
}
