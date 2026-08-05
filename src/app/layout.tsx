import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { site, hero } from "@/content/site";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { Nav } from "@/components/ui/nav";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { IntroProvider } from "@/components/ui/intro";
import { themeInitScript } from "@/lib/theme";
import { introInitScript } from "@/lib/intro";
import "./globals.css";

/**
 * One family does the whole site, the way a campaign does it: the poster, the
 * yard sign and the fine print are all the same voice, just pushed to different
 * extremes. Archivo is a grotesque cut for exactly that — its `wdth` axis is
 * loaded so the wordmark and headlines can be widened into painted signage
 * instead of sitting at the polite default width.
 */
const archivo = Archivo({
  variable: "--font-sans-var",
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
  description: hero.intro,
  keywords: [
    site.name,
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
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff7df" },
    { media: "(prefers-color-scheme: dark)", color: "#153d8a" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        {/* Must run before the first paint, so they are inlined rather than bundled. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: introInitScript }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:bg-accent focus:px-5 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-ink"
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
