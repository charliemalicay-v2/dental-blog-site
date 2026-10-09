import type { Metadata } from "next";
import { Archivo, Hind_Guntur, Shippori_Antique } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { PRACTICE, SITE } from "@/lib/constants";
import "./globals.css";

/**
 * Font mapping — see DESIGN-FINDINGS.md § Typography.
 * Archivo substitutes for the source site's commercial Quartage; the body
 * and watermark faces match exactly.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const hindGuntur = Hind_Guntur({
  variable: "--font-hind-guntur",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const shippori = Shippori_Antique({
  variable: "--font-shippori",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: PRACTICE.name,
  url: PRACTICE.url,
  telephone: PRACTICE.phone,
  sameAs: [...PRACTICE.sameAs],
  address: {
    "@type": "PostalAddress",
    streetAddress: PRACTICE.address.street,
    addressLocality: PRACTICE.address.city,
    addressRegion: PRACTICE.address.region,
    postalCode: PRACTICE.address.postalCode,
    addressCountry: PRACTICE.address.country,
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    url: SITE.url,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${hindGuntur.variable} ${shippori.variable} h-full scroll-smooth`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd data={orgJsonLd} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
