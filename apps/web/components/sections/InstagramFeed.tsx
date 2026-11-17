"use client";

import React from "react";
import { siteContent } from "@/config/siteContent";
import { Instagram, ArrowUpRight } from "lucide-react";

export function InstagramFeed() {
  const instagram = siteContent.instagram;

  return (
    <section className="py-16 md:py-20 bg-satin border-t border-pebble-grey overflow-hidden" aria-label="Social Atmosphere">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-vg-30 font-mono block mb-1">
            Social Chronicle
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-mb-10">Follow Our Journey</h3>
        </div>

        <a
          href={siteContent.brand.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-pebble-grey hover:border-vg-30 text-xs font-sans uppercase tracking-wider text-mb-10 hover:text-vg-30 transition-colors"
        >
          <Instagram className="w-4 h-4 text-vg-30" />
          <span>{instagram.handle}</span>
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      {/* 6-Item Strip Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 px-4">
        {instagram.items.map((post) => (
          <a
            key={post.id}
            href={siteContent.brand.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-xl bg-pebble-grey"
          >
            <img
              src={post.image}
              alt={post.id}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-mb-10/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center text-white">
              <Instagram className="w-5 h-5 text-vg-40 mb-1" />
              <p className="text-[10px] text-white/80">{post.likes} likes</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
