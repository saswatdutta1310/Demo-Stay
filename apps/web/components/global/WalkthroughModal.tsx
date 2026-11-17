"use client";

import React, { useEffect, useRef } from "react";
import { useUI } from "@/context/UIContext";
import { siteContent } from "@/config/siteContent";
import { X, MapPin, Compass, ArrowRight } from "lucide-react";
import gsap from "gsap";

export function WalkthroughModal() {
  const { isWalkthroughOpen, closeWalkthrough, activeMapHotspot, openBooking } = useUI();
  const modalRef = useRef<HTMLDivElement>(null);

  const currentPin = siteContent.estateMap.pins.find((p) => p.id === activeMapHotspot) || siteContent.estateMap.pins[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isWalkthroughOpen) {
        closeWalkthrough();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isWalkthroughOpen, closeWalkthrough]);

  useEffect(() => {
    if (!modalRef.current) return;
    const ctx = gsap.context(() => {
      if (isWalkthroughOpen) {
        gsap.to(modalRef.current, {
          autoAlpha: 1,
          duration: 0.4,
          ease: "expo.out"
        });
      } else {
        gsap.to(modalRef.current, {
          autoAlpha: 0,
          duration: 0.3,
          ease: "power2.in"
        });
      }
    }, modalRef);

    return () => ctx.revert();
  }, [isWalkthroughOpen]);

  if (!isWalkthroughOpen || !currentPin) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[120] bg-mb-10/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Estate Walkthrough Modal"
    >
      <div className="relative w-full max-w-4xl bg-satin rounded-2xl overflow-hidden shadow-2xl border border-pebble-grey flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={closeWalkthrough}
          aria-label="Close Walkthrough"
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-mb-10/70 text-white hover:bg-mb-10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Preview / Panorama Mock */}
        <div className="relative md:w-3/5 h-64 md:h-auto min-h-[340px] bg-mb-10 overflow-hidden">
          <img
            src={currentPin.thumbnail}
            alt={currentPin.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-mb-10/80 via-transparent to-transparent" />
          
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
              <Compass className="w-3.5 h-3.5 text-vg-40" /> 360° Spatial Panorama
            </span>
            <span className="text-white/70">Interactive Node</span>
          </div>
        </div>

        {/* Info Column */}
        <div className="p-6 md:p-8 md:w-2/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-vg-30 text-xs font-mono uppercase tracking-widest mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>{currentPin.category}</span>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-mb-10">{currentPin.name}</h3>
            <p className="mt-4 text-sm text-mb-20 leading-relaxed font-sans">{currentPin.description}</p>
          </div>

          <div className="pt-6 mt-6 border-t border-pebble-grey flex flex-col gap-3">
            <button
              onClick={() => {
                closeWalkthrough();
                openBooking("sleep");
              }}
              className="w-full py-3 px-5 rounded-full bg-vg-30 text-white font-sans text-xs uppercase tracking-wider font-semibold hover:bg-vg-40 transition-colors flex items-center justify-center gap-2"
            >
              <span>Reserve Near Here</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={closeWalkthrough}
              className="w-full py-2.5 text-center text-xs text-mb-30 hover:text-mb-10 uppercase tracking-widest transition-colors"
            >
              Explore Other Hotspots
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
