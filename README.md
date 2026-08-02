# Portfolio

A single-screen portfolio: an opening name curtain, then a 3D hero. Next.js 16 (App Router) + React Three Fiber, with one content file you edit to make it yours.

## Stack

- **Next.js 16** (App Router, Turbopack) — statically prerendered, so it deploys anywhere and loads instantly
- **React Three Fiber + three.js** — a custom GLSL particle field in the hero
- **Motion** (Framer Motion) for the intro and reveals, **Lenis** for smooth scroll
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

## Make it yours

Everything editable lives in [`src/content/site.ts`](src/content/site.ts).

- **`site`** — name, wordmark, role, location, email, booking link, domain URL, profile links. Set `available: false` and both status badges disappear.
- **`hero`** — the headline (one array entry per rendered line; the last line takes the accent colour), the intro paragraph, and the three stats.

Set `site.url` to your real domain before publishing — it drives canonical URLs, the sitemap and the OG tags.

### The intro curtain

On every page load, [`intro.tsx`](src/components/ui/intro.tsx) paints a white sheet, types `site.brand` across the centre, then FLIPs it onto the nav wordmark. It measures the real `[data-brand]` element at runtime, so any name length lands on target — but the two must stay typographically identical, so change the nav wordmark's font, size or tracking and you have to match it in the curtain.

Visitors with JavaScript off, or `prefers-reduced-motion`, land straight on the site.

### Brand colour & look

Design tokens are CSS variables at the top of [`src/app/globals.css`](src/app/globals.css). The one that changes the feel most is `--accent` (the lime). Change it there and it propagates everywhere, including the generated OG image. Light mode has its own `--accent` because neon lime is unreadable on paper.

## The 3D scene — how it stays fast

- **Device-tiered budget.** [`use-quality.ts`](src/components/three/use-quality.ts) picks a particle count (6k–44k) and pixel-ratio cap from the device's cores, memory, and pointer type *before the first frame* — pessimistically, so a mid-range phone stays at 60fps.
- **Lazy-loaded.** The three.js bundle is dynamically imported, so first paint is text + a CSS gradient.
- **Stops when unseen.** The render loop is cut when the hero scrolls out of view or the tab is hidden.
- **Graceful fallback.** No WebGL, or `prefers-reduced-motion`? You get the CSS gradient. Nothing breaks, nothing spins forever.

To drop the 3D entirely, delete `<HeroCanvas />` from [`src/components/sections/hero.tsx`](src/components/sections/hero.tsx) — the gradient fallback stands on its own.

## SEO

- Metadata + Open Graph, with the OG image generated at [`src/app/opengraph-image.tsx`](src/app/opengraph-image.tsx)
- **JSON-LD**: a `Person` block on the home page
- `sitemap.xml` and `robots.txt` generated from your content

## Deploy

Zero-config on **Vercel**: push to GitHub, import the repo, deploy. It's a static build, so Netlify, Cloudflare Pages, or any Node host works too.

## Structure

```
src/
├─ content/site.ts          ← edit this
├─ app/
│  ├─ layout.tsx            fonts, metadata, pre-paint theme + intro scripts
│  ├─ page.tsx              home — JSON-LD + hero
│  ├─ opengraph-image.tsx   generated OG image
│  ├─ sitemap.ts, robots.ts, not-found.tsx
├─ components/
│  ├─ three/                WebGL hero (scene, shaders, quality tiers)
│  ├─ sections/hero.tsx     the one section
│  ├─ ui/                   intro curtain, nav, theme, button, smooth-scroll
│  └─ seo/                  JSON-LD
```
