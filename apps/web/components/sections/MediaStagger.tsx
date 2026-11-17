"use client";

import React, { useRef, useEffect } from "react";
import { siteContent } from "@/config/siteContent";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function MediaStagger() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".stagger-card");
      items.forEach((item, i) => {
        const speed = i % 2 === 0 ? 30 : -30;
        gsap.to(item, {
          yPercent: speed,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-20 md:py-28 bg-pebble-grey/40 px-6 md:px-12 lg:px-16 overflow-hidden" aria-label="Visual Atmosphere">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-vg-30 font-mono block mb-2">
            Estate Chronicle
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-mb-10">
            A Sense of Place
          </h2>
          <p className="mt-3 text-sm text-mb-20 font-sans leading-relaxed">
            Where Table Mountain&apos;s morning mist cascades onto centuries of Cape horticultural conservation.
          </p>
        </div>

        {/* 3-Column Masonry Parallax Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {siteContent.mediaStagger.map((item, idx) => (
            <div
              key={item.id}
              className={`stagger-card group relative rounded-2xl overflow-hidden shadow-lg border border-pebble-grey bg-satin ${
                idx === 1 ? "md:translate-y-8" : ""
              }`}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6 bg-satin">
                <span className="text-[10px] uppercase tracking-widest text-vg-30 font-mono block mb-1">
                  Chronicle 0{idx + 1}
                </span>
                <h4 className="font-serif text-lg text-mb-10">{item.caption}</h4>
                <p className="text-xs text-mb-20 font-sans mt-1">{item.subcaption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
