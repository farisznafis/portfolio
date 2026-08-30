import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Noto_Sans_JP, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { ContextCursor } from "./components/ContextCursor";
import { IntroProvider } from "./components/Loader";
import { LenisProvider } from "./motion/LenisProvider";
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
    default: "Faris Zaidan Nafis | Software Engineer — Frontend, UI/UX & AI",
    template: "%s | Faris Zaidan Nafis",
  },
  description:
    "Portfolio of Faris Zaidan Nafis, a software engineer in Kumamoto, Japan working across frontend, UI/UX, and AI — from user flows to shipped products.",
  openGraph: {
    title: "Faris Zaidan Nafis | Software Engineer — Frontend, UI/UX & AI",
    description:
      "Software engineer in Kumamoto, Japan working across frontend, UI/UX, and AI.",
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
      <body className="grain">
        <LanguageProvider>
          <LenisProvider>
            <IntroProvider>
              <a href="#main" className="skip-link">
                Skip to content
              </a>
              <ContextCursor />
              <Navbar />
              <main id="main" className="relative">
                {children}
              </main>
            </IntroProvider>
          </LenisProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
