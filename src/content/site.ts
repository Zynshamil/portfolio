/**
 * ─────────────────────────────────────────────────────────────────────
 *  EDIT THIS FILE — it is the entire content layer of the portfolio.
 * ─────────────────────────────────────────────────────────────────────
 */

export const site = {
  // The name to be known by, and the one search engines are meant to rank.
  // It drives the title, the OG image, `og:site_name` and the Person schema,
  // so it is deliberately the spelling people actually type — the same one the
  // GitHub and LinkedIn handles below use.
  name: "Zyn Shamil",
  // What it says on the paperwork. Kept apart from `name` so the schema can
  // claim both without either having to win.
  legalName: "Shamil Babu",
  // Every other spelling of the same person: the two-L brand, the run-together
  // handles, the legal name. Fed to `alternateName` in the structured data,
  // which is how Google resolves one entity out of several spellings — search
  // for any of these and the same person should come back.
  alternateNames: [
    "Shamil Babu",
    "Zyn Shamills",
    "zynshamil",
    "zynshamills",
  ],
  // The wordmark: what the opening curtain writes across the screen and what
  // the nav logo becomes when it lands. Change it in one place — the intro
  // measures the nav logo at runtime, so any length still lands on target.
  // Two Ls, matching the domain — the signature, not the search term.
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
  url: "https://zynshamills.com",

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
  headlineLines: ["MAKE YOUR WEB LESS BORING"],
  intro:
    "Full-Stack & Mobile Development | Frontend, Backend, & DevOps Solutions",
};

/**
 * The one block of running prose on the site. It exists for two audiences at
 * once: a visitor deciding whether to email, and a search engine with nothing
 * else to read — the rest of the page is a headline, a button and six company
 * names, which is far too thin to rank for anything.
 *
 * It says the name once and then talks about the work. The other spellings are
 * handled by `alternateNames` in the structured data, where a search engine
 * reads them and a visitor never has to — nobody should land here and be told
 * how their host spells his own name.
 */
export const about = {
  eyebrow: "About",
  heading: "Who you're working with",
  paragraphs: [
    "I'm Zyn Shamil, a freelance full-stack developer building fast, unusual web experiences for teams worldwide, from Kerala, India.",
    "I work the whole stack: React and Next.js at the front, Node and Python behind it, and the DevOps to get it shipped. Recent work spans WebGL interfaces, retail management systems and financial data platforms.",
  ],
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
  // marquee: "Make web less boring",
  marquee: "",
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
