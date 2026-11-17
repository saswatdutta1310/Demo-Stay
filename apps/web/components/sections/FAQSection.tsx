"use client";

import React, { useState } from "react";
import { siteContent } from "@/config/siteContent";
import { Plus, Minus } from "lucide-react";

export function FAQSection() {
  const items = siteContent.faq.items;
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    [items[0].id]: true // first item open by default
  });

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section id="faq" className="bg-pebble py-20 sm:py-32 border-b border-silt/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-12 sm:mb-16">
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-terracotta font-semibold">
            {siteContent.faq.overline}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-midnight tracking-tight">
            {siteContent.faq.title}
          </h2>
        </div>

        {/* Accordions List */}
        <div className="space-y-4">
          {items.map((faq) => {
            const isOpen = !!openIds[faq.id];
            return (
              <div
                key={faq.id}
                className="bg-cream rounded-2xl border border-silt/40 overflow-hidden transition-colors"
              >
                {/* Header Toggle */}
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full p-6 sm:p-7 flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                >
                  <span className="font-serif text-lg sm:text-xl text-midnight tracking-tight font-medium pr-4">
                    {faq.question}
                  </span>
                  <span
                    className={`w-8 h-8 rounded-full border border-silt/60 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? "bg-terracotta text-cream border-terracotta rotate-180" : "text-midnight"
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>

                {/* Animated Body */}
                <div
                  className={`px-6 sm:px-7 overflow-hidden transition-all duration-500 ease-expo ${
                    isOpen ? "max-h-96 pb-6 sm:pb-7 opacity-100" : "max-h-0 pb-0 opacity-0"
                  }`}
                  inert={!isOpen ? true : undefined}
                >
                  <p className="font-sans text-sm sm:text-base text-wood leading-relaxed border-t border-silt/20 pt-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

