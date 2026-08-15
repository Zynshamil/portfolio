import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import localFont from "next/font/local";
import { site, hero, about } from "@/content/site";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { Nav } from "@/components/ui/nav";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { IntroProvider } from "@/components/ui/intro";
import { BRAND } from "@/lib/brand";
import { themeInitScript } from "@/lib/theme";
import { introInitScript } from "@/lib/intro";
import "./globals.css";

/**
 * Two families, split by job — `font-primary` and `font-secondary` in the CSS.
 *
 * SF Pro Display is primary: the body default and everything that reads as
 * interface or running text. It is Apple's display cut, drawn for large sizes,
 * so it holds up in the section headings too.
 *
 * Four static faces rather than one variable file, because that is what Apple
 * ships: there is no `wght` axis to interpolate and no `wdth` axis at all, so
 * 700 is the ceiling and `font-stretch` is inert. Everything that sets this
 * family in `globals.css` is written to that range.
 *
 * The files in `fonts/` are the 2.3MB originals subset to the Latin range the
 * site actually sets (plus ·, ×, — and the arrows), which takes each face to
 * ~22KB. Regenerate with pyftsubset if the copy ever needs a new script:
 *
 *   pyftsubset SF-Pro-Display-Bold.otf --output-file=SFProDisplay-Bold.woff2 \
 *     --flavor=woff2 --layout-features='kern,liga,calt,ccmp,locl,mark,mkmk,frac,tnum,case' \
 *     --unicodes='U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2190-2199,U+2212,U+2215,U+FEFF,U+FFFD' \
 *     --no-hinting --desubroutinize --name-IDs='*' --name-legacy --notdef-outline
 *
 * Light is deliberately not loaded. Every file listed here is preloaded on
 * every route, and nothing on the page sets 300.
 */
const sfPro = localFont({
  src: [
    { path: "../../fonts/SFProDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/SFProDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/SFProDisplay-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/SFProDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-sf-pro",
  display: "swap",
});

/**
 * Archivo is secondary, and it is the poster voice: the whole hero section, the
 * wordmark in the nav, and the intro curtain that flies one onto the other.
 *
 * It is here rather than SF Pro for the two things SF Pro cannot do — it runs
 * to a true 900, and its `wdth` axis is loaded so the headline and wordmark can
 * be widened into painted signage instead of sitting at the polite default
 * width. Those three places are the whole point of the second family; anything
 * else that sets it is a mistake.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const title = `${site.name} — ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s — ${site.name}`,
  },
  // Deliberately not `hero.intro`, which is a list of services and names
  // nobody. A search for the name gets a snippet that answers it, while the
  // social cards below keep the punchier line — a meta description and an
  // og:description are read by different audiences.
  description: about.paragraphs[0],
  // Google ignores this tag outright; it is here for Bing and costs nothing.
  // The spellings that matter are carried by the title, the About copy and the
  // `alternateName` list in the structured data, not by this.
  keywords: [
    site.name,
    ...site.alternateNames,
    "Next.js developer",
    "React developer",
    "Three.js developer",
    "WebGL",
    "TypeScript",
    "freelance web developer",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title,
    description: hero.intro,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: hero.intro,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
  // Search Console verification goes here if you use the HTML-tag method:
  //   verification: { google: "<token from Search Console>" },
  // Prefer the DNS TXT method instead. It verifies a *Domain* property, which
  // covers the apex, www, http and https in one — and that split is exactly
  // the problem here — whereas the tag only ever verifies one URL prefix.
};

// One colour, not a pair keyed to the system preference: blue is the default
// for everyone, so the browser chrome should match it on arrival. Nothing here
// tracks the picker — a visitor who chooses another of the four palettes keeps
// blue chrome, which is the same trade the media-query version made in reverse.
export const viewport: Viewport = {
  themeColor: BRAND.blue,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sfPro.variable} ${archivo.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        {/* Must run before the first paint, so they are inlined rather than bundled. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: introInitScript }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-pill focus:bg-accent focus:px-5 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-ink"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <IntroProvider>
            <SmoothScroll />
            <div className="grain" aria-hidden />
            <Nav />
            <main id="main">{children}</main>
          </IntroProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
