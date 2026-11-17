"use client";

import React, { useState } from "react";
import { siteContent } from "@/config/siteContent";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

export function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const reviews = siteContent.reviews.items;

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % reviews.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  const current = reviews[currentIndex];

  return (
    <section className="py-20 md:py-28 bg-satin border-y border-pebble-grey px-6 md:px-12 lg:px-16" aria-label="Guest Testimonials">
      <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-cream border border-pebble-grey flex items-center justify-center text-vg-30 mb-8">
          <Quote className="w-6 h-6 fill-vg-30/20" />
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1.5 mb-6">
          {[...Array(current.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-vg-40 text-vg-40" />
          ))}
        </div>

        {/* Dynamic Quote */}
        <blockquote className="min-h-[160px] md:min-h-[140px] flex items-center justify-center">
          <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-mb-10 font-normal leading-relaxed italic max-w-3xl transition-opacity duration-300">
            &ldquo;{current.quote}&rdquo;
          </p>
        </blockquote>

        {/* Guest Name & Origin */}
        <div className="mt-8">
          <div className="font-serif text-lg text-mb-10 font-semibold">{current.guest}</div>
          <div className="text-xs uppercase tracking-widest text-vg-30 font-mono mt-0.5">{current.origin}</div>
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center gap-4">
          <button
            onClick={handlePrev}
            aria-label="Previous Review"
            className="p-3 rounded-full border border-pebble-grey hover:border-mb-10 transition-colors text-mb-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-mb-30">
            0{currentIndex + 1} / 0{reviews.length}
          </span>
          <button
            onClick={handleNext}
            aria-label="Next Review"
            className="p-3 rounded-full border border-pebble-grey hover:border-mb-10 transition-colors text-mb-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
