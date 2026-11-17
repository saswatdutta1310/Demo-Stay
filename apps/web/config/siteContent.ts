export interface SiteContent {
  brand: {
    name: string;
    subname: string;
    tagline: string;
    location: string;
    heritageYear: string;
    contact: {
      phone: string;
      email: string;
      address: string;
      bookingDesk: string;
    };
    socials: {
      instagram: string;
      facebook: string;
      linkedin: string;
    };
  };
  navigation: {
    main: Array<{
      id: string;
      label: string;
      href: string;
      subItems?: Array<{ label: string; href: string }>;
    }>;
    secondary: Array<{
      label: string;
      href: string;
    }>;
  };
  hero: {
    overline: string;
    title: string;
    subtitle: string;
    bgImage: string;
    dockedNote: string;
  };
  trustBar: Array<{
    id: string;
    title: string;
    subtitle: string;
    icon: string;
  }>;
  categories: Array<{
    id: string;
    label: string;
    title: string;
    headline: string;
    description: string;
    cta: string;
    ctaLink: string;
    image: string;
    bgImage: string;
  }>;
  rooms: {
    overline: string;
    title: string;
    description: string;
    items: Array<{
      id: string;
      name: string;
      category: string;
      pricePerNight: string;
      size: string;
      capacity: string;
      view: string;
      description: string;
      image: string;
      features: string[];
    }>;
  };
  mediaStagger: Array<{
    id: string;
    caption: string;
    subcaption: string;
    aspectRatio: string;
    image: string;
  }>;
  reviews: {
    title: string;
    subtitle: string;
    items: Array<{
      id: string;
      quote: string;
      guest: string;
      origin: string;
      rating: number;
    }>;
  };
  playNature: {
    overline: string;
    title: string;
    description: string;
    image: string;
    cta: string;
    ctaLink: string;
  };
  estateMap: {
    overline: string;
    title: string;
    description: string;
    mapImage: string;
    pins: Array<{
      id: string;
      name: string;
      category: string;
      x: number; // percentage from left (0 - 100)
      y: number; // percentage from top (0 - 100)
      description: string;
      thumbnail: string;
    }>;
  };
  offers: {
    overline: string;
    title: string;
    description: string;
    items: Array<{
      id: string;
      title: string;
      badge: string;
      description: string;
      validity: string;
      image: string;
      cta: string;
    }>;
  };
  diaries: {
    overline: string;
    title: string;
    items: Array<{
      id: string;
      title: string;
      category: string;
      readTime: string;
      date: string;
      excerpt: string;
      image: string;
      slug: string;
    }>;
  };
  faq: {
    overline: string;
    title: string;
    items: Array<{
      id: string;
      question: string;
      answer: string;
    }>;
  };
  instagram: {
    handle: string;
    hashtag: string;
    items: Array<{
      id: string;
      image: string;
      likes: string;
    }>;
  };
  footer: {
    curtainCta: {
      headline: string;
      subline: string;
      buttonText: string;
      bgImage: string;
    };
    columns: Array<{
      title: string;
      links: Array<{ label: string; href: string }>;
    }>;
    newsletter: {
      title: string;
      description: string;
      placeholder: string;
    };
    legal: string;
  };
}

