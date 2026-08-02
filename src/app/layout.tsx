import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { site, hero } from "@/content/site";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { Nav } from "@/components/ui/nav";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { IntroProvider } from "@/components/ui/intro";
import { themeInitScript } from "@/lib/theme";
import { introInitScript } from "@/lib/intro";
import "./globals.css";

const sans = Geist({ variable: "--font-sans-var", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono-var", subsets: ["latin"] });
const display = Instrument_Serif({
  variable: "--font-display-var",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
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
    { media: "(prefers-color-scheme: light)", color: "#faf9f6" },
    { media: "(prefers-color-scheme: dark)", color: "#08080a" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${display.variable} antialiased`}
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
