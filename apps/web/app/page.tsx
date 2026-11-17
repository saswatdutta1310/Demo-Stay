import { getClientConfig } from "@/lib/client-config";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ShieldCheck, ArrowRight } from "lucide-react";

export default function HomePage() {
  const { config, rooms, content } = getClientConfig();

  // Find Lingaraj Temple from nearby places or fallback
  const templePlace = content.nearbyPlaces?.find((p) =>
    p.name.toLowerCase().includes("lingaraj")
  );

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Section */}
      <section className="bg-neutral-50 border-b border-neutral-200 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span
            className="inline-block px-3 py-1 text-xs font-semibold rounded mb-3 text-white"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            {config.tagline}
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
            {config.name}
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto mb-8">
            {content.about}
          </p>

          {/* Search Form */}
          <div className="bg-white p-4 rounded border border-neutral-300 max-w-2xl mx-auto shadow-sm">
            <form action="/book" method="GET" className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-left">
              <div>
                <label htmlFor="checkIn" className="block text-xs font-semibold text-neutral-700 mb-1">
                  Check-in
                </label>
                <input
                  id="checkIn"
                  name="checkIn"
                  type="date"
                  required
                  defaultValue="2026-12-01"
                  className="w-full text-xs p-2 border border-neutral-300 rounded focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="checkOut" className="block text-xs font-semibold text-neutral-700 mb-1">
                  Check-out
                </label>
                <input
                  id="checkOut"
                  name="checkOut"
                  type="date"
                  required
                  defaultValue="2026-12-03"
                  className="w-full text-xs p-2 border border-neutral-300 rounded focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="guests" className="block text-xs font-semibold text-neutral-700 mb-1">
                  Guests
                </label>
                <select
                  id="guests"
                  name="guests"
                  defaultValue="2"
                  className="w-full text-xs p-2 border border-neutral-300 rounded focus:outline-none bg-white"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 px-3 text-white text-xs font-semibold rounded transition"
                  style={{ backgroundColor: "var(--color-accent)" }}
                >
                  Check Availability
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. Short Section on 8-minute walk to Lingaraj Temple */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="p-6 bg-neutral-50 border border-neutral-200 rounded flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                8-Minute Walk to Lingaraj Temple
              </h2>
              <p className="text-xs text-neutral-600 mt-1">
                Located on Kedar Lane in Old Town, Bhubaneswar. Easy walking distance to {templePlace ? templePlace.name : "Lord Lingaraj Temple"} and nearby heritage shrines.
              </p>
            </div>
          </div>
          <Link
            href="/location"
            className="text-xs font-semibold text-neutral-900 underline hover:no-underline shrink-0 flex items-center gap-1"
          >
            View location details <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 3. Rooms Showcase */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6 border-b border-neutral-200 pb-2">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Room Types & Rates</h2>
            <p className="text-xs text-neutral-500">Carefully curated accommodations with modern amenities</p>
          </div>
          <Link href="/rooms" className="text-xs font-semibold underline text-neutral-800">
            View all rooms →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {rooms.map((room) => {
            const fallbackImage =
              room.images && room.images.length > 0
                ? room.images[0]
                : "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80";

            return (
              <div
                key={room.id}
                className="bg-white border border-neutral-200 rounded overflow-hidden flex flex-col justify-between"
              >
                <div className="relative w-full h-44 bg-neutral-100">
                  <Image
                    src={fallbackImage}
                    alt={room.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                    priority={false}
                  />
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 mb-1">{room.name}</h3>
                    <p className="text-xs text-neutral-500 mb-2">
                      {room.bed} • {room.sizeSqFt} sq ft • Max {room.maxGuests} guests
                    </p>
                    <p className="text-xs text-neutral-600 line-clamp-2">{room.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-neutral-900">₹{room.basePrice}</span>
                      <span className="text-[11px] text-neutral-500"> / night</span>
                    </div>
                    <Link
                      href={`/rooms/${room.slug}`}
                      className="text-xs font-medium underline text-neutral-800 hover:text-black"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Book Direct Note */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="p-4 bg-neutral-100 border border-neutral-300 rounded flex items-center gap-3 text-xs text-neutral-800">
          <ShieldCheck className="w-5 h-5 shrink-0 text-neutral-700" />
          <p>
            <strong>Book direct on this website:</strong> Guaranteed lowest tariff with no third-party convenience surcharges, instant reservation confirmation, and personalized communication with the host.
          </p>
        </div>
      </section>
    </div>
  );
}
