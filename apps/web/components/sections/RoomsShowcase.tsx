"use client";

import React, { useState } from "react";
import { siteContent } from "@/config/siteContent";
import { useUI } from "@/context/UIContext";
import { ArrowRight, Maximize2, Users, Eye } from "lucide-react";

export function RoomsShowcase() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { openBooking, setCursorVariant, setCursorText } = useUI();

  const rooms = siteContent.rooms.items;
  const filteredRooms =
    selectedFilter === "all"
      ? rooms
      : rooms.filter((r) => r.category.toLowerCase().includes(selectedFilter));

  return (
    <section id="rooms" className="py-20 md:py-28 bg-cream px-6 md:px-12 lg:px-16" aria-label="Suites and Chambers">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-vg-30 font-mono block mb-2">
              {siteContent.rooms.overline}
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-mb-10 font-normal">
              {siteContent.rooms.title}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-mb-20 max-w-xl font-sans leading-relaxed">
              {siteContent.rooms.description}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-4 py-2 rounded-full text-xs font-sans uppercase tracking-wider transition-all ${
                selectedFilter === "all"
                  ? "bg-mb-10 text-white font-semibold"
                  : "bg-satin border border-pebble-grey text-mb-20 hover:text-mb-10"
              }`}
            >
              All Chambers
            </button>
            <button
              onClick={() => setSelectedFilter("courtyard")}
              className={`px-4 py-2 rounded-full text-xs font-sans uppercase tracking-wider transition-all ${
                selectedFilter === "courtyard"
                  ? "bg-mb-10 text-white font-semibold"
                  : "bg-satin border border-pebble-grey text-mb-20 hover:text-mb-10"
              }`}
            >
              Courtyard
            </button>
            <button
              onClick={() => setSelectedFilter("mountain")}
              className={`px-4 py-2 rounded-full text-xs font-sans uppercase tracking-wider transition-all ${
                selectedFilter === "mountain"
                  ? "bg-mb-10 text-white font-semibold"
                  : "bg-satin border border-pebble-grey text-mb-20 hover:text-mb-10"
              }`}
            >
              Mountain Luxury
            </button>
            <button
              onClick={() => setSelectedFilter("family")}
              className={`px-4 py-2 rounded-full text-xs font-sans uppercase tracking-wider transition-all ${
                selectedFilter === "family"
                  ? "bg-mb-10 text-white font-semibold"
                  : "bg-satin border border-pebble-grey text-mb-20 hover:text-mb-10"
              }`}
            >
              Suites
            </button>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              onMouseEnter={() => {
                setCursorVariant("view");
                setCursorText("View");
              }}
              onMouseLeave={() => {
                setCursorVariant("default");
                setCursorText("");
              }}
              className="group bg-satin rounded-2xl overflow-hidden border border-pebble-grey shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
            >
              {/* Image Container with Zoom */}
              <div className="relative aspect-[16/10] overflow-hidden bg-pebble-grey">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-satin/90 backdrop-blur-md text-[11px] font-mono uppercase tracking-wider text-vg-30 font-semibold shadow-sm">
                    {room.category}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="px-3.5 py-1.5 rounded-full bg-mb-10/85 backdrop-blur-md text-white text-xs font-serif shadow-sm">
                    {room.pricePerNight} <span className="text-[10px] text-white/70 font-sans">/ night</span>
                  </span>
                </div>
              </div>

              {/* Room Body Details */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-2xl text-mb-10 group-hover:text-vg-30 transition-colors">
                    {room.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-mb-20 line-clamp-2 font-sans leading-relaxed">
                    {room.description}
                  </p>

                  {/* Spec Icons */}
                  <div className="mt-6 pt-4 border-t border-pebble-grey/80 grid grid-cols-3 gap-2 text-xs text-mb-30 font-sans">
                    <div className="flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-vg-30 shrink-0" />
                      <span>{room.size}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-vg-30 shrink-0" />
                      <span>{room.capacity}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-vg-30 shrink-0" />
                      <span className="truncate">{room.view}</span>
                    </div>
                  </div>

                  {/* Amenities Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {room.features.map((feat) => (
                      <span key={feat} className="text-[10px] px-2.5 py-0.5 rounded-full bg-cream text-fg-10 font-medium">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Action */}
                <div className="mt-8 pt-4 border-t border-pebble-grey flex items-center justify-between">
                  <button
                    onClick={() => openBooking("sleep")}
                    className="text-xs uppercase tracking-widest font-semibold text-vg-30 hover:text-vg-40 transition-colors flex items-center gap-1.5 group-hover:translate-x-1 duration-300"
                  >
                    <span>Reserve Suite</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] text-mb-40 font-mono">Breakfast Included</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
