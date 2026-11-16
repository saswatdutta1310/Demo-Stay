import { getClientConfig } from "@/lib/client-config";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ArrowLeft } from "lucide-react";

export default function SingleRoomPage({ params }: { params: { slug: string } }) {
  const { rooms } = getClientConfig();
  const room = rooms.find((r) => r.slug === params.slug);

  if (!room) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/rooms" className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to all rooms
      </Link>

      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 bg-stone-100">
          {room.images.map((img, i) => (
            <div key={i} className="h-64 overflow-hidden rounded-lg">
              <img src={img} alt={room.name} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <div className="p-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-stone-100 pb-6 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">{room.name}</h1>
              <p className="text-xs text-stone-500 mt-1">Bedding: {room.bedType} • Max: {room.capacity} Guests</p>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-3xl font-bold text-stone-900">₹{room.price}</span>
                <span className="text-xs text-stone-500 block">/ night + 12% GST</span>
              </div>
              <Link
                href={`/book?room=${room.id}`}
                className="px-6 py-3 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-sm font-semibold transition shadow-sm"
              >
                Reserve Now
              </Link>
            </div>
          </div>

          <h3 className="font-semibold text-stone-900 mb-2">Description</h3>
          <p className="text-stone-600 text-sm leading-relaxed mb-6">{room.description}</p>

          <h3 className="font-semibold text-stone-900 mb-3">Room Amenities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {room.amenities.map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
