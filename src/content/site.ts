/**
 * ─────────────────────────────────────────────────────────────────────
 *  EDIT THIS FILE — it is the entire content layer of the portfolio.
 *
 *  Populated from Shamil Babu's résumé. The case-study narratives were
 *  expanded from résumé bullets into prose — read them once and adjust any
 *  wording you'd phrase differently. Every metric here comes straight from
 *  the résumé; don't add numbers you can't stand behind.
 * ─────────────────────────────────────────────────────────────────────
 */

export const site = {
  name: "Shamil Babu",
  // The wordmark: what the opening curtain writes across the screen and what
  // the nav logo becomes when it lands. Change it in one place — the intro
  // measures the nav logo at runtime, so any length still lands on target.
  brand: "Zyn Shamil",
  // Positioned the way you asked — freelance, full-stack, frontend-led.
  role: "Freelance full-stack frontend developer",
  location: "Remote · worldwide · based in India (UTC+5:30)",
  available: true,
  availableText: "Available for freelance & contract work — worldwide, remote",

  email: "zynshamills@gmail.com",
  // Drop your résumé PDF at public/resume.pdf (see README).
  resumeUrl: "/resume.pdf",
  // Add a Cal.com / Calendly link here to turn every "book a call" CTA into a
  // real booking. Left empty, those CTAs fall back to email.
  callUrl: "",

  // ⚠️ Set this to your real deployed domain before publishing — it drives
  // canonical URLs, the sitemap and OG tags.
  url: "https://your-domain.com",

  socials: [
    { label: "GitHub", href: "https://github.com/zynshamil" },
    { label: "LinkedIn", href: "https://linkedin.com/in/zynshamil" },
    { label: "Email", href: "mailto:zynshamills@gmail.com" },
  ],
} as const;

/* ── Hero ─────────────────────────────────────────────────────────── */

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

/* ── Capability marquee ───────────────────────────────────────────── */

export const marquee = [
  "React.js",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Sanity CMS",
  "GROQ",
  "Typesense",
  "Commerce Layer",
  "Redux Toolkit",
  "React Query",
  "Tailwind CSS",
  "AWS · Docker",
  "SSR / SSG / ISR",
];

/* ── Services (what a client is buying) ───────────────────────────── */

export const services = [
  {
    title: "Frontend engineering",
    body: "Production React and Next.js interfaces — typed, responsive and built to spec on deadline. Reusable component systems that cut duplication and speed up every screen that comes after.",
    points: ["React.js & Next.js", "TypeScript end to end", "MUI · Tailwind design systems"],
  },
  {
    title: "Composable & headless",
    body: "Best-of-breed stacks that decouple your frontend from your CMS and commerce. Sanity, Commerce Layer and Typesense wired together so content and search ship without a developer in the loop.",
    points: ["Headless CMS (Sanity / Strapi)", "GROQ + Typesense search", "Composable commerce"],
  },
  {
    title: "Full-stack & performance",
    body: "When a project needs the whole stack: Node, Express and MongoDB APIs, deployed on AWS with Docker. Plus the performance work — SSR/ISR, code splitting, bundle trimming — that moves Core Web Vitals and revenue.",
    points: ["Node · Express · MongoDB REST APIs", "AWS · Docker · Nginx", "Core Web Vitals & bundle audits"],
  },
];

/* ── Process ──────────────────────────────────────────────────────── */

export const process = [
  {
    step: "01",
    title: "Scope in writing",
    body: "A short call, then a written scope with deliverables, timeline and a fixed price. You approve it before any code exists.",
  },
  {
    step: "02",
    title: "Ship in slices",
    body: "Working software on a preview URL from week one. You review real screens, not mockups, and change direction while it's still cheap.",
  },
  {
    step: "03",
    title: "Hand over cleanly",
    body: "Typed, tested, documented code in your repo — containerised and deploy-ready. A walkthrough recording, and support so nothing lands on your team cold.",
  },
];

/* ── Work / case studies ──────────────────────────────────────────── */

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  role: string;
  timeline: string;
  featured: boolean;
  accent: string;
  cover?: string;
  stack: string[];
  metrics: { value: string; label: string }[];
  liveUrl?: string;
  repoUrl?: string;
  problem: string;
  approach: string[];
  outcome: string;
};

