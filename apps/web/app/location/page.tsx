import { getClientConfig } from "@/lib/client-config";
import { MapPin } from "lucide-react";

export default function LocationPage() {
  const { config, content } = getClientConfig();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center max-w-lg mx-auto mb-10">
        <h1 className="text-3xl font-serif font-bold text-stone-900">Location & Attractions</h1>
        <p className="text-xs text-stone-500 mt-2">Conveniently situated near major spiritual and transit hubs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-stone-900 text-sm mb-1">Property Address</h3>
            <p className="text-xs text-stone-600 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              {config.contact.address}
            </p>
          </div>

          <div className="border-t border-stone-100 pt-4">
            <h3 className="font-bold text-stone-900 text-sm mb-3">Distances to Key Places</h3>
            <div className="space-y-3">
              {content.nearbyPlaces.map((place, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-stone-50 p-3 rounded-lg border border-stone-100">
                  <span className="font-medium text-stone-800">{place.name}</span>
                  <span className="text-stone-500 font-mono">{place.distance}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-72 bg-stone-200 border border-stone-300 rounded-2xl flex items-center justify-center text-xs text-stone-500">
          Google Maps Embed View ({config.map.lat}, {config.map.lng})
        </div>
      </div>
    </div>
  );
}
