import { site } from "@/content/site";
import { UnderlineLink } from "./button";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="page flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">{site.location}</p>
          <p className="mt-3 max-w-md text-sm text-muted">
            Built with Next.js, three.js and a stubborn performance budget.
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          {site.socials.map((social) => (
            <li key={social.label}>
              <UnderlineLink href={social.href} className="text-muted">
                {social.label}
              </UnderlineLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="page flex flex-col gap-2 border-t border-line py-6 font-mono text-[11px] tracking-wider text-subtle uppercase sm:flex-row sm:justify-between">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span>All rights reserved</span>
      </div>
    </footer>
  );
}
