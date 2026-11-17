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
  const { config } = getClientConfig();
  const isDemo = process.env.DEMO_MODE === "true";

  const themePrimary = config.theme?.primary || "#b45309";
  const themeAccent = config.theme?.accent || config.theme?.primary || "#b45309";
  const themeBg = config.theme?.background || "#ffffff";
  const themeInk = config.theme?.ink || "#1c1917";
  const fontHeading = config.theme?.fontHeading || "system-ui, sans-serif";
  const fontBody = config.theme?.fontBody || "system-ui, sans-serif";

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
