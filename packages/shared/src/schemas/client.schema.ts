import { z } from "zod";
import { BOOKING_STATUSES, PAYMENT_STATUSES, ACCEPTED_ID_TYPES } from "../constants";

export const ThemeConfigSchema = z.object({
  primary: z.string().default("#b45309"),
  accent: z.string().default("#fef3c7"),
  background: z.string().default("#ffffff"),
  ink: z.string().default("#1c1917"),
  fontHeading: z.string().default("Cinzel, serif"),
  fontBody: z.string().default("Inter, sans-serif")
});

export const ContactConfigSchema = z.object({
  phone: z.string(),
  whatsapp: z.string(),
  email: z.string().email(),
  address: z.string().optional()
});

export const LocationConfigSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  address: z.string().default("")
});

export const PaymentsConfigSchema = z.object({
  mode: z.enum(["test", "live"]).default("test"),
  payAtHotel: z.boolean().default(true)
});

export const FeaturesConfigSchema = z.object({
  enableReviews: z.boolean().default(true),
  enableGallery: z.boolean().default(true),
  enableOwnerPortal: z.boolean().default(true),
  enableFaq: z.boolean().default(true)
}).catchall(z.boolean());

export const ClientConfigSchema = z.object({
  slug: z.string().default("gayatree-stay"),
  name: z.string().min(1),
  tagline: z.string(),
  theme: z.union([ThemeConfigSchema, z.string()]).transform((val) => {
    if (typeof val === "string") {
      return {
        primary: "#b45309",
        accent: "#fef3c7",
        background: "#ffffff",
        ink: "#1c1917",
        fontHeading: "Cinzel, serif",
        fontBody: "Inter, sans-serif"
      };
    }
    return val;
  }),
  contact: ContactConfigSchema,
  location: LocationConfigSchema.optional(),
  map: LocationConfigSchema.extend({ zoom: z.number().default(15) }).optional(),
  payments: PaymentsConfigSchema.default({ mode: "test", payAtHotel: true }),
  features: FeaturesConfigSchema.default({
    enableReviews: true,
    enableGallery: true,
    enableOwnerPortal: true,
    enableFaq: true
  }),
  featureFlags: FeaturesConfigSchema.optional()
}).transform((data) => {
  const contactAddress = data.contact.address || "";
  const location = data.location || (data.map ? {
    lat: data.map.lat,
    lng: data.map.lng,
    address: contactAddress
  } : {
    lat: 19.8135,
    lng: 85.8312,
    address: contactAddress
  });
  const features = data.features || data.featureFlags || {
    enableReviews: true,
    enableGallery: true,
    enableOwnerPortal: true,
    enableFaq: true
  };
  const theme = typeof data.theme === "object" && data.theme !== null ? data.theme : {
    primary: "#b45309",
    accent: "#fef3c7",
    background: "#ffffff",
    ink: "#1c1917",
    fontHeading: "Cinzel, serif",
    fontBody: "Inter, sans-serif"
  };
  const map = data.map || {
    lat: location.lat,
    lng: location.lng,
    zoom: 15
  };
  return {
    ...data,
    theme,
    primaryColor: theme.primary,
    location,
    map,
    features
  };
});

export const RoomSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  sizeSqFt: z.number().positive().default(220),
  bed: z.string().default("Double Bed"),
  bedType: z.string().optional(),
  maxGuests: z.number().int().min(1).default(2),
  capacity: z.number().int().min(1).optional(),
  amenities: z.array(z.string()).default([]),
  basePrice: z.number().positive().default(1500),
  price: z.number().positive().optional(),
  taxPerNight: z.number().nonnegative().default(180),
  units: z.number().int().min(1).default(1),
  unitsAvailable: z.number().int().min(1).optional(),
  images: z.array(z.string()).default([]),
  description: z.string().optional()
}).transform((data) => {
  const bed = data.bed || data.bedType || "Double Bed";
  const maxGuests = data.maxGuests || data.capacity || 2;
  const basePrice = data.basePrice || data.price || 1500;
  const units = data.units || data.unitsAvailable || 1;
  const taxPerNight = data.taxPerNight || Math.round(basePrice * 0.12);
  return {
    ...data,
    bed,
    maxGuests,
    basePrice,
    units,
    taxPerNight,
    capacity: maxGuests,
    price: basePrice,
    unitsAvailable: units,
    bedType: bed
  };
});

export const RoomsConfigSchema = z.array(RoomSchema);

export const PoliciesConfigSchema = z.object({
  checkInTime: z.string().default("12:00 PM"),
  checkOutTime: z.string().default("11:00 AM"),
  cancellation: z.string().default("Free cancellation up to 48 hours before check-in"),
  idRules: z.array(z.string()).default([
    "Valid government-issued photo ID required for every adult guest (Aadhaar, Passport, Driving License, or Govt ID)."
  ]),
  coupleRules: z.string().default("Couples are welcomed with valid individual photo ID proofs."),
  childRules: z.string().default("Children under 6 years stay free with existing bedding.")
});

export const ContentConfigSchema = z.object({
  about: z.string().default("Welcome to Demo Stay."),
  faqs: z.array(
    z.object({
      question: z.string(),
      answer: z.string()
    })
  ).default([]),
  nearbyPlaces: z.array(
    z.object({
      name: z.string(),
      distance: z.string(),
      type: z.string()
    })
  ).default([]),
  testimonials: z.array(
    z.object({
      guest: z.string(),
      city: z.string(),
      rating: z.number().min(1).max(5),
      comment: z.string()
    })
  ).default([])
});

export const GuestSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  idType: z.enum(ACCEPTED_ID_TYPES).optional(),
  idNumber: z.string().optional(),
  createdAt: z.string().or(z.date()).optional()
});

export const PaymentSchema = z.object({
  id: z.string().optional(),
  bookingId: z.string(),
  amount: z.number().positive(),
  currency: z.string().default("INR"),
  status: z.enum(PAYMENT_STATUSES).default("CREATED"),
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string().optional(),
  razorpaySignature: z.string().optional(),
  createdAt: z.string().or(z.date()).optional()
});

export const BookingSchema = z.object({
  id: z.string().optional(),
  code: z.string(),
  roomId: z.string(),
  guestId: z.string().optional(),
  guest: GuestSchema.optional(),
  guestName: z.string().default(""),
  guestEmail: z.string().default(""),
  guestPhone: z.string().default(""),
  checkIn: z.string().or(z.date()),
  checkOut: z.string().or(z.date()),
  nights: z.number().int().min(1),
  guestsCount: z.number().int().min(1).default(1),
  baseAmount: z.number().nonnegative(),
  taxAmount: z.number().nonnegative(),
  totalAmount: z.number().positive(),
  status: z.enum(BOOKING_STATUSES).default("PENDING"),
  holdExpiresAt: z.string().or(z.date()).optional(),
  specialRequests: z.string().optional(),
  payments: z.array(PaymentSchema).optional(),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional()
});
