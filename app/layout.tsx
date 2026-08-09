import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Noto_Sans_JP, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { CursorGlow } from "./components/CursorGlow";
import { Footer } from "./components/Footer";
import { LanguageProvider } from "./lib/i18n";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "Faris Znafis | Creative Frontend Engineer",
    template: "%s | Faris Znafis",
  },
  description:
    "Portfolio of Faris Znafis, a creative frontend engineer crafting interactive, high-performance web experiences with Next.js, motion design, and 3D.",
  openGraph: {
    title: "Faris Znafis | Creative Frontend Engineer",
    description:
      "Interactive, high-performance web experiences with Next.js, motion design, and 3D.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${notoSansJP.variable}`}
    >
      <body>
        <LanguageProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <CursorGlow />
          <Navbar />
          <main id="main" className="relative">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
