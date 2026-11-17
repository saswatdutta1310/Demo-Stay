import { getClientConfig } from "@/lib/client-config";
import { MapPin, Navigation, ExternalLink, Compass } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { config } = getClientConfig();
  return {
    title: `Location & Directions | ${config.name}`,
    description: `Find ${config.name} at ${config.contact.address || config.location?.address}. Just 8 minutes walk from Lingaraj Temple, Bhubaneswar.`
  };
}

export default function LocationPage() {
  const { config, content } = getClientConfig();

  const googleMapsKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ||
    process.env.GOOGLE_MAPS_KEY ||
    "";

  const lat = config.location?.lat || 20.2444;
  const lng = config.location?.lng || 85.8358;
  const address = config.contact.address || config.location?.address || "";

  // Direct directions link using coords / address
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    address || `${lat},${lng}`
  )}`;

  // Direct map view link
  const fallbackMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address || `${lat},${lng}`
  )}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center max-w-lg mx-auto mb-10">
        <h1 className="text-3xl font-serif font-bold text-stone-900">
          Location & Key Landmarks
        </h1>
        <p className="text-xs text-stone-500 mt-2">
          Conveniently situated in the historic Old Town district of Bhubaneswar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Address, Directions CTA, Nearby Places */}
        <div className="lg:col-span-6 space-y-6">
          {/* Address Box */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
              Property Address
            </h2>
            <div className="flex items-start gap-2 text-xs text-stone-700 leading-relaxed mb-4">
              <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <span>{address}</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5" /> Get Directions
              </a>
              <a
                href={fallbackMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open in Google Maps
              </a>
            </div>
          </div>

          {/* Nearby Distances from content.json */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Compass className="w-4 h-4 text-amber-800" />
              <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Distances to Key Attractions & Transit
              </h2>
            </div>

            <div className="space-y-2.5">
              {content.nearbyPlaces.map((place, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs bg-stone-50 hover:bg-stone-100/70 p-3 rounded-xl border border-stone-100 transition"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-stone-800">{place.name}</span>
                    {place.type && (
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                        {place.type}
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                    {place.distance}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Google Maps Embed or Fallback */}
        <div className="lg:col-span-6">
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700">Map View</span>
              <span className="text-[11px] font-mono text-stone-400">
                {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
              </span>
            </div>

            {googleMapsKey ? (
              <iframe
                title="Google Maps Location"
                width="100%"
                height="450"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsKey}&q=${encodeURIComponent(
                  address || `${lat},${lng}`
                )}&center=${lat},${lng}&zoom=15`}
              />
            ) : (
              <div className="h-[420px] bg-stone-100 flex flex-col items-center justify-center p-6 text-center">
                <MapPin className="w-10 h-10 text-amber-800 mb-3 opacity-80" />
                <h3 className="font-serif font-bold text-stone-800 text-sm mb-1">
                  Interactive Map View
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mb-4">
                  Google Maps API key is currently not configured in this demo environment. You can explore the location directly on Google Maps.
                </p>
                <a
                  href={fallbackMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" /> View Location on Google Maps
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
