import { getClientConfig } from "@/lib/client-config";
import Link from "next/link";
import Image from "next/image";
import { Users, Bed, Check, Shield } from "lucide-react";

export default function RoomsListPage() {
  const { rooms, policies } = getClientConfig();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Accommodations & Room Types</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Direct bookings include free cancellation and transparent tariffs with no hidden markups.
        </p>
      </div>

      <div className="space-y-6">
        {rooms.map((room) => {
          const fallbackImage =
            room.images && room.images.length > 0
              ? room.images[0]
              : "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80";

          return (
            <div
              key={room.id}
              className="bg-white border border-neutral-200 rounded overflow-hidden flex flex-col md:flex-row shadow-sm"
            >
              <div className="relative md:w-72 h-52 md:h-auto bg-neutral-100 shrink-0">
                <Image
                  src={fallbackImage}
                  alt={room.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 mb-2">
                    <div>
                      <h2 className="text-lg font-bold text-neutral-900">{room.name}</h2>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" /> Max {room.maxGuests} guests
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5" /> {room.bed}
                        </span>
                        <span>•</span>
                        <span>{room.sizeSqFt} sq ft</span>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-xl font-bold text-neutral-900">₹{room.basePrice}</span>
                      <span className="text-xs text-neutral-500 block">
                        + ₹{room.taxPerNight} tax / night
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                    {room.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {room.amenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[11px] bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded border border-neutral-200"
                      >
                        <Check className="w-3 h-3 text-neutral-600" /> {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                    <Shield className="w-3.5 h-3.5" />
                    <span>{policies.cancellation}</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Link
                      href={`/rooms/${room.slug}`}
                      className="text-xs underline text-neutral-700 hover:text-black py-2 px-1"
                    >
                      Room details
                    </Link>
                    <Link
                      href={`/book?room=${room.id}`}
                      className="flex-1 sm:flex-initial text-center px-4 py-2 text-white font-medium text-xs rounded transition"
                      style={{ backgroundColor: "var(--color-accent)" }}
                    >
                      Book this room
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