export const siteContent: SiteContent = {
  brand: {
    name: "The Vineyard Heritage",
    subname: "Estate, Hotel & Spa",
    tagline: "Nestled at the eastern slopes of Table Mountain",
    location: "Newlands, Cape Town",
    heritageYear: "Est. 1799",
    contact: {
      phone: "+27 (0)21 657 4500",
      email: "reservations@thevineyardheritage.com",
      address: "Colinton Road, Newlands 7700, Cape Town, South Africa",
      bookingDesk: "+27 (0)21 657 4511"
    },
    socials: {
      instagram: "https://instagram.com/vineyard_hotel",
      facebook: "https://facebook.com/vineyardhotel",
      linkedin: "https://linkedin.com/company/the-vineyard-hotel"
    }
  },
  navigation: {
    main: [
      {
        id: "sleep",
        label: "Sleep",
        href: "#rooms",
        subItems: [
          { label: "Main Hotel Rooms", href: "#rooms" },
          { label: "Garden Terraces & Suites", href: "#rooms" },
          { label: "Riverside Cottage", href: "#rooms" }
        ]
      },
      {
        id: "eat",
        label: "Eat",
        href: "#categories",
        subItems: [
          { label: "Morii Restaurant", href: "#categories" },
          { label: "The Garden Lounge", href: "#categories" },
          { label: "The Courtyard Patio", href: "#categories" }
        ]
      },
      {
        id: "play",
        label: "Play",
        href: "#play",
        subItems: [
          { label: "Historic Botanical Gardens", href: "#play" },
          { label: "Liesbeek River Walk", href: "#play" },
          { label: "Angsana Spa & Heated Pool", href: "#play" }
        ]
      },
      {
        id: "meet",
        label: "Meet",
        href: "#categories",
        subItems: [
          { label: "Conference Centre", href: "#categories" },
          { label: "Executive Boardrooms", href: "#categories" },
          { label: "Outdoor Pavilion", href: "#categories" }
        ]
      },
      {
        id: "news",
        label: "Stories",
        href: "#diaries"
      }
    ],
    secondary: [
      { label: "Special Offers", href: "#offers" },
      { label: "Estate Map", href: "#map" },
      { label: "Guest Information", href: "#faq" }
    ]
  },
  hero: {
    overline: "Newlands, Cape Town",
    title: "Reawaken your sense of wonder",
    subtitle: "There is a sanctuary at the foot of Table Mountain where time softly slows, ancient trees whisper to the river, and refined hospitality welcomes you home.",
    bgImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2400&q=85",
    dockedNote: "Best Rate Guarantee · Complimentary Wine Tastings Daily · Forest Gardens"
  },
  trustBar: [
    {
      id: "best-rate",
      title: "Direct Booking Guarantee",
      subtitle: "Best available rate guaranteed with flexible dates",
      icon: "ShieldCheck"
    },
    {
      id: "wine-tasting",
      title: "Complimentary Tastings",
      subtitle: "Daily cellar selections curated by our resident sommelier",
      icon: "Wine"
    },
    {
      id: "sanctuary",
      title: "8-Acre Native Forest",
      subtitle: "Private riverside walking trails and mountain panorama",
      icon: "TreePine"
    }
  ],
  categories: [
    {
      id: "sleep",
      label: "01 / Sanctuary",
      title: "Sleep",
      headline: "Rooms shaped by natural light and mountain tranquility",
      description: "Each room and suite opens outward to the gardens or the silhouette of Table Mountain, dressed in organic linens, bespoke Cape oak furniture, and quiet luxury.",
      cta: "Discover Our Rooms",
      ctaLink: "#rooms",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      bgImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2000&q=80"
    },
    {
      id: "eat",
      label: "02 / Gastronomy",
      title: "Eat",
      headline: "Artisanal Cape cuisine infused with garden botanicals",
      description: "From morning breakfast overlooking the manicured lawns to twilight dining at Morii, savor sustainable ocean catch, estate-grown greens, and award-winning Cape vintages.",
      cta: "Explore Dining",
      ctaLink: "#categories",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
      bgImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80"
    },
    {
      id: "play",
      label: "03 / Reconnection",
      title: "Play",
      headline: "A living canvas of botanical trails, river ponds, and wellness",
      description: "Lose track of hours wandering among 300-year-old indigenous trees, greet our resident leopard tortoises, or submerge yourself in heated garden hydrotherapy at the Spa.",
      cta: "Discover Experiences",
      ctaLink: "#play",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      bgImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80"
    },
    {
      id: "meet",
      label: "04 / Gather",
      title: "Meet",
      headline: "Inspiring conference spaces framed by mountain vistas",
      description: "State-of-the-art green event facilities designed to spark imagination, host international symposiums, or celebrate milestone gatherings in sunlit halls.",
      cta: "Plan an Event",
      ctaLink: "#categories",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
      bgImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2000&q=80"
    }
  ],
  rooms: {
    overline: "Private Retreats",
    title: "Unplug, reconnect, and rejuvenate",
    description: "Wake to birdsong on the wooded banks of the Liesbeek River, watch morning mist lift off Table Mountain, and rest in meticulously crafted guest suites.",
    items: [
      {
        id: "main-hotel",
        name: "Main Hotel Deluxe Suites",
        category: "Classic Manor",
        pricePerNight: "ZAR 4,850",
        size: "46 m² / 495 sq ft",
        capacity: "Up to 2 Guests",
        view: "Courtyard & Mountain Peak",
        description: "Elegant heritage-inspired rooms located in the original manor wing, featuring custom upholstered headboards, private balconies, marble rain showers, and curated contemporary South African art.",
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
        features: ["King Bed / Twin Option", "Private French Balcony", "Nespresso Atelier", "Complimentary Decanter"]
      },
      {
        id: "garden-rooms",
        name: "Garden Heritage Terraces",
        category: "Botanical Wing",
        pricePerNight: "ZAR 6,200",
        size: "58 m² / 624 sq ft",
        capacity: "Up to 3 Guests",
        view: "Manicured Lawns & Forest",
        description: "Secluded garden-facing sanctuaries with sun-drenched private stone verandas stepping directly onto green lawns. Designed with soothing earth tones and acoustic seclusion.",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
        features: ["Ground Floor Stone Patio", "Free-Standing Soaking Tub", "Walk-in Wardrobe", "Yoga & Meditation Mat"]
      },
      {
        id: "riverside-villa",
        name: "Liesbeek Riverside Residence",
        category: "Private Villa",
        pricePerNight: "ZAR 12,500",
        size: "115 m² / 1,237 sq ft",
        capacity: "Up to 4 Guests",
        view: "River & Mountain Slopes",
        description: "A two-bedroom private residence bordered by ancient yellowwood trees and the babbling river, complete with private dining salon, open fireplace, and dedicated concierge host.",
        image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
        features: ["Two Master En-Suites", "Wood-Burning Fireplace", "Personal Host", "Private Garden Plunge Pool"]
      }
    ]
  },
  mediaStagger: [
    {
      id: "media-1",
      caption: "The Forest Canopies",
      subcaption: "Centuries of peaceful preservation",
      aspectRatio: "aspect-[4/5]",
      image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "media-2",
      caption: "Twilight Wine Rituals",
      subcaption: "Curated vintages at dusk",
      aspectRatio: "aspect-[16/9]",
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1400&q=80"
    },
    {
      id: "media-3",
      caption: "Morning Reflections",
      subcaption: "The lower botanical lotus ponds",
      aspectRatio: "aspect-square",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
    }
  ],
  reviews: {
    title: "What Our Guests Say",
    subtitle: "Stories from travelers who found their stillness",
    items: [
      {
        id: "rev-1",
        quote: "The hotel possesses a warm, soulful heartbeat. As return guests, being greeted by name while Table Mountain glowed gold in the background reminded us why this estate is truly unmatched in Cape Town.",
        guest: "Claire & David Thornton",
        origin: "London, United Kingdom",
        rating: 5
      },
      {
        id: "rev-2",
        quote: "Wandering through the 8-acre forest each morning with a fresh coffee, watching the resident tortoises graze peacefully along the riverbed—pure magic. Exceptional hospitality down to every detail.",
        guest: "Johannes van der Merwe",
        origin: "Stellenbosch, South Africa",
        rating: 5
      },
      {
        id: "rev-3",
        quote: "The seamless blend of Cape architectural heritage and modern intuitive design makes you feel both pampered and deeply relaxed. The sommelier wine tastings were an unforgettable highlight.",
        guest: "Elena Rostova",
        origin: "Zurich, Switzerland",
        rating: 5
      }
    ]
  },
  playNature: {
    overline: "Wander & Discover",
    title: "A place to slow down on tortoise time",
    description: "Wide open lawns invite you to breathe deep, reflect, and explore. Wander along forest paths flanked by ancient trees, encounter wild tortoises ambling through morning dew, and rediscover how revitalizing nature can be.",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2200&q=80",
    cta: "Explore Our Grounds",
    ctaLink: "#map"
  },
  estateMap: {
    overline: "Interactive Grounds Map",
    title: "Explore the Estate & Walking Trails",
    description: "Click any landmark pinpoint to explore spatial photography, heritage notes, and 3D walkthrough vistas.",
    mapImage: "https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=2000&q=80",
    pins: [
      {
        id: "pin-lobby",
        name: "Historic Manor Lobby",
        category: "Reception & Heritage",
        x: 48,
        y: 42,
        description: "The welcoming foyer of the 1799 homestead featuring original Cape Dutch woodwork and registration desk.",
        thumbnail: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "pin-courtyard",
        name: "The Sunlit Courtyard",
        category: "Patio & Coffee",
        x: 42,
        y: 52,
        description: "An open-air cobblestone square surrounded by climbing jasmine, serving artisanal coffee and high tea.",
        thumbnail: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "pin-morii",
        name: "Morii Restaurant & Cellar",
        category: "Fine Dining",
        x: 55,
        y: 48,
        description: "Signature culinary destination spotlighting locally foraged botanicals and premier Western Cape wines.",
        thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "pin-conference",
        name: "Botanical Conference Centre",
        category: "Events & Meetings",
        x: 68,
        y: 35,
        description: "Award-winning, environmentally sustainable meeting halls with panoramic mountain vistas.",
        thumbnail: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "pin-pond",
        name: "Lower Lily Pond",
        category: "Nature & Tortoises",
        x: 32,
        y: 65,
        description: "Natural wetland pond home to our protected resident leopard tortoises and native water lilies.",
        thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "pin-river",
        name: "Liesbeek River Boardwalk",
        category: "Walking Trails",
        x: 20,
        y: 75,
        description: "A tranquil wooden footway tracing the riverbanks under shaded tree canopies.",
        thumbnail: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  offers: {
    overline: "Invitations & Escapes",
    title: "Curated seasonal stays",
    description: "Linger longer with exclusive privileges crafted for wellness, culinary exploration, and restorative holidays.",
    items: [
      {
        id: "offer-direct",
        title: "Stay 4, Pay 3 Linger Longer",
        badge: "Direct Exclusive",
        description: "Extend your Cape Town retreat. Enjoy a complimentary fourth night, daily gourmet breakfast, and a chilled bottle of estate bubbly on arrival.",
        validity: "Valid through May 2027",
        image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
        cta: "View Offer"
      },
      {
        id: "offer-wine",
        title: "Sommelier Masterclass & Tasting",
        badge: "Complimentary Experience",
        description: "Join our cellar master every Tuesday and Thursday evening for an intimate tasting journey through Cape boutique terroirs.",
        validity: "Year-Round Stays",
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
        cta: "View Offer"
      },
      {
        id: "offer-spa",
        title: "Botanical Rest & Rejuvenation",
        badge: "Wellness Package",
        description: "Includes luxury garden suite stay, 90-minute bespoke couple’s massage, hydrotherapy access, and organic herbal tea rituals.",
        validity: "Weekend Stays",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
        cta: "View Offer"
      }
    ]
  },
  diaries: {
    overline: "Diaries & Discoveries",
    title: "Tales from our mountain sanctuary",
    items: [
      {
        id: "story-1",
        title: "Life of a Micro-green: Sustainability in our Kitchens",
        category: "Gastronomy & Earth",
        readTime: "4 min read",
        date: "October 2026",
        excerpt: "How our executive culinary team cultivates zero-mile herbs and edible flora directly on the estate slopes.",
        image: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80",
        slug: "sustainability-micro-greens"
      },
      {
        id: "story-2",
        title: "We Dare You to Join Us on Tortoise Time",
        category: "Estate Life",
        readTime: "3 min read",
        date: "September 2026",
        excerpt: "Meet our centenarian resident tortoises and learn the profound art of slowing down in a fast-paced world.",
        image: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=800&q=80",
        slug: "tortoise-time-philosophy"
      },
      {
        id: "story-3",
        title: "The Eastern Slopes: Our Wild Mountain Backyard",
        category: "Nature & Hiking",
        readTime: "5 min read",
        date: "August 2026",
        excerpt: "Hidden indigenous botanical wonders, secret water streams, and hiking loops leading from our grounds to Kirstenbosch.",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
        slug: "eastern-slopes-backyard"
      }
    ]
  },
  faq: {
    overline: "Practical Information",
    title: "Everything you need for an effortless stay",
    items: [
      {
        id: "faq-1",
        question: "What are your standard check-in and check-out times?",
        answer: "Check-in begins at 14:00 and check-out is by 11:00. Early arrivals and late check-outs are accommodated based on availability upon request. We offer luggage storage and access to the Garden Lounge and heated pool before your room is ready."
      },
      {
        id: "faq-2",
        question: "Are the gardens open for all staying hotel guests?",
        answer: "Yes, our private 8-acre historic gardens, walking trails, and riverside boardwalk are accessible exclusively for hotel guests and restaurant patrons daily from dawn until dusk."
      },
      {
        id: "faq-3",
        question: "How do complimentary wine tastings work?",
        answer: "Resident hotel guests are cordially invited to our sommelier-hosted tastings in the lounge or cellar every evening between 17:30 and 18:30. No prior reservation is required."
      },
      {
        id: "faq-4",
        question: "Is airport transportation available from Cape Town International?",
        answer: "Yes, our concierge team coordinates private luxury transfers between Cape Town International Airport (approx. 20 minutes) and the hotel with advance booking."
      },
      {
        id: "faq-5",
        question: "Are children welcome at the hotel?",
        answer: "Children of all ages are warmly welcomed. We offer interconnecting suites, baby-sitting services, child-friendly garden menus, and tortoise-feeding educational walks."
      }
    ]
  },
  instagram: {
    handle: "@thevineyardheritage",
    hashtag: "#VineyardMoments",
    items: [
      { id: "ig-1", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80", likes: "1.4k" },
      { id: "ig-2", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80", likes: "982" },
      { id: "ig-3", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80", likes: "2.1k" },
      { id: "ig-4", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80", likes: "1.8k" },
      { id: "ig-5", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80", likes: "1.2k" },
      { id: "ig-6", image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80", likes: "3.4k" }
    ]
  },
  footer: {
    curtainCta: {
      headline: "Begin your mountain journey",
      subline: "Step into our tranquil Newlands sanctuary and create memories that endure.",
      buttonText: "Reserve Your Sanctuary",
      bgImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=80"
    },
    columns: [
      {
        title: "Sanctuary",
        links: [
          { label: "Main Hotel Rooms", href: "#rooms" },
          { label: "Garden Terraces", href: "#rooms" },
          { label: "Riverside Residences", href: "#rooms" },
          { label: "Special Offers", href: "#offers" }
        ]
      },
      {
        title: "Experiences",
        links: [
          { label: "Morii Restaurant", href: "#categories" },
          { label: "Garden Lounge & High Tea", href: "#categories" },
          { label: "Angsana Spa & Wellness", href: "#play" },
          { label: "Sommelier Wine Tastings", href: "#offers" }
        ]
      },
      {
        title: "Gather",
        links: [
          { label: "Conference Center", href: "#categories" },
          { label: "Bespoke Weddings", href: "#categories" },
          { label: "Corporate Retreats", href: "#categories" },
          { label: "Event Inquiries", href: "#" }
        ]
      },
      {
        title: "The Estate",
        links: [
          { label: "Historic Grounds Map", href: "#map" },
          { label: "Our 1799 Heritage", href: "#diaries" },
          { label: "Sustainability Pledge", href: "#diaries" },
          { label: "Careers", href: "#" }
        ]
      }
    ],
    newsletter: {
      title: "Invitations & Private Selections",
      description: "Receive our seasonal editorial journal, exclusive retreat packages, and wine harvest invitations.",
      placeholder: "Enter your email address"
    },
    legal: "© 2026 The Vineyard Heritage Hotel & Spa. Original production-grade creative engineering recreation."
  }
};

