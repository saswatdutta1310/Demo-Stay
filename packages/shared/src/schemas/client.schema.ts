import { z } from "zod";

export const ClientConfigSchema = z.object({
  name: z.string().min(1),
  tagline: z.string(),
  theme: z.enum(["modern", "classic", "minimal"]).default("modern"),
  primaryColor: z.string().default("#b45309"),
  contact: z.object({
    phone: z.string(),
    whatsapp: z.string(),
    email: z.string().email(),
    address: z.string()
  }),
  map: z.object({
    lat: z.number(),
    lng: z.number(),
    zoom: z.number().default(15)
  }),
  featureFlags: z.object({
    enableReviews: z.boolean().default(true),
    enableGallery: z.boolean().default(true),
    enableOwnerPortal: z.boolean().default(true),
    enableFaq: z.boolean().default(true)
  })
});

export const RoomSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  price: z.number().positive(),
  capacity: z.number().int().min(1),
  unitsAvailable: z.number().int().min(1),
  description: z.string(),
  amenities: z.array(z.string()),
  images: z.array(z.string()),
  bedType: z.string().default("Double Bed")
});

export const RoomsConfigSchema = z.array(RoomSchema);

export const PoliciesConfigSchema = z.object({
  checkInTime: z.string().default("12:00 PM"),
  checkOutTime: z.string().default("11:00 AM"),
  cancellation: z.string(),
  idRules: z.array(z.string()),
  coupleRules: z.string(),
  childRules: z.string()
});

export const ContentConfigSchema = z.object({
  about: z.string(),
  faqs: z.array(
    z.object({
      question: z.string(),
      answer: z.string()
    })
  ),
  nearbyPlaces: z.array(
    z.object({
      name: z.string(),
      distance: z.string(),
      type: z.string()
    })
  ),
  testimonials: z.array(
    z.object({
      guest: z.string(),
      city: z.string(),
      rating: z.number().min(1).max(5),
      comment: z.string()
    })
  )
});
