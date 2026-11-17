"use client";

import React, { useEffect, useRef } from "react";
import { siteContent } from "@/config/siteContent";
import { useUI } from "@/context/UIContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, Calendar, Compass } from "lucide-react";

export function HeroSection() {
  const { openBooking } = useUI();
  const heroRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Initial entrance timeline for hero text
      const tl = gsap.timeline({ delay: 0.2 });
      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.4, ease: "power3.out" }
        );
      }
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
          "-=0.8"
        );
      }

      // 2. Scrubbed parallax & scale on hero media as user scrolls down
      if (mediaRef.current && heroRef.current) {
        gsap.to(mediaRef.current, {
          yPercent: 20,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between overflow-hidden bg-midnight text-cream pt-28 sm:pt-36 pb-12 sm:pb-16"
      aria-label="Welcome and Overview"
    >
      {/* Background Media with Parallax Scrub */}
      <div
        ref={mediaRef}
        className="absolute inset-0 w-full h-full z-0 overflow-hidden will-change-transform scale-100"
      >
        <img
          src={siteContent.hero.bgImage}
          alt="The Vineyard Heritage Estate grounds against Table Mountain"
          className="w-full h-full object-cover object-center"
        />
        {/* Editorial double gradient: Darker at bottom and top for maximum contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/70 via-midnight/40 to-midnight/90" />
      </div>

      {/* Main Hero Editorial Typography */}
      <div className="relative z-10 max-w-estate mx-auto w-full px-4 sm:px-8 md:px-12 my-auto">
        <div className="max-w-4xl space-y-4 sm:space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cream/15 backdrop-blur-md border border-cream/20">
            <Compass className="w-3.5 h-3.5 text-amber-80" />
            <span className="font-sans text-[11px] sm:text-xs tracking-[0.2em] uppercase font-medium text-cream">
              {siteContent.hero.overline}
            </span>
          </div>

          <h1
            ref={titleRef}
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.05] text-cream"
          >
            {siteContent.hero.title}
          </h1>

          <p
            ref={subtitleRef}
            className="font-sans text-base sm:text-lg md:text-xl text-cream/90 max-w-2xl leading-relaxed font-light"
          >
            {siteContent.hero.subtitle}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={() => openBooking("sleep")}
              className="inline-flex items-center space-x-2.5 px-8 py-4 rounded-full bg-terracotta text-cream font-sans text-xs uppercase tracking-[0.15em] font-semibold hover:bg-cream hover:text-midnight transition-all duration-300 shadow-xl"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve Your Sanctuary</span>
            </button>

            <a
              href="#rooms"
              className="inline-flex items-center space-x-2 px-6 py-4 rounded-full bg-cream/10 hover:bg-cream/20 text-cream font-sans text-xs uppercase tracking-[0.12em] font-medium backdrop-blur-md border border-cream/20 transition-colors"
            >
              <span>Explore Accommodations</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Docked Information Bar */}
      <div className="relative z-10 max-w-estate mx-auto w-full px-4 sm:px-8 md:px-12 pt-8 sm:pt-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-cream/20 pt-4 gap-4 text-xs font-sans text-cream/80">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-50 animate-ping" />
            <span className="tracking-wider uppercase font-medium">
              {siteContent.hero.dockedNote}
            </span>
          </div>

          <a
            href="#trust"
            className="hidden sm:inline-flex items-center space-x-1.5 text-cream/70 hover:text-cream transition-colors text-xs font-medium tracking-widest uppercase"
          >
            <span>Scroll to Discover</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}

