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
      // here would only double it.
      className="relative isolate overflow-hidden border-b border-b-line py-20 sm:py-28"
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
        <div className="flex flex-col justify-between gap-5 border-b-2 border-line-strong pb-7 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Selected collaborations</p>
            <h2
              id="collaborators-title"
              className="my-3 text-display "
            >
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
                className="relative flex min-h-36 flex-col justify-between overflow-hidden rounded-2xl border border-line bg-bg/55 p-6 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-fg/25 group-hover:bg-bg/70 group-hover:shadow-[0_18px_50px_-20px_rgba(0,0,0,0.55)] sm:p-7"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* The mark fills the chip edge to edge. The logos that
                        carry their own opaque background (a grey square, a
                        white one) therefore reach the rounded corners and get
                        clipped by them, instead of sitting as a hard square
                        inside a ring of chip colour. The ones with real
                        transparency simply let the plate through. */}
                    <span className="flex size-12 shrink-0 overflow-hidden rounded-xl border border-line bg-logo-plate transition-colors duration-300 group-hover:border-accent/40">
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
                    <span className="text-xl font-extrabold tracking-[-0.035em] text-fg sm:text-2xl">
                      {collaborator.name}
                    </span>
                  </div>

                  <span
                    aria-hidden
                    className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-accent transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink"
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