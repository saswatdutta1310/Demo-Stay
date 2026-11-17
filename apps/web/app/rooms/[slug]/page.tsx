import { getClientConfig } from "@/lib/client-config";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, ArrowLeft, Users, Bed, Square, Shield } from "lucide-react";

export default function SingleRoomPage({ params }: { params: { slug: string } }) {
  const { rooms, policies } = getClientConfig();
  const room = rooms.find((r) => r.slug === params.slug);

  if (!room) notFound();

  const totalPerNight = room.basePrice + room.taxPerNight;
  const images = room.images && room.images.length > 0 ? room.images : [
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80"
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link
        href="/rooms"
        className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 rounded p-1"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to all rooms
      </Link>

      <div className="bg-white border border-neutral-200 rounded overflow-hidden shadow-sm">
        {/* Image Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 bg-neutral-100">
          {images.map((img, i) => (
            <div key={i} className="relative h-64 sm:h-72 bg-neutral-200 rounded overflow-hidden">
              <Image
                src={img}
                alt={`${room.name} image ${i + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header & Pricing */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 border-b border-neutral-200 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">{room.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 mt-2">
                <span className="flex items-center gap-1.5">
                  <Square className="w-3.5 h-3.5 text-neutral-500" /> {room.sizeSqFt} sq ft
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Bed className="w-3.5 h-3.5 text-neutral-500" /> {room.bed}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-neutral-500" /> Max {room.maxGuests} guests
                </span>
              </div>
            </div>

            <div className="sm:text-right bg-neutral-50 p-4 rounded border border-neutral-200 shrink-0">
              <div className="text-2xl font-bold text-neutral-900">₹{room.basePrice}</div>
              <div className="text-xs text-neutral-600 mt-0.5">
                + ₹{room.taxPerNight} tax / night
              </div>
              <div className="text-[11px] text-neutral-500 font-medium mt-1">
                Total: ₹{totalPerNight} / night (taxes included)
              </div>
              <Link
                href={`/book?room=${room.id}`}
                className="mt-3 block w-full text-center px-4 py-2 text-white font-medium text-xs rounded transition"
                style={{ backgroundColor: "var(--color-accent)" }}
              >
                Book this room
              </Link>
            </div>
          </div>

          {/* Cancellation Notice */}
          <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded flex items-center gap-2.5 text-xs text-neutral-800">
            <Shield className="w-4 h-4 shrink-0 text-neutral-600" />
            <span>
              <strong>Cancellation Policy:</strong> {policies.cancellation}
            </span>
          </div>

          {/* Description */}
          {room.description && (
            <div>
              <h2 className="text-sm font-bold text-neutral-900 mb-2">Room Overview</h2>
              <p className="text-xs text-neutral-700 leading-relaxed">
                {room.description}
              </p>
            </div>
          )}

          {/* Amenities */}
          <div>
            <h2 className="text-sm font-bold text-neutral-900 mb-3">Amenities & Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {room.amenities.map((amenity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-neutral-700 bg-neutral-50 p-2.5 rounded border border-neutral-200"
                >
                  <Check className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
