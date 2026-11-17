"use client";

import React, { useEffect, useRef } from "react";
import { siteContent } from "@/config/siteContent";
import { useUI } from "@/context/UIContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Compass } from "lucide-react";

export function PlaySection() {
  const { setCursor, resetCursor } = useUI();
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (cardRef.current && sectionRef.current) {
        // Scrubbed border radius morph: expands from pill/stadium into full width
        gsap.fromTo(
          cardRef.current,
          { borderRadius: "64px", scale: 0.95 },
          {
            borderRadius: "16px",
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "center center",
              scrub: true
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="play"
      className="bg-cream py-16 sm:py-28 overflow-hidden"
      aria-label="Nature and Forest Experiences"
    >
      <div className="max-w-estate mx-auto px-4 sm:px-8 md:px-12">
        <div
          ref={cardRef}
          className="relative min-h-[70vh] sm:min-h-[80vh] rounded-3xl overflow-hidden flex flex-col justify-end p-6 sm:p-12 md:p-16 shadow-2xl border border-silt/30 will-change-transform"
          onMouseEnter={() => setCursor("Explore")}
          onMouseLeave={resetCursor}
        >
          {/* Background Media */}
          <div className="absolute inset-0 z-0">
            <img
              src={siteContent.playNature.image}
              alt="Ancient botanical gardens and Table Mountain trails"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/40 to-transparent" />
          </div>

          {/* Content Card Overlay */}
          <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-6 text-cream">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cream/15 backdrop-blur-md border border-cream/20">
              <Compass className="w-3.5 h-3.5 text-amber-50" />
              <span className="font-sans text-[11px] sm:text-xs tracking-[0.2em] uppercase font-medium">
                {siteContent.playNature.overline}
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-cream tracking-tight leading-[1.1]">
              {siteContent.playNature.title}
            </h2>

            <p className="font-sans text-sm sm:text-base text-cream/85 leading-relaxed font-light">
              {siteContent.playNature.description}
            </p>

            <div className="pt-2">
              <a
                href={siteContent.playNature.ctaLink}
                className="inline-flex items-center space-x-2.5 px-8 py-3.5 rounded-full bg-cream text-midnight hover:bg-terracotta hover:text-cream font-sans text-xs uppercase tracking-[0.15em] font-semibold transition-all duration-300 shadow-lg"
              >
                <span>{siteContent.playNature.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

