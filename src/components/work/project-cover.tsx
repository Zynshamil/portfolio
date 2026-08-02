import Image from "next/image";
import type { Project } from "@/content/site";
import { cn } from "@/lib/utils";

/** Stable per-slug variation, so a project's artwork never changes between renders. */
function hash(input: string) {
  let value = 0;
  for (let i = 0; i < input.length; i++) {
    value = (value * 31 + input.charCodeAt(i)) >>> 0;
  }
  return value;
}

/**
 * Placeholder artwork for a project, generated from its accent colour.
 * The moment a real screenshot exists, set `cover` on the project and this
 * falls through to an optimised <Image> instead.
 */
export function ProjectCover({
  project,
  className,
  priority,
}: {
  project: Project;
  className?: string;
  priority?: boolean;
}) {
  if (project.cover) {
    return (
      <div className={cn("relative overflow-hidden bg-elevated", className)}>
        <Image
          src={project.cover}
          alt={`${project.title} — ${project.tagline}`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  const seed = hash(project.slug);
  const angle = seed % 360;
  const offsetX = 25 + (seed % 50);
  const offsetY = 20 + ((seed >> 3) % 50);

  return (
    <div
      className={cn("relative overflow-hidden bg-elevated", className)}
      aria-hidden
    >
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        style={{
          background: `radial-gradient(120% 90% at ${offsetX}% ${offsetY}%, ${project.accent}2e, transparent 60%),
                       linear-gradient(${angle}deg, var(--glow-halo), transparent 55%)`,
        }}
      />
      {/* Blueprint grid — reads as "interface" without pretending to be a screenshot. */}
      <div
        className="cover-grid absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage: `linear-gradient(to right, ${project.accent} 1px, transparent 1px),
                            linear-gradient(to bottom, ${project.accent} 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(90% 70% at 50% 50%, black, transparent 78%)",
        }}
      />
      <div className="absolute inset-0 flex items-end p-6">
        <span
          className="cover-tag font-mono text-[11px] tracking-[0.2em] uppercase"
          style={{ color: project.accent }}
        >
          {project.slug}
        </span>
      </div>
    </div>
  );
}
