import { about, hero, site } from "@/content/site";

/**
 * Structured data for the home page. The Person block is what feeds Google's
 * knowledge panel for your name. There is deliberately no FAQPage block — that
 * markup is only valid when the questions are visible on the page.
 *
 * Both nodes ship in a single `@graph` and reference each other by `@id`, so
 * they are read as one identity rather than as two unrelated blobs that happen
 * to share a page. `alternateName` is the field that does the real work here:
 * it is how one entity claims several spellings, which is the whole problem
 * when the domain says Shamills, the handles say Shamil and the passport says
 * something else again. `sameAs` closes the loop — those profiles already rank
 * for the name, and pointing at them is what transfers the association here.
 */
export function JsonLd() {
  const personId = `${site.url}/#person`;

  const person = {
    "@type": "Person",
    "@id": personId,
    name: site.name,
    alternateName: site.alternateNames,
    url: site.url,
    email: `mailto:${site.email}`,
    jobTitle: site.role,
    // The visible About copy, so the description Google reads is the same text
    // a visitor reads — rather than a second, competing summary.
    description: `${about.paragraphs[0]} ${hero.intro}`,
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

  const website = {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    alternateName: site.alternateNames,
    url: site.url,
    description: hero.intro,
    inLanguage: "en",
    publisher: { "@id": personId },
    // Says the site is *about* this person, not merely published by them —
    // which is what makes a personal site eligible to answer a name query.
    mainEntity: { "@id": personId },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [person, website],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
