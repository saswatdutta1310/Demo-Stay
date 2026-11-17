"use client";

import React from "react";
import Link from "next/link";
import { siteContent } from "@/config/siteContent";
import { useUI } from "@/context/UIContext";
import { Menu, X, Calendar } from "lucide-react";

export function Header() {
  const { isScrolled, isNavOpen, toggleNav, openBooking } = useUI();

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-700 ease-expo ${
        isScrolled
          ? "h-16 sm:h-20 bg-cream/90 backdrop-blur-md border-b border-silt/30 shadow-sm"
          : "h-20 sm:h-28 bg-transparent"
      }`}
    >
      <div className="max-w-estate mx-auto h-full px-4 sm:px-8 md:px-12 flex items-center justify-between">
        <nav className="hidden lg:flex items-center space-x-8" aria-label="Primary Navigation">
          {siteContent.navigation.main.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="link-editorial font-sans text-xs uppercase tracking-[0.12em] font-medium text-midnight/80 hover:text-midnight transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex-1 lg:flex-initial text-left lg:text-center">
          <Link href="/" className="inline-block group focus-visible:outline-none">
            <span className="block font-serif text-lg sm:text-2xl tracking-[0.15em] uppercase text-midnight transition-colors group-hover:text-terracotta">
              {siteContent.brand.name}
            </span>
            <span className="hidden sm:block font-sans text-[10px] tracking-[0.25em] uppercase text-wood font-medium">
              {siteContent.brand.location}
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-5">
          <button
            onClick={() => openBooking("sleep")}
            className="group relative inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-terracotta text-cream font-sans text-xs uppercase tracking-[0.1em] font-medium overflow-hidden transition-all duration-300 hover:bg-midnight shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
            aria-label="Open reservation booking drawer"
          >
            <Calendar className="w-3.5 h-3.5 mr-1.5 sm:hidden" />
            <span>Book a Stay</span>
          </button>

          <button
            onClick={toggleNav}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-midnight/15 flex items-center justify-center text-midnight hover:border-terracotta hover:text-terracotta transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
            aria-expanded={isNavOpen}
            aria-label={isNavOpen ? "Close menu" : "Open navigation menu"}
          >
            {isNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