export const projects: Project[] = [
  {
    slug: "composable-ecommerce",
    title: "Composable E-Commerce Platform",
    tagline:
      "A best-of-breed headless stack that beat a legacy monolith and lifted conversion 20%.",
    year: "2024",
    role: "Frontend Developer · GJ Global IT Ventures",
    timeline: "Multi-quarter build",
    featured: true,
    accent: "#ccff33",
    stack: ["Next.js", "Commerce Layer", "Typesense", "Sanity CMS", "GROQ"],
    metrics: [
      { value: "+20%", label: "Conversion rate" },
      { value: "-30%", label: "JavaScript bundle" },
      { value: "<1s", label: "Real-time search" },
    ],
    liveUrl: "",
    repoUrl: "",
    problem:
      "The business was running on a legacy monolithic e-commerce system that coupled the storefront to its backend, slowed every release, and left conversion on the table. Content changes needed a developer, and search was neither fast nor relevant.",
    approach: [
      "Architected a best-of-breed composable stack — Next.js on the frontend, Commerce Layer for commerce, Typesense for search — replacing the monolith with independently deployable pieces.",
      "Integrated Sanity CMS with optimised GROQ queries, decoupling the frontend from the CMS so the content team could ship updates without a deployment.",
      "Built the storefront as a multilingual, SEO-optimised site using hybrid rendering (SSR, SSG and ISR) to balance freshness against speed on every route.",
      "Cut the JavaScript bundle by roughly 30% by eliminating heavy dependencies and applying strategic code splitting, and reduced unnecessary re-renders ~15% with Redux Toolkit and Context API.",
    ],
    outcome:
      "The composable platform outperformed the previous monolith and lifted conversion rates by 20%. Sub-second Typesense search replaced slow queries, and a reusable MUI + Tailwind component library cut UI code duplication ~35%, accelerating everything built afterwards.",
  },
  {
    slug: "platform-revamp",
    title: "Legacy Platform Revamp",
    tagline:
      "Re-architected a legacy platform into a scalable full-stack system — 40% faster, 30% fewer runtime errors.",
    year: "2026",
    role: "Fullstack Developer · Digital Works Consulting Group",
    timeline: "~5 months",
    featured: true,
    accent: "#6ee7ff",
    stack: ["Next.js", "Node.js", "Express.js", "MongoDB", "TypeScript", "Docker"],
    metrics: [
      { value: "-40%", label: "Average page load" },
      { value: "-30%", label: "Runtime errors" },
      { value: "-50%", label: "Dev time on content" },
    ],
    liveUrl: "",
    repoUrl: "",
    problem:
      "A legacy platform had grown brittle and slow, with a mixed codebase that made changes risky and left the content team dependent on engineers for routine updates.",
    approach: [
      "Re-architected the platform into a scalable full-stack system on Next.js, Node.js and MongoDB, designed for long-term maintainability rather than a one-off patch.",
      "Migrated the entire codebase — frontend and backend — to TypeScript, which cut reported runtime errors by roughly 30% and made the code safer to change.",
      "Designed and optimised RESTful APIs with Express.js to improve data throughput and allow the system to scale horizontally as load grows.",
      "Integrated a Strapi headless CMS and applied SSR/ISR rendering strategies in Next.js to improve Core Web Vitals and cut redundant database queries.",
      "Containerised the full stack with Docker for consistent local development and reliable deployment across environments.",
    ],
    outcome:
      "Average page load dropped by around 40% and runtime errors by roughly 30%. The Strapi integration reduced developer involvement in content tasks by about 50%, freeing engineering to focus on product.",
  },
  {
    slug: "swap-logistics",
    title: "SWAP Logistics Platform",
    tagline:
      "One Nx monorepo powering three apps, with live Google Maps container tracking.",
    year: "2025",
    role: "Frontend Developer",
    timeline: "Multi-app build",
    featured: false,
    accent: "#ff8a5b",
    stack: ["Next.js", "Nx Monorepo", "React Query", "Google Maps API"],
    metrics: [
      { value: "3", label: "Apps, one codebase" },
      { value: "Live", label: "Container tracking" },
      { value: "React Query", label: "Data layer" },
    ],
    liveUrl: "",
    repoUrl: "",
    problem:
      "The product needed three distinct experiences — Admin, Business and User — that shared most of their logic but had drifted apart, duplicating work across separate codebases.",
    approach: [
      "Architected an Nx monorepo serving all three apps from shared libraries, maximising code reuse and keeping the experiences consistent.",
      "Integrated the Google Maps API for real-time container tracking and logistics visualisation.",
      "Managed server state with React Query to keep the maps and dashboards fast and in sync.",
    ],
    outcome:
      "A single monorepo delivered Admin, Business and User apps with shared code and live tracking, cutting duplicated effort and keeping every surface consistent as the platform grew.",
  },
  {
    slug: "construction-management",
    title: "Construction Management Platform",
    tagline:
      "A full-stack platform with role-based access for admin, PM and client, deployed on AWS.",
    year: "2025",
    role: "Full-stack, solo",
    timeline: "Personal project",
    featured: false,
    accent: "#c4a6ff",
    stack: ["React", "TypeScript", "Express.js", "MongoDB", "AWS EC2", "Nginx"],
    metrics: [
      { value: "3 roles", label: "Admin · PM · Client" },
      { value: "Full-stack", label: "Built solo" },
      { value: "AWS", label: "EC2 · Nginx · PM2" },
    ],
    liveUrl: "",
    repoUrl: "",
    problem:
      "Construction teams needed one place to track projects, allocate resources and file site reports — with clearly separated permissions for admins, project managers and clients.",
    approach: [
      "Built the platform end to end in React and TypeScript on an Express.js and MongoDB backend.",
      "Implemented role-based access control for admin, PM and client roles, so each user only sees and does what their role allows.",
      "Covered the core workflows — project tracking, resource allocation and site reporting — in a single system.",
      "Deployed to AWS EC2 behind Nginx with PM2 for process management.",
    ],
    outcome:
      "A working full-stack construction management platform, built solo, that handles project tracking, resource allocation and site reporting with proper role separation across three user types.",
  },
  {
    slug: "hospital-management",
    title: "Hospital Management System",
    tagline:
      "EMR modules and automated PDF reporting that improved operational efficiency 25%.",
    year: "2024",
    role: "Frontend Developer",
    timeline: "Module build",
    featured: false,
    accent: "#8affc1",
    stack: ["React", "Redux-Saga", "Bootstrap"],
    metrics: [
      { value: "+25%", label: "Operational efficiency" },
      { value: "Auto", label: "PDF report generation" },
      { value: "EMR", label: "Records modules" },
    ],
    liveUrl: "",
    repoUrl: "",
    problem:
      "Hospital staff were spending time on manual record-keeping and report generation that slowed day-to-day operations.",
    approach: [
      "Engineered EMR (electronic medical record) modules in React, with Redux-Saga managing complex asynchronous flows.",
      "Automated PDF report generation to replace manual document work.",
    ],
    outcome:
      "The EMR modules and automated reporting improved operational efficiency by around 25%.",
  },
];

