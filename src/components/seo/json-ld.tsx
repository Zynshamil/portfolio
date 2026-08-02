import { hero, site } from "@/content/site";

/**
 * Structured data for the home page. The Person block is what feeds Google's
 * knowledge panel for your name. There is deliberately no FAQPage block — that
 * markup is only valid when the questions are visible on the page.
 */
export function JsonLd() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    email: `mailto:${site.email}`,
    jobTitle: site.role,
    description: hero.intro,
    sameAs: site.profiles,
    knowsAbout: [
      "Next.js",
      "React",
      "TypeScript",
      "Three.js",
      "WebGL",
      "Web performance",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
    />
  );
}
