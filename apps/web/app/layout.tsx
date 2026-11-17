import { getClientConfig } from "@/lib/client-config";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DemoBanner } from "@/components/DemoBanner";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { config } = getClientConfig();
  const isDemo = process.env.DEMO_MODE === "true";

  return {
    title: `${config.name} | ${config.tagline}`,
    description: `Official direct booking site for ${config.name}. ${config.tagline}`,
    robots: isDemo
      ? {
          index: false,
          follow: false
        }
      : {
          index: true,
          follow: true
        }
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { config, rooms } = getClientConfig();
  const isDemo = process.env.DEMO_MODE === "true";

  const themePrimary = config.theme?.primary || "#b45309";
  const themeAccent = config.theme?.accent || config.theme?.primary || "#b45309";
  const themeBg = config.theme?.background || "#ffffff";
  const themeInk = config.theme?.ink || "#1c1917";
  const fontHeading = config.theme?.fontHeading || "system-ui, sans-serif";
  const fontBody = config.theme?.fontBody || "system-ui, sans-serif";

  const minPrice = rooms.length > 0 ? Math.min(...rooms.map((r) => r.basePrice)) : 2000;
  const maxPrice = rooms.length > 0 ? Math.max(...rooms.map((r) => r.basePrice)) : 3500;

  // Schema.org Hotel JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": config.name,
    "description": config.tagline,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": config.contact.address || config.location?.address,
      "addressLocality": "Bhubaneswar",
      "postalCode": "751002",
      "addressRegion": "Odisha",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": config.location?.lat || 20.2444,
      "longitude": config.location?.lng || 85.8358
    },
    "telephone": config.contact.phone,
    "email": config.contact.email,
    "priceRange": `₹${minPrice} - ₹${maxPrice}`,
    "checkinTime": "10:30",
    "checkoutTime": "11:00",
    "petsAllowed": false
  };

  return (
    <html lang="en">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --color-primary: ${themePrimary};
                --color-accent: ${themeAccent};
                --color-bg: ${themeBg};
                --color-ink: ${themeInk};
                --font-heading: ${fontHeading};
                --font-body: ${fontBody};
              }
            `
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans">
        {isDemo && <DemoBanner hotelName={config.name} />}
        <Header name={config.name} />
        <main className="flex-1">{children}</main>
        <Footer
          name={config.name}
          address={config.contact.address || config.location?.address || ""}
          phone={config.contact.phone}
          email={config.contact.email}
        />
      </body>
    </html>
  );
}
