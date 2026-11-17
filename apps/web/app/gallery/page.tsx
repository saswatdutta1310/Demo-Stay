import { getClientConfig } from "@/lib/client-config";
import { GalleryClient, GalleryItem } from "@/components/GalleryClient";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { config } = getClientConfig();
  return {
    title: `Photo Gallery | ${config.name}`,
    description: `Explore photos of rooms, suites, amenities, and nearby heritage landmarks around ${config.name}.`
  };
}

export default function GalleryPage() {
  const { config, rooms } = getClientConfig();

  // Curate gallery items from room images and property landmarks
  const items: GalleryItem[] = [];

  rooms.forEach((room, rIdx) => {
    room.images.forEach((img, iIdx) => {
      items.push({
        id: `room-${rIdx}-${iIdx}`,
        url: img,
        category: "rooms",
        title: `${room.name} (View ${iIdx + 1})`,
        description: `${room.sizeSqFt} sq ft • ${room.bed}`
      });
    });
  });

  // Add property ambience images
  items.push({
    id: "prop-1",
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    category: "property",
    title: `${config.name} - Front Courtyard & Lobby`,
    description: "Serene ambience in historic Old Town"
  });
  items.push({
    id: "prop-2",
    url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
    category: "property",
    title: "Reception & Hospitality Desk",
    description: "24/7 guest assistance and local guidance"
  });

  // Add nearby landmarks
  items.push({
    id: "nearby-1",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    category: "nearby",
    title: "Lingaraj Temple Old Town (8 min walk)",
    description: "Architectural jewel of 11th-century Kalinga architecture"
  });
  items.push({
    id: "nearby-2",
    url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    category: "nearby",
    title: "Bindu Sagar Lake & Heritage Ghats",
    description: "Peaceful early morning strolls around the holy lake"
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center max-w-lg mx-auto mb-10">
        <h1 className="text-3xl font-serif font-bold text-stone-900">
          Property & Room Gallery
        </h1>
        <p className="text-xs text-stone-500 mt-2">
          Explore the peaceful atmosphere, guest rooms, and sacred Old Town surroundings of {config.name}.
        </p>
      </div>

      <GalleryClient hotelName={config.name} items={items} />
    </div>
  );
}
