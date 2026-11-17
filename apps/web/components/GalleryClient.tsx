"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Eye } from "lucide-react";

export interface GalleryItem {
  id: string;
  url: string;
  category: "all" | "rooms" | "property" | "nearby";
  title: string;
  description?: string;
}

interface GalleryClientProps {
  hotelName: string;
  items: GalleryItem[];
}

export function GalleryClient({ items }: GalleryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const filteredItems = items.filter(
    (item) => selectedCategory === "all" || item.category === selectedCategory
  );

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setActiveLightboxIndex(null);
  }, []);

  const showNext = useCallback(() => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) => (prev! + 1) % filteredItems.length);
  }, [activeLightboxIndex, filteredItems.length]);

  const showPrev = useCallback(() => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) =>
      prev! === 0 ? filteredItems.length - 1 : prev! - 1
    );
  }, [activeLightboxIndex, filteredItems.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activeLightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLightboxIndex, closeLightbox, showNext, showPrev]);

  const categories = [
    { key: "all", label: "All Photos" },
    { key: "rooms", label: "Rooms & Suites" },
    { key: "property", label: "Property & Amenities" },
    { key: "nearby", label: "Old Town & Nearby" }
  ];

  return (
    <div>
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              setSelectedCategory(cat.key);
              setActiveLightboxIndex(null);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              selectedCategory === cat.key
                ? "bg-stone-900 text-white shadow-sm"
                : "bg-stone-100 hover:bg-stone-200 text-stone-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-stone-500 text-xs">
          No photos found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className="group relative h-64 overflow-hidden rounded-2xl bg-stone-100 border border-stone-200 cursor-pointer shadow-sm"
            >
              <Image
                src={item.url}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  {item.category}
                </span>
                <p className="text-xs font-semibold">{item.title}</p>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-stone-200">
                  <Eye className="w-3.5 h-3.5" /> View Photo
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Basic Accessible Lightbox */}
      {activeLightboxIndex !== null && filteredItems[activeLightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image Preview"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-2 text-white hover:text-stone-300 bg-white/10 hover:bg-white/20 rounded-full transition"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous button */}
          <button
            onClick={showPrev}
            className="absolute left-4 z-50 p-3 text-white hover:text-stone-300 bg-white/10 hover:bg-white/20 rounded-full transition"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next button */}
          <button
            onClick={showNext}
            className="absolute right-4 z-50 p-3 text-white hover:text-stone-300 bg-white/10 hover:bg-white/20 rounded-full transition"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox content */}
          <div className="max-w-4xl max-h-[85vh] w-full flex flex-col items-center">
            <div className="relative w-full h-[60vh] sm:h-[70vh] rounded-xl overflow-hidden">
              <Image
                src={filteredItems[activeLightboxIndex].url}
                alt={filteredItems[activeLightboxIndex].title}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-3 text-center text-white">
              <p className="text-sm font-semibold">
                {filteredItems[activeLightboxIndex].title}
              </p>
              <p className="text-xs text-stone-400">
                {activeLightboxIndex + 1} of {filteredItems.length} • Use left/right arrow keys or Esc to close
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
