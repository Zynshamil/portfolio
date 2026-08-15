import Link from "next/link";

import { about, site } from "@/content/site";

/** Hosts whose own capitalisation is not what the domain name looks like. */
const PROFILE_NAMES: Record<string, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
};

/** `https://github.com/zynshamil` → `GitHub`. */
function profileName(url: string) {
  const [host] = new URL(url).hostname.replace(/^www\./, "").split(".");
  return PROFILE_NAMES[host] ?? host.charAt(0).toUpperCase() + host.slice(1);
}

/**
 * The only prose on the page, and the section that answers a search for the
 * name. Deliberately a server component with no motion: the text has to be in
 * the delivered HTML, and a crawler is not going to scroll it into view.
 */
export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      // The first thing to arrive after the pinned stage releases. Deliberately
      // no rule along the top edge: the stage fades its field into the page
      // colour on the way out, and any line here would put a hard seam exactly
      // where the two are supposed to be indistinguishable — `section-shell`
      // rules the bottom edge only, for that reason.
      className="section-shell"
    >
      <div className="page">
        <div className="section-head">
          <p className="eyebrow">{about.eyebrow}</p>
          <h2 id="about-title" className="my-3 text-display lg:max-w-2/3">
            {about.heading}
          </h2>
        </div>

        {/* Held to a readable measure rather than the full poster width — this
            is the one place on the site meant to be read rather than seen. */}
        <div className="mt-9 max-w-3xl">
          {about.paragraphs.map((paragraph, index) => (
            <p
              key={paragraph}
              className={
                index === 0
                  ? "text-lead text-fg text-pretty"
                  : "mt-5 text-lead text-muted text-pretty"
              }
            >
              {paragraph}
            </p>
          ))}

          {/* The domains, as chips rather than a third sentence — a client
              reads two lines of prose and then scans this in a glance. */}
          <div className="mt-9">
            <p className="eyebrow">{about.builds.label}</p>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {about.builds.items.map((item) => (
                <li
                  key={item}
                  className="chip text-fg/85 transition-colors hover:border-accent/45 hover:text-fg"
                >
                  <span aria-hidden className="size-1.5 rounded-pill bg-accent" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-5 text-sm leading-6 text-muted text-pretty">
              {about.builds.note}
            </p>
          </div>

          {/* `rel="me"` is the quiet half of this: it tells a crawler these
              profiles are the same person as the site, which is what carries
              the other spellings of the name without printing any of them. */}
          <ul className="mt-9 flex flex-wrap gap-x-8 gap-y-3">
            {site.profiles.map((url) => (
              <li key={url}>
                <Link
                  href={url}
                  target="_blank"
                  rel="me noreferrer noopener"
                  className="group label inline-flex items-center gap-2 text-muted transition-colors hover:text-accent"
                >
                  {profileName(url)}
                  <span
                    aria-hidden
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
