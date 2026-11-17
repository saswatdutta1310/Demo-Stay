"use client";

import React from "react";
import { siteContent } from "@/config/siteContent";
import { ShieldCheck, Wine, RotateCcw } from "lucide-react";

export function TrustBar() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "shield":
        return <ShieldCheck className="w-5 h-5 text-vg-30 shrink-0" />;
      case "wine":
        return <Wine className="w-5 h-5 text-vg-30 shrink-0" />;
      case "calendar-sync":
      default:
        return <RotateCcw className="w-5 h-5 text-vg-30 shrink-0" />;
    }
  };

  return (
    <section id="trust-bar" className="relative z-20 bg-satin border-b border-pebble-grey py-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {siteContent.trustBar.map((item, idx) => (
          <div
            key={item.id}
            className={`flex items-start gap-4 p-4 rounded-xl transition-all hover:bg-cream/60 ${
              idx < siteContent.trustBar.length - 1 ? "md:border-r border-pebble-grey/80" : ""
            }`}
          >
            <div className="p-2.5 rounded-full bg-cream border border-pebble-grey shrink-0">
              {getIcon(item.icon)}
            </div>
            <div>
              <h4 className="font-serif text-base text-mb-10 font-semibold">{item.title}</h4>
              <p className="text-xs text-mb-20 font-sans mt-0.5 leading-relaxed">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
