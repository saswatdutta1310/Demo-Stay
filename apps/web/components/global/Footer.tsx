"use client";

import React, { useState } from "react";
import { siteContent } from "@/config/siteContent";
import { useUI } from "@/context/UIContext";
import { ArrowRight, ChevronDown, Check, Instagram, Facebook, Linkedin } from "lucide-react";

export function Footer() {
  const { openBooking } = useUI();
  const footerData = siteContent.footer;
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [openMobileColumns, setOpenMobileColumns] = useState<Record<number, boolean>>({});

  const toggleMobileCol = (idx: number) => {
    setOpenMobileColumns((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSuccess(true);
    setNewsletterEmail("");
  };

  return (
    <footer className="relative bg-midnight text-cream overflow-hidden">
      {/* 1. Pre-Footer Curtain Parallax CTA */}
      <div className="relative min-h-[500px] h-[55vh] flex items-center justify-center text-center p-6 sm:p-12 border-b border-cream/15 overflow-hidden">
        {/* Background Image with Curtain Parallax effect */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <img
            src={footerData.curtainCta.bgImage}
            alt="Table Mountain sunset panorama"
            className="w-full h-full object-cover object-center brightness-75 will-change-transform"
          />
          <div className="absolute inset-0 bg-midnight/65 backdrop-blur-[2px]" />
        </div>

        {/* CTA Content */}
        <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-6">
          <span className="font-sans text-xs uppercase tracking-[0.25em] text-amber-50 font-medium">
            Your Mountain Sanctuary Awaits
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-cream tracking-tight leading-tight">
            {footerData.curtainCta.headline}
          </h2>
          <p className="font-sans text-sm sm:text-base text-cream/80 max-w-xl mx-auto font-light leading-relaxed">
            {footerData.curtainCta.subline}
          </p>
          <div className="pt-2">
            <button
              onClick={() => openBooking("sleep")}
              className="inline-flex items-center space-x-2.5 px-8 py-4 rounded-full bg-terracotta text-cream font-sans text-xs uppercase tracking-[0.15em] font-semibold hover:bg-cream hover:text-midnight transition-all duration-300 shadow-xl"
            >
              <span>{footerData.curtainCta.buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Directory & Newsletter */}
      <div className="max-w-estate mx-auto px-4 sm:px-8 md:px-12 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
          {/* Brand Info & Newsletter (Left Column) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="font-serif text-2xl tracking-[0.15em] uppercase text-cream block">
                {siteContent.brand.name}
              </span>
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-cream/60">
                {siteContent.brand.subname} · {siteContent.brand.heritageYear}
              </p>
            </div>

            <p className="font-sans text-xs sm:text-sm text-cream/70 leading-relaxed max-w-sm">
              {siteContent.brand.contact.address}
            </p>

            {/* Newsletter Subscription Box */}
            <div className="pt-4 border-t border-cream/15 max-w-md space-y-3">
              <p className="font-sans text-xs uppercase tracking-wider text-amber-50 font-medium">
                {footerData.newsletter.title}
              </p>
              <p className="font-sans text-xs text-cream/70">
                {footerData.newsletter.description}
              </p>

              {newsletterSuccess ? (
                <div className="p-3 rounded-xl bg-forest/40 border border-forest/60 text-xs text-cream flex items-center space-x-2">
                  <Check className="w-4 h-4 text-amber-50" />
                  <span>Thank you for subscribing to our seasonal journal.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex rounded-full overflow-hidden border border-cream/25 focus-within:border-terracotta transition-colors bg-cream/5 backdrop-blur-md">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder={footerData.newsletter.placeholder}
                    className="flex-1 px-4 py-3 bg-transparent text-xs font-sans text-cream placeholder:text-cream/40 focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="px-5 bg-terracotta hover:bg-cream hover:text-midnight text-cream text-xs font-sans uppercase tracking-wider font-semibold transition-colors flex items-center justify-center"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex space-x-3 pt-2">
              <a
                href={siteContent.brand.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center text-cream/70 hover:text-cream hover:border-terracotta transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={siteContent.brand.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center text-cream/70 hover:text-cream hover:border-terracotta transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={siteContent.brand.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center text-cream/70 hover:text-cream hover:border-terracotta transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Directory Columns (Desktop Grid / Mobile Accordions) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-4 gap-8">
            {footerData.columns.map((col, idx) => {
              const isOpen = !!openMobileColumns[idx];
              return (
                <div key={col.title} className="space-y-4">
                  {/* Mobile header button */}
                  <button
                    onClick={() => toggleMobileCol(idx)}
                    className="w-full flex sm:hidden items-center justify-between py-2 border-b border-cream/15 text-left font-serif text-base text-cream"
                  >
                    <span>{col.title}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-terracotta" : "text-cream/50"
                      }`}
                    />
                  </button>

                  {/* Desktop header */}
                  <h4 className="hidden sm:block font-serif text-sm tracking-wider uppercase text-cream/90 font-medium border-b border-cream/15 pb-2">
                    {col.title}
                  </h4>

                  {/* Links List */}
                  <ul
                    className={`space-y-2.5 font-sans text-xs text-cream/65 sm:block ${
                      isOpen ? "block pt-2" : "hidden sm:block"
                    }`}
                  >
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="hover:text-cream transition-colors block py-0.5"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Colophon Bottom Bar */}
        <div className="pt-12 sm:pt-16 mt-12 sm:mt-16 border-t border-cream/15 flex flex-col sm:flex-row items-center justify-between text-[11px] font-sans text-cream/50 gap-4">
          <p>{footerData.legal}</p>
          <div className="flex space-x-6">
            <a href="/legal/privacy" className="hover:text-cream transition-colors">
              Privacy Policy
            </a>
            <a href="/legal/terms" className="hover:text-cream transition-colors">
              Terms & Conditions
            </a>
            <a href="/policies" className="hover:text-cream transition-colors">
              Direct Booking Policies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

