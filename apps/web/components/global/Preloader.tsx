"use client";

import React, { useEffect, useState } from "react";
import { siteContent } from "@/config/siteContent";

export function Preloader() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsFading(true);
      const closeTimer = setTimeout(() => {
        setIsVisible(false);
      }, 600);
      return () => clearTimeout(closeTimer);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream transition-opacity duration-700 ease-expo pointer-events-none ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full border border-silt flex items-center justify-center">
          <span className="font-serif text-2xl text-terracotta tracking-wider font-normal">
            VH
          </span>
        </div>
        <div className="space-y-1">
          <p className="font-serif text-xl tracking-[0.2em] uppercase text-midnight">
            {siteContent.brand.name}
          </p>
          <p className="font-sans text-xs tracking-widest uppercase text-wood">
            {siteContent.brand.heritageYear} · {siteContent.brand.location}
          </p>
        </div>
        <div className="w-24 h-[1px] bg-terracotta/30 mx-auto mt-4 overflow-hidden">
          <div className="w-full h-full bg-terracotta animate-pulse" />
        </div>
      </div>
    </div>
  );
}
