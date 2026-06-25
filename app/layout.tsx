import type { Metadata, Viewport } from "next";
import { Titillium_Web, Roboto_Slab, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";
import { AdmissionChat } from "@/components/ai/AdmissionChat";
import { ConditionalChrome } from "@/components/layout/ConditionalChrome";
import { SITE_FULL_NAME, SITE_LOCATION, SITE_TAGLINE_EN, SITE_URL } from "@/lib/utils/constants";

const titillium = Titillium_Web({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-body",
  display: "swap",
});
const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-heading",
  display: "swap",
});
const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["500", "600", "700"],
  variable: "--font-devanagari",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D2660",
};

export const metadata: Metadata = {
  title: {
    default: `${SITE_FULL_NAME}, ${SITE_LOCATION}`,
    template: `%s | ${SITE_FULL_NAME}, Narayanpur`,
  },
  description: `${SITE_FULL_NAME}, Narayanpur, Chhattisgarh — A branch centre of Ramakrishna Math & Mission, Belur Math. ${SITE_TAGLINE_EN}. Serving the Abujhmaria tribal community since 1985.`,
  metadataBase: new URL(SITE_URL),
  keywords: ["Ramakrishna Mission", "Narayanpur", "Chhattisgarh", "tribal education", "RKM", "Vivekananda", "Belur Math", "Abujhmarh"],
  openGraph: {
    title: `${SITE_FULL_NAME}, ${SITE_LOCATION}`,
    description: SITE_TAGLINE_EN,
    type: "website",
  },
  alternates: {
    types: {
      "application/rss+xml": `${SITE_URL.replace(/\/$/, "")}/news/feed`,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${titillium.variable} ${robotoSlab.variable} ${notoDevanagari.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased bg-[#FFFDF9] text-base sm:text-[17px]">
        <a href="#main" className="skip-link">Skip to content</a>
        <ConditionalChrome
          header={<Header />}
          footer={<Footer />}
          chat={<AdmissionChat />}
        >
          <main id="main" className="flex-1">
            {children}
          </main>
        </ConditionalChrome>
        <ScrollToTop />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
