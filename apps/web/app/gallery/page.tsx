import { getClientConfig } from "@/lib/client-config";

export default function GalleryPage() {
  const { config, rooms } = getClientConfig();
  const allImages = rooms.flatMap((r) => r.images);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center max-w-lg mx-auto mb-10">
        <h1 className="text-3xl font-serif font-bold text-stone-900">Property & Room Gallery</h1>
        <p className="text-xs text-stone-500 mt-2">Explore the peaceful atmosphere and pristine rooms of {config.name}.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {allImages.map((img, i) => (
          <div key={i} className="h-60 overflow-hidden rounded-xl bg-stone-100 shadow-sm">
            <img src={img} alt="Property photo" className="w-full h-full object-cover hover:scale-105 transition duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}
