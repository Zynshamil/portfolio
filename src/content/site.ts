/**
 * ─────────────────────────────────────────────────────────────────────
 *  EDIT THIS FILE — it is the entire content layer of the portfolio.
 * ─────────────────────────────────────────────────────────────────────
 */

export const site = {
  name: "Shamil Babu",
  // The wordmark: what the opening curtain writes across the screen and what
  // the nav logo becomes when it lands. Change it in one place — the intro
  // measures the nav logo at runtime, so any length still lands on target.
  brand: "Zyn Shamil",
  role: "Freelance full-stack frontend developer",
  // Shown on the generated OG image.
  location: "Remote · worldwide · based in India (UTC+5:30)",

  // Drives the badge in the header and the one above the headline.
  available: true,
  availableText: "Available for freelance & contract work — worldwide, remote",

  email: "zynshamills@gmail.com",
  // Add a Cal.com / Calendly link here to turn the hero CTA into a real
  // booking. Left empty, it falls back to email.
  callUrl: "",

  // ⚠️ Set this to your real deployed domain before publishing — it drives
  // canonical URLs, the sitemap and OG tags.
  url: "https://your-domain.com",

  // Feeds the `sameAs` list in the Person structured data.
  profiles: [
    "https://github.com/zynshamil",
    "https://linkedin.com/in/zynshamil",
  ],
} as const;

export const hero = {
  // Rendered exactly as broken here — one line per entry, uppercased by the
  // `text-hero` type utility rather than in the copy, so screen readers and the
  // page's own metadata still get natural sentence case.
  headlineLines: ["Make", "corporate websites", "less boring"],
  intro:
    "Freelance full-stack frontend developer with 3+ years in React and Next.js. I ship high-performance, composable interfaces — headless CMS, sub-second search, SSR/ISR — backed by Node, Express and MongoDB when a project needs the whole stack.",
  stats: [
    { value: "3+", label: "Years shipping" },
    { value: "+20%", label: "Conversion lift, e-commerce" },
    { value: "-40%", label: "Page load, platform revamp" },
  ],
};
