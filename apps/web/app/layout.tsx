import { getClientConfig } from "@/lib/client-config";
import "./globals.css";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { config } = getClientConfig();

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --color-primary: ${config.primaryColor || "#b45309"};
            }
          `
        }} />
      </head>
      <body className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
        {/* Demo Banner */}
        <div className="bg-amber-800 text-amber-50 px-4 py-1.5 text-xs flex justify-between items-center text-center">
          <span className="mx-auto font-medium">
            Demo Showcase for: <strong>{config.name}</strong> • Direct Booking Saves 18% OTA Commission
          </span>
          <Link href="/owner" className="underline font-semibold hover:text-white shrink-0">
            Owner Portal (PIN: 1234)
          </Link>
        </div>

        {/* Global Header */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="font-serif text-xl font-bold text-amber-900">
              {config.name}
            </Link>
            <nav className="hidden md:flex space-x-6 text-sm font-medium text-stone-700">
              <Link href="/rooms" className="hover:text-amber-800 transition">Rooms</Link>
              <Link href="/gallery" className="hover:text-amber-800 transition">Gallery</Link>
              <Link href="/location" className="hover:text-amber-800 transition">Location</Link>
              <Link href="/policies" className="hover:text-amber-800 transition">Policies</Link>
              <Link href="/faq" className="hover:text-amber-800 transition">FAQ</Link>
              <Link href="/my-booking" className="hover:text-amber-800 transition">My Booking</Link>
            </nav>
            <Link
              href="/book"
              className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              Book Stay
            </Link>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        {/* Floating WhatsApp Action Button */}
        <a
          href={`https://wa.me/${config.contact.whatsapp?.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-lg flex items-center justify-center transition"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </a>

        {/* Global Footer */}
        <footer className="bg-stone-900 text-stone-400 py-10 border-t border-stone-800 text-xs">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <h4 className="text-white font-serif font-bold text-base mb-1">{config.name}</h4>
              <p className="text-stone-400 max-w-sm">{config.tagline}</p>
              <p className="mt-2">{config.contact.address}</p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-2">Explore</h5>
              <ul className="space-y-1">
                <li><Link href="/rooms" className="hover:underline">Rooms & Rates</Link></li>
                <li><Link href="/gallery" className="hover:underline">Photo Gallery</Link></li>
                <li><Link href="/policies" className="hover:underline">Guest Policies</Link></li>
                <li><Link href="/legal" className="hover:underline">Legal & Refunds</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-2">Direct Contact</h5>
              <p>📞 {config.contact.phone}</p>
              <p>✉️ {config.contact.email}</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
