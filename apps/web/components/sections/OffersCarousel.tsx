"use client";

import React from "react";
import { siteContent } from "@/config/siteContent";
import { useUI } from "@/context/UIContext";
import { Tag, ArrowRight } from "lucide-react";

export function OffersCarousel() {
  const { openBooking } = useUI();
  const offers = siteContent.offers.items;

  return (
    <section className="py-20 md:py-28 bg-cream px-6 md:px-12 lg:px-16" aria-label="Curated Privilege Offers">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-vg-30 font-mono block mb-2">
              {siteContent.offers.overline}
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-mb-10">
              {siteContent.offers.title}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-mb-20 max-w-xl font-sans leading-relaxed">
              {siteContent.offers.description}
            </p>
          </div>

          <button
            onClick={() => openBooking("sleep")}
            className="text-xs uppercase tracking-widest font-semibold text-vg-30 hover:text-vg-40 flex items-center gap-2 group"
          >
            <span>View All Packages</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3-Card Offer Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-satin rounded-2xl overflow-hidden border border-pebble-grey shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vg-30 text-white text-[11px] font-mono uppercase tracking-wider font-semibold shadow-md">
                    <Tag className="w-3 h-3" /> {offer.badge}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] uppercase font-mono tracking-wider text-mb-30 block mb-1">
                    {offer.validity}
                  </span>
                  <h3 className="font-serif text-2xl text-mb-10 group-hover:text-vg-30 transition-colors">
                    {offer.title}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm text-mb-20 font-sans leading-relaxed">
                    {offer.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-pebble-grey">
                  <button
                    onClick={() => openBooking("sleep")}
                    className="w-full py-3 rounded-full bg-cream hover:bg-vg-30 text-mb-10 hover:text-white font-sans text-xs uppercase tracking-widest font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>{offer.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
