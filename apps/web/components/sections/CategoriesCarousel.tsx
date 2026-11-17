"use client";

import React, { useState, useEffect, useRef } from "react";
import { siteContent } from "@/config/siteContent";
import { useUI } from "@/context/UIContext";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export function CategoriesCarousel() {
  const { setCursor, resetCursor, openBooking } = useUI();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const categories = siteContent.categories;
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const duration = 6000; // 6 seconds per slide
  const step = 50;

  useEffect(() => {
    // Reset progress
    setProgress(0);

    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (autoplayTimerRef.current) clearTimeout(autoplayTimerRef.current);

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => Math.min(100, prev + (step / duration) * 100));
    }, step);

    autoplayTimerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, duration);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (autoplayTimerRef.current) clearTimeout(autoplayTimerRef.current);
    };
  }, [currentIndex, categories.length]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
    setProgress(0);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
    setProgress(0);
  };

  const currentCategory = categories[currentIndex];

  return (
    <section
      id="categories"
      className="relative min-h-[85vh] sm:min-h-screen bg-midnight text-cream flex flex-col justify-between overflow-hidden py-16 sm:py-24"
      onMouseEnter={() => setCursor("Drag")}
      onMouseLeave={resetCursor}
      aria-label="Estate Pillars and Experiences"
    >
      {/* Background Media with Crossfade Transition */}
      <div className="absolute inset-0 z-0">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={cat.bgImage}
              alt={cat.headline}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/50 to-midnight/60" />
          </div>
        ))}
      </div>

      {/* Top Controls: Current Number & Navigation Indicators */}
      <div className="relative z-20 max-w-estate mx-auto w-full px-4 sm:px-8 md:px-12 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="font-serif text-3xl sm:text-4xl text-amber-50 font-normal">
            0{currentIndex + 1}
          </span>
          <span className="font-sans text-xs tracking-widest uppercase text-cream/60">
            / 0{categories.length}
          </span>
        </div>

        {/* Arrow Navigation */}
        <div className="flex items-center space-x-3">
          <button
            onClick={prevSlide}
            className="w-10 h-10 rounded-full border border-cream/30 bg-midnight/40 backdrop-blur-md flex items-center justify-center text-cream hover:bg-terracotta hover:border-terracotta transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 rounded-full border border-cream/30 bg-midnight/40 backdrop-blur-md flex items-center justify-center text-cream hover:bg-terracotta hover:border-terracotta transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slide Card Layout */}
      <div className="relative z-20 max-w-estate mx-auto w-full px-4 sm:px-8 md:px-12 my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Card */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            <span className="inline-block font-sans text-xs uppercase tracking-[0.2em] text-amber-80 font-medium">
              {currentCategory.label}
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-cream tracking-tight leading-[1.1]">
              {currentCategory.title}
            </h2>

            <p className="font-serif italic text-lg sm:text-2xl text-cream/90 font-light">
              &ldquo;{currentCategory.headline}&rdquo;
            </p>

            <p className="font-sans text-sm sm:text-base text-cream/80 max-w-xl leading-relaxed">
              {currentCategory.description}
            </p>

            <div className="pt-2">
              <a
                href={currentCategory.ctaLink}
                onClick={(e) => {
                  if (currentCategory.id === "sleep") {
                    e.preventDefault();
                    openBooking("sleep");
                  } else if (currentCategory.id === "eat") {
                    e.preventDefault();
                    openBooking("eat");
                  } else if (currentCategory.id === "meet") {
                    e.preventDefault();
                    openBooking("meet");
                  }
                }}
                className="inline-flex items-center space-x-2.5 px-7 py-3.5 rounded-full bg-terracotta text-cream font-sans text-xs uppercase tracking-[0.15em] font-semibold hover:bg-cream hover:text-midnight transition-all duration-300 shadow-lg"
              >
                <span>{currentCategory.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Floating Image Inset with Soft Frame */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md sm:max-w-lg aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-cream/20">
              <img
                src={currentCategory.image}
                alt={currentCategory.title}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar & Category Tab Buttons */}
      <div className="relative z-20 max-w-estate mx-auto w-full px-4 sm:px-8 md:px-12 pt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 border-t border-cream/20 pt-4">
          {categories.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => goToSlide(idx)}
              className="text-left group focus-visible:outline-none"
            >
              {/* Progress Line */}
              <div className="w-full h-[2px] bg-cream/20 mb-2 overflow-hidden rounded-full">
                <div
                  className="h-full bg-terracotta transition-all duration-100 ease-linear"
                  style={{
                    width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? "100%" : "0%"
                  }}
                />
              </div>
              <span
                className={`block font-serif text-sm sm:text-base transition-colors ${
                  idx === currentIndex ? "text-cream font-medium" : "text-cream/50 group-hover:text-cream/80"
                }`}
              >
                {cat.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

