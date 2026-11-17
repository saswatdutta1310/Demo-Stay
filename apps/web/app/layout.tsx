import "./globals.css";
import type { Metadata } from "next";
import { siteContent } from "@/config/siteContent";
import { UIProvider } from "@/context/UIContext";
import { SmoothScroll } from "@/components/global/SmoothScroll";
import { Preloader } from "@/components/global/Preloader";
import { CustomCursor } from "@/components/global/CustomCursor";
import { Header } from "@/components/global/Header";
import { NavOverlay } from "@/components/global/NavOverlay";
import { BookingDrawer } from "@/components/global/BookingDrawer";
import { WalkthroughModal } from "@/components/global/WalkthroughModal";
import { Footer } from "@/components/global/Footer";

export const metadata: Metadata = {
  title: `${siteContent.brand.name} | ${siteContent.brand.subname} in ${siteContent.brand.location}`,
  description: siteContent.hero.subtitle,
  keywords: [
    "The Vineyard Heritage Hotel",
    "Cape Town Luxury Hotel",
    "Newlands Cape Town Accommodations",
    "Table Mountain Hotel",
    "Vineyard Estate & Spa",
    "Boutique Hotel South Africa"
  ],
  openGraph: {
    title: `${siteContent.brand.name} | ${siteContent.brand.location}`,
    description: siteContent.hero.subtitle,
    url: "https://vineyard.co.za",
    siteName: siteContent.brand.name,
    images: [
      {
        url: siteContent.hero.bgImage,
        width: 1200,
        height: 630,
        alt: siteContent.brand.name
      }
    ],
    locale: "en_ZA",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Schema.org Hotel JSON-LD structured data for luxury hotel SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: siteContent.brand.name,
    description: siteContent.hero.subtitle,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteContent.brand.contact.address,
      addressLocality: "Cape Town",
      postalCode: "7700",
      addressRegion: "Western Cape",
      addressCountry: "ZA"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -33.9806,
      longitude: 18.4593
    },
    telephone: siteContent.brand.contact.phone,
    email: siteContent.brand.contact.email,
    priceRange: "$$$$",
    starRating: {
      "@type": "Rating",
      ratingValue: "5"
    }
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..600;1,300..600&family=Marcellus&family=Plus+Jakarta+Sans:wght@300..700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-cream text-midnight antialiased selection:bg-terracotta selection:text-cream">
        <UIProvider>
          <SmoothScroll>
            {/* Splash intro preloader */}
            <Preloader />

            {/* Custom follower cursor */}
            <CustomCursor />

            {/* Sticky Header with 120px -> 64px scroll transformation */}
            <Header />

            {/* Fullscreen Navigation Drawer */}
            <NavOverlay />

            {/* 3-Mode Booking Drawer (Sleep / Eat / Meet) */}
            <BookingDrawer />

            {/* 3D Walkthrough Panorama Modal for Grounds Map */}
            <WalkthroughModal />

            {/* Main Content */}
            {children}

            {/* Curtain Parallax Footer */}
            <Footer />
          </SmoothScroll>
        </UIProvider>
      </body>
    </html>
  );
}
