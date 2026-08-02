# Portfolio

A fast, 3D portfolio built to help you land work — full-time or freelance. Next.js 16 (App Router) + React Three Fiber, with a single content file you edit to make it yours.

It leads with **outcomes, not screenshots**: every project is a case study stating the problem, what you did, and what changed. That framing is what convinces a hiring manager or a client, and it's baked into the structure.

## Stack

- **Next.js 16** (App Router, Turbopack) — statically prerendered, so it deploys anywhere and loads instantly
- **React Three Fiber + three.js** — a custom GLSL particle field in the hero
- **Motion** (Framer Motion) for reveals, **Lenis** for smooth scroll
- **Tailwind CSS v4** with a small design-token system
- **TypeScript**, strict

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint
```

Node 18.18+ (built and tested on Node 22).

## Make it yours — start here

**Almost everything lives in one file: [`src/content/site.ts`](src/content/site.ts).**
Open it and replace the placeholders. No other file needs to change to ship a real site. In order of priority:

1. **`site`** — your name, role, location, email, résumé link, booking link, domain URL, and social links. Set `available: false` when you're not taking work and the status badges disappear.
2. **`projects`** — the four sample case studies. Replace each with your real work. Each becomes a page at `/work/<slug>`. Fields: `problem`, `approach` (an array of steps), `outcome`, `metrics`, `stack`. Set `featured: true` for the ones that get large cards up top.
3. **`hero`** — the headline (split into three parts so one phrase renders in italic serif) and intro.
4. **`services`, `process`, `experience`, `faqs`** — edit or trim to fit you.
5. **`testimonials`** — ⚠️ **these are fake placeholders. Delete them or replace with real, permissioned quotes before publishing.** Publishing invented testimonials as real is dishonest and, in most places, unlawful advertising. The section hides itself automatically when the array is empty.

### Project images

Case study covers are **generated from each project's `accent` colour**, so nothing looks broken before you have screenshots. When you have a real one, drop it in `public/work/` and set `cover: "/work/your-image.png"` on that project — it switches to an optimised `next/image` automatically.

### Résumé

Put your PDF at `public/resume.pdf` (or point `site.resumeUrl` at an external link).

### Brand colour & look

Design tokens are CSS variables at the top of [`src/app/globals.css`](src/app/globals.css). The one that changes the feel most is `--accent` (the lime). Change it there and it propagates everywhere, including the generated OG image and project covers.

## The 3D scene — how it stays fast

The hero WebGL is engineered to *never* be the reason the site feels slow:

- **Device-tiered budget.** [`use-quality.ts`](src/components/three/use-quality.ts) picks a particle count (6k–44k) and pixel-ratio cap from the device's cores, memory, and pointer type *before the first frame* — pessimistically, so a recruiter's mid-range phone stays at 60fps.
- **Lazy-loaded.** The three.js bundle is dynamically imported, so first paint is text + a CSS gradient. No WebGL blocks the content.
- **Stops when unseen.** The render loop is cut when the hero scrolls out of view or the tab is hidden.
- **Graceful fallback.** No WebGL, or `prefers-reduced-motion`? You get the CSS gradient (or a single still frame). Nothing breaks, nothing spins forever.

If you want to drop the 3D entirely, delete `<HeroCanvas />` from [`src/components/sections/hero.tsx`](src/components/sections/hero.tsx) — the gradient fallback stands on its own.

## SEO — already done

- Per-route metadata + Open Graph, dynamic **OG image** generated at [`src/app/opengraph-image.tsx`](src/app/opengraph-image.tsx)
- **JSON-LD**: `Person` + `FAQPage` on the home page, `CreativeWork` on each case study
- `sitemap.xml` and `robots.txt` generated from your content
- Set `site.url` to your real domain so canonicals and the sitemap are correct.

## Deploy

Zero-config on **Vercel**: push to GitHub, import the repo, deploy. It's a static build, so Netlify, Cloudflare Pages, or any Node host works too.

**Before you go live:**

- [ ] Replace every placeholder in `src/content/site.ts`
- [ ] Set `site.url` to your real domain
- [ ] Delete or replace the placeholder testimonials
- [ ] Add `public/resume.pdf`
- [ ] Swap in real project cover images

## Structure

```
src/
├─ content/site.ts          ← edit this
├─ app/
│  ├─ page.tsx              home (assembles the sections)
│  ├─ work/[slug]/page.tsx  case study pages
│  ├─ opengraph-image.tsx   generated OG image
│  ├─ sitemap.ts, robots.ts, not-found.tsx
├─ components/
│  ├─ three/               WebGL hero (scene, shaders, quality tiers)
│  ├─ sections/            hero, work, services, process, about, …
│  ├─ ui/                  nav, footer, buttons, reveal, section, smooth-scroll
│  ├─ work/                project cover art
│  └─ seo/                 JSON-LD
```
# portfolio
