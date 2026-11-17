"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useUI } from "@/context/UIContext";
import { siteContent } from "@/config/siteContent";
import { X, ArrowUpRight, Phone, Mail, MapPin } from "lucide-react";
import gsap from "gsap";

export function NavOverlay() {
  const { isNavOpen, closeNav, openBooking } = useUI();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isNavOpen) {
        closeNav();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isNavOpen, closeNav]);

  useEffect(() => {
    if (!overlayRef.current) return;
    const ctx = gsap.context(() => {
      if (isNavOpen) {
        gsap.to(overlayRef.current, {
          autoAlpha: 1,
          duration: 0.5,
          ease: "expo.out"
        });
        if (linksRef.current) {
          gsap.fromTo(
            linksRef.current.querySelectorAll(".nav-link-item"),
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.06,
              ease: "expo.out",
              delay: 0.15
            }
          );
        }
      } else {
        gsap.to(overlayRef.current, {
          autoAlpha: 0,
          duration: 0.4,
          ease: "power2.in"
        });
      }
    }, overlayRef);

    return () => ctx.revert();
  }, [isNavOpen]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] invisible opacity-0 bg-mb-10/95 backdrop-blur-2xl text-cream flex flex-col justify-between overflow-y-auto px-6 py-8 md:px-16 md:py-12"
      role="dialog"
      aria-modal="true"
      aria-label="Site Navigation"
    >
      {/* Top Bar inside Overlay */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center font-serif text-sm text-vg-40">
            {siteContent.brand.heritageYear.slice(-2)}
          </div>
          <div>
            <span className="font-serif text-lg tracking-wider block leading-tight text-white">
              {siteContent.brand.name}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-white/50 block">
              {siteContent.brand.location}
            </span>
          </div>
        </div>

        <button
          onClick={closeNav}
          aria-label="Close navigation menu"
          className="group flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-white/50 hover:bg-white/5 transition-all text-sm uppercase tracking-widest"
        >
          <span className="text-xs text-white/70 group-hover:text-white transition-colors">Close</span>
          <X className="w-4 h-4 text-white/70 group-hover:text-white transition-transform group-hover:rotate-90 duration-300" />
        </button>
      </div>

      {/* Main Navigation Grid */}
      <div
        ref={contentRef}
        className="max-w-7xl mx-auto w-full my-auto py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
      >
        {/* Navigation Links Column */}
        <div ref={linksRef} className="lg:col-span-8 flex flex-col space-y-3">
          {siteContent.navigation.main.map((item, index) => (
            <div key={item.id} className="nav-link-item group overflow-hidden">
              <Link
                href={item.href}
                onClick={closeNav}
                className="flex items-baseline justify-between py-2 border-b border-white/5 group-hover:border-vg-40/40 transition-colors"
              >
                <div className="flex items-baseline gap-4 md:gap-8">
                  <span className="font-sans text-xs md:text-sm text-vg-40/60 font-mono">
                    0{index + 1}
                  </span>
                  <span className="font-serif text-3xl md:text-5xl lg:text-6xl text-white/90 group-hover:text-vg-40 group-hover:translate-x-3 transition-all duration-300">
                    {item.label}
                  </span>
                </div>
                <ArrowUpRight className="w-6 h-6 text-white/20 group-hover:text-vg-40 group-hover:scale-125 transition-all duration-300 opacity-0 group-hover:opacity-100" />
              </Link>
            </div>
          ))}

          {/* Quick Book Button */}
          <div className="nav-link-item pt-6">
            <button
              onClick={() => {
                closeNav();
                openBooking("sleep");
              }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-vg-30 text-white hover:bg-vg-40 transition-all font-sans text-sm font-medium tracking-wider uppercase shadow-xl hover:shadow-vg-30/30"
            >
              <span>Direct Reservation</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Secondary Info & Heritage Column */}
        <div className="lg:col-span-4 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-12 space-y-8">
          <div>
            <h4 className="text-xs uppercase tracking-widest text-vg-40 font-mono mb-3">Estate Address</h4>
            <p className="text-sm text-white/80 leading-relaxed font-sans flex items-start gap-2">
              <MapPin className="w-4 h-4 text-vg-40 shrink-0 mt-0.5" />
              {siteContent.brand.contact.address}
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-vg-40 font-mono mb-3">Direct Inquiries</h4>
            <div className="space-y-2 text-sm text-white/80">
              <a
                href={`tel:${siteContent.brand.contact.phone}`}
                className="flex items-center gap-2 hover:text-vg-40 transition-colors"
              >
                <Phone className="w-4 h-4 text-vg-40" />
                {siteContent.brand.contact.phone}
              </a>
              <a
                href={`mailto:${siteContent.brand.contact.email}`}
                className="flex items-center gap-2 hover:text-vg-40 transition-colors"
              >
                <Mail className="w-4 h-4 text-vg-40" />
                {siteContent.brand.contact.email}
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-vg-40 font-mono mb-3">Experience Pillars</h4>
            <div className="flex flex-wrap gap-2">
              {siteContent.navigation.secondary.map((sec) => (
                <Link
                  key={sec.label}
                  href={sec.href}
                  onClick={closeNav}
                  className="px-3 py-1.5 rounded-full border border-white/10 hover:border-white/30 text-xs text-white/70 hover:text-white transition-colors"
                >
                  {sec.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-xs text-white/40">
            Est. {siteContent.brand.heritageYear} &mdash; Historic Cape Dutch Sanctuary &bull; 8 Hectares of Indigenous Flora
          </div>
        </div>
      </div>

      {/* Bottom Bar Footer */}
      <div className="max-w-7xl mx-auto w-full pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
        <div>&copy; {new Date().getFullYear()} {siteContent.brand.name}. All rights reserved.</div>
        <div className="flex items-center gap-6">
          <a href={siteContent.brand.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
          <a href={siteContent.brand.socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>
          <a href={siteContent.brand.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
        </div>
      </div>
    </div>
  );
}