/* ── Experience ───────────────────────────────────────────────────── */

export const experience = [
  {
    company: "Digital Works Consulting Group",
    role: "Fullstack Developer · Dubai, UAE (Remote)",
    period: "Feb 2026 — Jul 2026",
  },
  {
    company: "Self-Employed",
    role: "Freelance Fullstack Developer (Remote)",
    period: "Sep 2025 — Feb 2026",
  },
  {
    company: "GJ Global IT Ventures",
    role: "Frontend Developer · Calicut",
    period: "Feb 2023 — Sep 2025",
  },
  {
    company: "Luminar Technolab",
    role: "Full Stack Developer Intern · Kochi",
    period: "Feb 2022 — Jun 2022",
  },
];

/* ── Testimonials ─────────────────────────────────────────────────── */
/**
 * Empty on purpose. Add real, permissioned quotes from clients or managers
 * here and the References section appears automatically. Never publish
 * invented testimonials as real.
 *
 * Shape: { quote: string; author: string; title: string }
 */
export const testimonials: {
  quote: string;
  author: string;
  title: string;
}[] = [];

/* ── FAQ ──────────────────────────────────────────────────────────── */

export const faqs = [
  {
    q: "How do you price freelance work?",
    a: "Fixed price per milestone for defined scope, or a weekly rate for open-ended work. You get the number in writing before anything starts, and it doesn't move unless the scope does.",
  },
  {
    q: "Do you work with clients worldwide?",
    a: "Yes — I work fully remote and have delivered for teams across India, the UAE and beyond. I'm based in India (UTC+5:30) and overlap comfortably with most time zones.",
  },
  {
    q: "Frontend only, or full-stack?",
    a: "Frontend is my core — React and Next.js — but I take projects the whole way when they need it: Node, Express and MongoDB APIs, headless CMS integration, and deployment on AWS with Docker.",
  },
  {
    q: "Can you join an existing team or codebase?",
    a: "Often. I'm comfortable working in an existing repo, reviewing PRs, and matching your conventions — including migrating a codebase to TypeScript as I go.",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
