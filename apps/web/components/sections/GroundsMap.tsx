"use client";

import React, { useState } from "react";
import { siteContent } from "@/config/siteContent";
import { useUI } from "@/context/UIContext";
import { MapPin, Compass, Eye } from "lucide-react";

export function GroundsMap() {
  const { open3DModal } = useUI();
  const pins = siteContent.estateMap.pins;
  const [activePin, setActivePin] = useState(pins[0]);

  return (
    <section id="map" className="bg-pebble py-20 sm:py-32 border-b border-silt/30 overflow-hidden">
      <div className="max-w-estate mx-auto px-4 sm:px-8 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-terracotta font-semibold">
              {siteContent.estateMap.overline}
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-midnight tracking-tight">
              {siteContent.estateMap.title}
            </h2>
            <p className="font-sans text-sm sm:text-base text-wood">
              {siteContent.estateMap.description}
            </p>
          </div>

          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-cream border border-silt/40 text-xs font-sans text-midnight font-medium">
            <Compass className="w-4 h-4 text-terracotta" />
            <span>Interactive Estate Hotspots (Click to Preview)</span>
          </div>
        </div>

        {/* Map Interactive Canvas */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-2xl border border-silt/40 bg-midnight">
          {/* Map Base Graphic */}
          <img
            src={siteContent.estateMap.mapImage}
            alt="The Vineyard Heritage Estate architectural map and grounds layout"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight/70 via-transparent to-midnight/20" />

          {/* Coordinate Pin Markers */}
          {pins.map((pin) => (
            <button
              key={pin.id}
              onClick={() => {
                setActivePin(pin);
                open3DModal(pin.id);
              }}
              onMouseEnter={() => setActivePin(pin)}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group focus-visible:outline-none"
              aria-label={`Inspect ${pin.name}`}
            >
              <div className="relative flex items-center justify-center">
                {/* Ping wave */}
                <span className="absolute w-8 h-8 rounded-full bg-terracotta/40 animate-ping" />
                {/* Core Pin Button */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 ${
                    activePin?.id === pin.id
                      ? "bg-terracotta text-cream scale-125 ring-4 ring-cream"
                      : "bg-cream text-midnight hover:scale-110"
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
            </button>
          ))}

          {/* Floating Highlight Card on Desktop */}
          {activePin && (
            <div className="absolute bottom-6 left-6 z-20 max-w-sm hidden sm:block p-4 rounded-2xl bg-cream/95 backdrop-blur-md shadow-xl border border-silt/30 text-midnight">
              <div className="flex items-start space-x-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-silt/30">
                  <img
                    src={activePin.thumbnail}
                    alt={activePin.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <span className="font-sans text-[10px] uppercase tracking-wider text-wood font-medium">
                    {activePin.category}
                  </span>
                  <p className="font-serif text-sm font-semibold text-midnight leading-tight">
                    {activePin.name}
                  </p>
                  <p className="font-sans text-xs text-wood line-clamp-2">
                    {activePin.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => open3DModal(activePin.id)}
                className="w-full mt-3 py-2 rounded-xl bg-midnight text-cream hover:bg-terracotta text-xs font-sans uppercase tracking-wider font-semibold flex items-center justify-center space-x-1 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open 360 Panorama</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Horizontal Pin Selector */}
        <div className="flex sm:hidden overflow-x-auto space-x-3 pt-6 pb-2 no-scrollbar">
          {pins.map((pin) => (
            <button
              key={pin.id}
              onClick={() => open3DModal(pin.id)}
              className="flex-shrink-0 px-4 py-2.5 rounded-full bg-cream border border-silt/40 text-xs font-sans font-medium text-midnight flex items-center space-x-2"
            >
              <MapPin className="w-3.5 h-3.5 text-terracotta" />
              <span>{pin.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

