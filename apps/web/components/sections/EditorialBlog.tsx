"use client";

import React from "react";
import { siteContent } from "@/config/siteContent";
import { ArrowUpRight, Clock } from "lucide-react";

export function EditorialBlog() {
  const articles = siteContent.diaries.items;

  return (
    <section className="py-20 md:py-28 bg-satin border-t border-pebble-grey px-6 md:px-12 lg:px-16" aria-label="Estate Diaries">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-vg-30 font-mono block mb-2">
              {siteContent.diaries.overline}
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-mb-10">
              {siteContent.diaries.title}
            </h2>
          </div>

          <span className="text-xs uppercase tracking-widest text-mb-30 font-mono">
            Stories from the Cape Peninsula
          </span>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((item) => (
            <article key={item.id} className="group flex flex-col justify-between">
              <div>
                <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-5 bg-pebble-grey">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                <div className="flex items-center gap-3 text-xs text-mb-30 font-mono mb-2">
                  <span className="text-vg-30 font-semibold uppercase">{item.category}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.readTime}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-mb-10 group-hover:text-vg-30 transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="mt-2.5 text-xs sm:text-sm text-mb-20 font-sans line-clamp-2 leading-relaxed">
                  {item.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-pebble-grey/80 flex items-center justify-between text-xs text-mb-30">
                <span>{item.date}</span>
                <span className="text-vg-30 font-semibold uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 duration-300">
                  Read Article <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
