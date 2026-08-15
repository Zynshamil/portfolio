"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

import { collaborators } from "@/content/site";

const CollaborationScene = dynamic(
  () =>
    import("@/components/three/collab-scene").then(
      (mod) => mod.CollaborationScene,
    ),
  { ssr: false },
);

/** A linked record of organisations the portfolio owner has worked alongside. */
export function Collaborators() {
  return (
    <section
      id="collaborators"
      aria-labelledby="collaborators-title"
      // Still no rule along the top edge, for the same reason it never had one:
      // About now sits above and closes itself with a bottom border, so a rule
      // here would only double it. `isolate` and the clip are this section's
      // own — they exist for the WebGL layer below, not for the shared shell.
      className="section-shell isolate overflow-hidden"
    >
      <CollaborationScene />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 45%, transparent 20%, var(--bg) 100%)",
        }}
      />

      <div className="page relative">
        <div className="section-head flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Selected collaborations</p>
            <h2 id="collaborators-title" className="my-3 text-display">
              Organizations I&apos;ve collaborated with
            </h2>
            <p className="w-full text-sm leading-6 text-muted md:text-right">
              Across freelance engagements, project collaborations, and in-house
              teams.
            </p>
          </div>
        </div>

        <ul className="relative z-10 my-5 grid gap-5 sm:grid-cols-2">
          {collaborators.map((collaborator, index) => (
            <li key={collaborator.url} className="group relative">
              <Link
                href={collaborator.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Visit ${collaborator.name} (opens in a new tab)`}
                className="card flex min-h-36 flex-col justify-between transition-all group-hover:-translate-y-1 group-hover:border-line-hover group-hover:bg-surface-card-hover group-hover:shadow-card"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-accent/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="logo-plate size-12 transition-colors group-hover:border-accent/40">
                      <Image
                        src={collaborator.icon}
                        alt=""
                        width={48}
                        height={48}
                        unoptimized
                        loading="lazy"
                        className="size-full object-contain"
                      />
                    </span>
                    <span className="text-xl font-bold tracking-[-0.035em] text-fg sm:text-2xl">
                      {collaborator.name}
                    </span>
                  </div>

                  <span
                    aria-hidden
                    className="icon-badge size-8 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink"
                  >
                    ↗
                  </span>
                </div>

                <span className="mt-3 block text-sm text-muted">
                  {collaborator.location}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}