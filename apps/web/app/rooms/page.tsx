import { getClientConfig } from "@/lib/client-config";
import Link from "next/link";
import { Users, Bed, Check } from "lucide-react";

export default function RoomsListPage() {
  const { rooms } = getClientConfig();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center max-w-lg mx-auto mb-10">
        <h1 className="text-3xl font-serif font-bold text-stone-900">All Accommodations</h1>
        <p className="text-xs text-stone-500 mt-2">Transparent rates, modern comfort, and authentic hospitality.</p>
      </div>

      <div className="space-y-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row">
            <div className="md:w-72 h-56 md:h-auto overflow-hidden bg-stone-100 shrink-0">
              <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-stone-900">{room.name}</h2>
                    <div className="flex items-center gap-4 text-xs text-stone-500 mt-1">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Up to {room.capacity} Guests</span>
                      <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {room.bedType}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-stone-900">₹{room.price}</span>
                    <span className="text-xs text-stone-500 block">/ night + GST</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 mt-3">{room.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {room.amenities.map((a, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-[11px] bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md">
                      <Check className="w-3 h-3 text-emerald-600" /> {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-emerald-700 font-medium">● Instant Confirmation</span>
                <Link
                  href={`/book?room=${room.id}`}
                  className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                >
                  Book This Room
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
