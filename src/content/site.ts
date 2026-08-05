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
  brand: "Zyn Shamills",
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
  headlineLines: ["MAKE WEB LESS BORING"],
  intro:
    "Full-Stack & Mobile Development | Frontend, Backend, & DevOps Solutions",
};

/**
 * The pinned stage the hero folds into on the way down the page. Everything
 * here is placeholder-friendly — swap the wording freely, the layout is driven
 * by the viewport rather than by the length of these strings.
 */
export const stage = {
  /** Set small above the card, as the caption to the drawn signature. */
  signature: "Shamil Babu",
  /** Repeated end to end on the two lines running behind the card. Keep it
   *  short — it is set very large, and the card covers the middle of it. */
  marquee: "Make web less boring",
};

export const collaborators = [
  {
    name: "GJ Global IT Ventures",
    location: "Govt. Cyberpark, Kozhikode, Kerala, India",
    url: "https://www.gjglobalsoft.com/",
    icon: "https://www.gjglobalsoft.com/assets/img/GJ-new-logo2.svg",
  },
  {
    name: "financial.com AG",
    location: "Munich, Germany",
    url: "https://financial.com/",
    icon: "https://financial.com/favicon.ico",
  },
  {
    name: "DigitalWorks Consulting Group",
    location: "Dubai, United Arab Emirates",
    url: "https://www.digitalworks.co/",
    icon: "https://www.digitalworks.co/favicon.ico",
  },
  {
    name: "Family Food Centre",
    location: "Doha, Qatar",
    url: "https://www.family.qa/en",
    icon: "https://www.family.qa/favicon.ico",
  },
  {
    name: "Systalent USA",
    location: "Austin, Texas, United States",
    url: "https://systalent.com/",
    icon: "https://systalent.com/favicon.ico",
  },
  {
    name: "Clunch Developers",
    location: "Bengaluru, India",
    url: "https://clunchdevelopers.com/",
    icon: "https://clunchdevelopers.com/favicon.ico",
  },
] as const;
