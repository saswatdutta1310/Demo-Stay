# The Vineyard Heritage — Creative Luxury Hospitality Frontend

A production-grade, original creative reconstruction of **The Vineyard Hotel** (Cape Town, South Africa), inspired by the award-winning digital experience on [Awwwards](https://www.awwwards.com/sites/the-vineyard-hotel) and [vineyard.co.za](https://www.vineyard.co.za/).

Built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, **GSAP & ScrollTrigger**, and **Lenis Smooth Scroll**.

---

## 🌟 Architecture & Key Features

1. **Centralized Content Configuration (`apps/web/config/siteContent.ts`)**:
   - 100% of hotel typography, copy, room specifications, categories, rates, interactive map coordinates, reviews, FAQ items, and imagery are decoupled into a single, strongly-typed configuration file.
   - Zero hardcoded branding strings or media in component templates.

2. **Luxury Design System & Bespoke Typography**:
   - **Serif (Display)**: `Marcellus` & `Cormorant Garamond` (open-licensed equivalents to luxury heritage fonts).
   - **Sans (Interface)**: `Plus Jakarta Sans` (open-licensed editorial geometric sans).
   - **Signature Palette**:
     - Warm Linen Cream: `#FFF9F3` (`--c-cream`)
     - Crisp Satin: `#FFFEFD` (`--c-satin`)
     - Pebble Grey: `#EEE8E1` (`--c-pebble-grey`)
     - Midnight Slate: `#151D25` (`--c-mb-10`)
     - Terracotta Accent: `#B6522E` (`--c-vg-30`)
     - Cape Forest Green: `#35403B` (`--c-fg-10`)

3. **Agency-Grade Motion System**:
   - **Lenis Smooth Scroll**: Quintic easing curve (`1 - Math.pow(1 - t, 5)`) synchronized with `requestAnimationFrame`. Automatically paused when drawers or modals are active.
   - **Signature Expo Easing**: `cubic-bezier(0.19, 1, 0.22, 1)`.
   - **Interactive Custom Follower Cursor**: 96px circle with LERP (`0.15`) tracking and dynamic contextual labels (`"Drag"`, `"View"`, `"Explore"`). Auto-disabled on touch devices.
   - **Preloader Curtain**: Heritage monogram reveal with progress counter and smooth upward curtain wipe.
   - **Header Transformation**: Dynamic scroll collapse (`120px` to `64px`) with frosted glass backdrop blur upon scrolling past `80px`.
   - **FLIP Parallax Hero**: Scrubbed scale and vertical translation coupled with staggered split-line text entrance.
   - **Experiential Pillars Carousel**: Sleep, Eat, Play, Meet dual synchronized background crossfades and continuous progress indicators.
   - **Pill-to-Full-Bleed Nature Expansion**: Border radius scrolls smoothly from `48px` to `0px` full-bleed container as it enters viewport.
   - **Interactive Grounds Map**: 8-hectare estate satellite view with pulsing landmark hotspot nodes opening spatial 360° walkthrough modals.
   - **Pre-Footer Curtain Parallax**: Deep scroll scrub reveal behind the main content before the comprehensive estate directory.

4. **Multi-Mode Booking Concierge (`BookingDrawer.tsx`)**:
   - 3-in-1 accessible slide-over drawer for **Sleep** (suites & rooms), **Eat** (table reservations & chef tastings), and **Meet** (executive retreats & conferences).
   - Real validation, instant visual confirmations, date pickers, and promo code slots.

5. **Accessibility & Performance (WAI-ARIA)**:
   - Full keyboard navigation (`Escape` closes all drawers/modals, `Tab` cycling).
   - Complete `prefers-reduced-motion: reduce` support that automatically bypasses Lenis smoothing and GSAP continuous scrub.
   - Semantic HTML5 landmark structure (`header`, `main`, `section`, `article`, `footer`, `dialog`).
   - JSON-LD Hotel Schema markup for rich SEO snippets.

---

## 📁 Project Directory Structure

```text
d:/Demo-Stay/apps/web/
├── app/
│   ├── globals.css              # Global styles, fonts, utilities, animations
│   ├── layout.tsx               # Root layout, UIProvider, smooth scroll, cursor
│   ├── page.tsx                 # Composed 12-section homepage experience
│   ├── next.config.mjs          # Next.js production configuration
│   └── tsconfig.json            # Strict TypeScript configuration
├── components/
│   ├── global/
│   │   ├── BookingDrawer.tsx    # Slide-over multi-tab direct reservation drawer
│   │   ├── CustomCursor.tsx     # Follower cursor with dynamic state labels
│   │   ├── Footer.tsx           # Curtain parallax CTA + directory footer
│   │   ├── Header.tsx           # Responsive luxury navbar with scroll collapse
│   │   ├── NavOverlay.tsx       # Fullscreen editorial navigation drawer
│   │   ├── Preloader.tsx        # Branded curtain entrance animation
│   │   ├── SmoothScroll.tsx     # Lenis smooth scroll provider
│   │   └── WalkthroughModal.tsx # Spatial 360° grounds hotspot modal
│   └── sections/
│       ├── CategoriesCarousel.tsx # Sleep/Eat/Play/Meet experiential slider
│       ├── EditorialBlog.tsx    # Diaries & Discoveries articles
│       ├── FAQSection.tsx       # Accessible animated accordions
│       ├── GroundsMap.tsx       # Interactive 8-hectare estate hotspot map
│       ├── HeroSection.tsx      # FLIP parallax media & split entrance
│       ├── InstagramFeed.tsx    # Social lifestyle photography strip
│       ├── MediaStagger.tsx     # 3-item masonry parallax grid
│       ├── OffersCarousel.tsx   # Privilege & seasonal stay cards
│       ├── PlaySection.tsx      # Nature & garden morphing container
│       ├── ReviewsSection.tsx   # Guest chronicle testimonial carousel
│       ├── RoomsShowcase.tsx    # Asymmetric editorial suites showcase
│       └── TrustBar.tsx         # Direct booking guarantees
├── config/
│   └── siteContent.ts           # Centralized configuration & content source
├── context/
│   └── UIContext.tsx            # Global state (drawers, modals, cursor, scroll)
└── styles/
    └── tokens.css               # Design system tokens (colors, fonts, easing)
```

---

## 🛠️ How to Edit Content & Swap Placeholders

All website data resides in `apps/web/config/siteContent.ts`. To customize:

### 1. Change Hotel Brand Information
Open `apps/web/config/siteContent.ts`:
```ts
export const siteContent: SiteContent = {
  brand: {
    name: "Your Estate Name",
    subname: "Boutique Hotel & Spa",
    tagline: "Your custom tagline here",
    location: "Cape Town, South Africa",
    heritageYear: "Est. 1799",
    contact: {
      phone: "+27 (0)21 000 0000",
      email: "concierge@yourestate.com",
      address: "123 Estate Drive, Cape Town",
      bookingDesk: "+27 (0)21 000 0001"
    },
    socials: {
      instagram: "https://instagram.com/...",
      facebook: "https://facebook.com/...",
      linkedin: "https://linkedin.com/..."
    }
  },
  // ...
};
```

### 2. Swap Room Details and Photography
In `siteContent.rooms.items`:
```ts
{
  id: "main-hotel",
  name: "Main Hotel Deluxe Suites",
  category: "Classic Manor",
  pricePerNight: "ZAR 4,850",
  size: "46 m² / 495 sq ft",
  capacity: "Up to 2 Guests",
  view: "Courtyard & Mountain Peak",
  description: "...",
  image: "https://your-cdn.com/image.jpg",
  features: ["King Bed", "Private Balcony", "Nespresso"]
}
```

### 3. Add or Modify Map Hotspots
In `siteContent.estateMap.pins`:
```ts
{
  id: "pin-courtyard",
  name: "The Sunlit Courtyard",
  category: "Patio & Coffee",
  x: 42, // X-percentage coordinate (0-100)
  y: 52, // Y-percentage coordinate (0-100)
  description: "...",
  thumbnail: "https://your-cdn.com/courtyard.jpg"
}
```

---

## 🚀 Running the Project

### Development Server
```bash
npm run dev:web
```
Runs at `http://localhost:3000`.

### Typecheck & Lint
```bash
# Typecheck
npm run typecheck --workspace=@hotel-demo/web

# Lint
npm run lint --workspace=@hotel-demo/web
```

### Production Build & Launch
```bash
# Build
npm run build:web

# Start production server
npm run start --workspace=@hotel-demo/web
```

---

## 🎨 Motion Checklist

- [x] **Preloader**: Branded monogram scale reveal and curtain lift (`ease: "expo.out"`).
- [x] **Lenis Smooth Scroll**: Quintic momentum scroll with RAF loop and drawer pause mechanics.
- [x] **Custom Follower Cursor**: 96px circle with LERP positioning (`0.15`), text states, and hover scales.
- [x] **Header Transformation**: Fluid scroll transition (`120px` to `64px`) with frosted glass blur.
- [x] **Hero Reveal & Parallax**: Staggered SplitText entrance (`duration: 1.2s`) and scrubbed background zoom.
- [x] **Categories Slider**: Dual background crossfade, auto-progression, and `scaleX` indicator fill.
- [x] **Suites Filter Tabs**: Category filtering with animated image zoom on card hover.
- [x] **Masonry Parallax**: 3-column asymmetric grid scrubbed at differential speeds (`yPercent: ±30`).
- [x] **Nature Morph**: Scroll-linked border radius animation from pill (`48px`) to full bleed (`0px`).
- [x] **Interactive Estate Map**: Pulsing radar pins with hover tooltips and 360° Walkthrough Modal.
- [x] **Direct Booking Drawer**: Multi-tab smooth slide-over with validation and direct confirmation.
- [x] **Fullscreen Nav Overlay**: Staggered line reveal entrance with luxury contact directory.
- [x] **Pre-Footer Parallax**: Scrubbed curtain background reveal behind estate information.
