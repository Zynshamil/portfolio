import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { UnderlineLink } from "@/components/ui/button";
import { experience, marquee, site } from "@/content/site";

export function About() {
  return (
    <Section id="about" eyebrow="About" index="04">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-7">
          <h2 className="text-title max-w-2xl text-balance">
            I care about the boring half — the{" "}
            <span className="serif-em text-accent">half users feel</span>.
          </h2>

          <div className="mt-8 max-w-xl space-y-5 text-lead text-muted text-pretty">
            <p>
              I&apos;m a frontend engineer with 3+ years building
              high-performance web apps in React and Next.js. My focus is
              composable architecture — decoupling the frontend from the CMS and
              commerce so teams ship faster — and the performance work that
              actually moves Core Web Vitals: SSR/ISR, code splitting, and
              trimming bundles that had no business being that big.
            </p>
            <p>
              Frontend is my core, but I take projects the whole way when they
              need it: typed Node and Express APIs, MongoDB, headless CMS, and
              deployment on AWS with Docker. I&apos;d rather show you a
              conversion number and a Lighthouse trace than a mood board.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <UnderlineLink href={site.resumeUrl}>Download résumé</UnderlineLink>
            {site.socials
              .filter((social) => social.label !== "Email")
              .map((social) => (
                <UnderlineLink key={social.label} href={social.href}>
                  {social.label}
                </UnderlineLink>
              ))}
          </div>
        </Reveal>

        <div className="lg:col-span-5">
          <Reveal delay={0.1}>
            <h3 className="eyebrow">Experience</h3>
            <ul className="mt-6">
              {experience.map((job) => (
                <li key={`${job.company}-${job.period}`} className="border-t border-line py-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="tracking-tight">{job.company}</span>
                    <span className="font-mono text-[11px] whitespace-nowrap text-subtle">
                      {job.period}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{job.role}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.16} className="mt-12">
            <h3 className="eyebrow">Toolkit</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {marquee.map((tool) => (
                <li
                  key={tool}
                  className="rounded-full border border-line px-3 py-1.5 font-mono text-[11px] text-subtle"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
