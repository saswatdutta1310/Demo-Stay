import { getClientConfig } from "@/lib/client-config";
import Link from "next/link";
import { BedDouble, Sparkles, MapPin, ShieldCheck, HeartHandshake } from "lucide-react";

export default function HomePage() {
  const { config, rooms, content } = getClientConfig();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-amber-50 to-white py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="inline-block py-1 px-3 mb-4 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider">
            {config.tagline}
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-stone-900 tracking-tight">
            Welcome to {config.name}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto">
            {content.about}
          </p>

          {/* Search Bar Teaser */}
          <div className="mt-8 bg-white p-4 rounded-2xl shadow-md border border-stone-200 max-w-3xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between text-left">
            <div className="w-full sm:w-auto flex-1">
              <label className="block text-[11px] uppercase font-bold text-stone-500">Check-In</label>
              <input type="date" className="w-full text-xs font-semibold text-stone-800 focus:outline-none" defaultValue="2026-12-01" />
            </div>
            <div className="w-full sm:w-auto flex-1 border-t sm:border-t-0 sm:border-l sm:pl-4 border-stone-200">
              <label className="block text-[11px] uppercase font-bold text-stone-500">Check-Out</label>
              <input type="date" className="w-full text-xs font-semibold text-stone-800 focus:outline-none" defaultValue="2026-12-03" />
            </div>
            <div className="w-full sm:w-auto flex-1 border-t sm:border-t-0 sm:border-l sm:pl-4 border-stone-200">
              <label className="block text-[11px] uppercase font-bold text-stone-500">Guests</label>
              <select className="w-full text-xs font-semibold text-stone-800 focus:outline-none bg-transparent">
                <option>2 Adults, 0 Children</option>
                <option>1 Adult</option>
                <option>3 Adults</option>
                <option>4 Adults (Family Suite)</option>
              </select>
            </div>
            <Link
              href="/book"
              className="w-full sm:w-auto px-6 py-3 bg-amber-800 hover:bg-amber-900 text-white font-medium text-xs rounded-xl shadow-sm transition text-center shrink-0"
            >
              Check Availability
            </Link>
          </div>
        </div>
      </section>

      {/* Why Book Direct Banner */}
      <section className="py-8 bg-amber-900 text-white">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <span className="text-xs font-medium">Guaranteed Best Rate (No OTA markups)</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span className="text-xs font-medium">Instant Digital Booking Voucher</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <HeartHandshake className="w-5 h-5 text-amber-300" />
            <span className="text-xs font-medium">Direct WhatsApp Support with Owner</span>
          </div>
        </div>
      </section>

      {/* Rooms Showcase */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">Featured Accommodations</h2>
          <p className="text-xs text-stone-500 mt-1">Carefully furnished rooms designed for ultimate rest</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="h-44 bg-stone-100 overflow-hidden">
                <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-stone-900 text-base">{room.name}</h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">{room.description}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-stone-900">₹{room.price}</span>
                    <span className="text-[11px] text-stone-500"> / night</span>
                  </div>
                  <Link
                    href={`/rooms/${room.slug}`}
                    className="text-xs font-semibold text-amber-800 hover:text-amber-900"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
