"use client";

import React from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustBar } from "@/components/sections/TrustBar";
import { CategoriesCarousel } from "@/components/sections/CategoriesCarousel";
import { RoomsShowcase } from "@/components/sections/RoomsShowcase";
import { MediaStagger } from "@/components/sections/MediaStagger";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { PlaySection } from "@/components/sections/PlaySection";
import { GroundsMap } from "@/components/sections/GroundsMap";
import { OffersCarousel } from "@/components/sections/OffersCarousel";
import { EditorialBlog } from "@/components/sections/EditorialBlog";
import { FAQSection } from "@/components/sections/FAQSection";
import { InstagramFeed } from "@/components/sections/InstagramFeed";

export default function HomePage() {
  return (
    <div className="relative w-full overflow-hidden bg-cream">
      {/* 1. Hero Section with Scroll Scrubbed FLIP Media & Split Text Entrance */}
      <HeroSection />

      {/* 2. Direct Booking Guarantees Bar */}
      <TrustBar />

      {/* 3. Sleep / Eat / Play / Meet Experiential Dual-Background Carousel */}
      <CategoriesCarousel />

      {/* 4. Asymmetric 2-Column Editorial Rooms & Suites Showcase with Filter Tabs */}
      <RoomsShowcase />

      {/* 5. 3-Item Masonry Parallax Grid */}
      <MediaStagger />

      {/* 6. Guest Chronicle Testimonial Carousel */}
      <ReviewsSection />

      {/* 7. Pill-to-Full-Bleed Scroll Morphing Nature & Garden Sanctuary */}
      <PlaySection />

      {/* 8. Interactive Estate Map with 9 Hotspot Pins & 360° Walkthrough Modal */}
      <GroundsMap />

      {/* 9. Curated Privilege Packages & Seasonal Offers */}
      <OffersCarousel />

      {/* 10. Diaries & Discoveries Editorial Journal */}
      <EditorialBlog />

      {/* 11. ScaleX Animated Accordion FAQs with WAI-ARIA */}
      <FAQSection />

      {/* 12. Social Lifestyle Stream */}
      <InstagramFeed />
    </div>
  );
}
