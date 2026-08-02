import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/**
 * Every section on the page shares this frame: a hairline rule, a monospace
 * index label, and a title. The repetition is the point — it is what makes a
 * long scrolling page feel like one document rather than a stack of templates.
 */
export function Section({
  id,
  index,
  eyebrow,
  title,
  intro,
  children,
  className,
}: {
  id?: string;
  index?: string;
  eyebrow?: string;
  title?: ReactNode;
  intro?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24 py-24 md:py-32", className)}>
      <div className="page">
        {(eyebrow || title) && (
          <Reveal className="mb-14 md:mb-20">
            {eyebrow && (
              <div className="mb-8 flex items-baseline gap-4 border-t border-line pt-4">
                <span className="eyebrow">{eyebrow}</span>
                {index && <span className="eyebrow ml-auto">{index}</span>}
              </div>
            )}
            {title && (
              <h2 className="text-title max-w-4xl text-balance">{title}</h2>
            )}
            {intro && (
              <p className="mt-6 max-w-2xl text-lead text-muted text-pretty">
                {intro}
              </p>
            )}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
