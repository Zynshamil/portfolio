import { faqs, hero, site } from "@/content/site";

/**
 * Structured data for the home page. The Person block is what feeds Google's
 * knowledge panel for your name; the FAQ block can win an expanded result.
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
    sameAs: site.socials
      .filter((social) => social.href.startsWith("http"))
      .map((social) => social.href),
    knowsAbout: [
      "Next.js",
      "React",
      "TypeScript",
      "Three.js",
      "WebGL",
      "Web performance",
    ],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
        />
      )}
    </>
  );
}
