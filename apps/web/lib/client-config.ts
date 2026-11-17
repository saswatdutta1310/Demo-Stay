import fs from "fs";
import path from "path";
import {
  ClientConfigSchema,
  RoomsConfigSchema,
  PoliciesConfigSchema,
  ContentConfigSchema,
  ClientConfig,
  Room,
  PoliciesConfig,
  ContentConfig
} from "@hotel-demo/shared";

export function getClientConfig(): {
  config: ClientConfig;
  rooms: Room[];
  policies: PoliciesConfig;
  content: ContentConfig;
} {
  const clientSlug = process.env.CLIENT || "gayatree-stay";
  const clientDir = path.resolve(process.cwd(), `../../clients/${clientSlug}`);

  try {
    const config = ClientConfigSchema.parse(
      JSON.parse(fs.readFileSync(path.join(clientDir, "config.json"), "utf-8"))
    );
    const rooms = RoomsConfigSchema.parse(
      JSON.parse(fs.readFileSync(path.join(clientDir, "rooms.json"), "utf-8"))
    );
    const policies = PoliciesConfigSchema.parse(
      JSON.parse(fs.readFileSync(path.join(clientDir, "policies.json"), "utf-8"))
    );
    const content = ContentConfigSchema.parse(
      JSON.parse(fs.readFileSync(path.join(clientDir, "content.json"), "utf-8"))
    );

    return { config, rooms, policies, content };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    // Fallback for building or when client is not found
    return {
      config: ClientConfigSchema.parse({
        slug: "demo-stay",
        name: "Demo Stay",
        tagline: "Comfortable Accommodations",
        theme: {
          primary: "#b45309",
          accent: "#fef3c7",
          background: "#ffffff",
          ink: "#1c1917",
          fontHeading: "Cinzel, serif",
          fontBody: "Inter, sans-serif"
        },
        contact: {
          phone: "+91 98765 43210",
          whatsapp: "+919876543210",
          email: "bookings@demostay.com",
          address: "Demo Road, Odisha"
        },
        location: { lat: 19.8135, lng: 85.8312, address: "Demo Road, Odisha" },
        map: { lat: 19.8135, lng: 85.8312, zoom: 15, address: "Demo Road, Odisha" },
        payments: { mode: "test", payAtHotel: true },
        features: {
          enableReviews: true,
          enableGallery: true,
          enableOwnerPortal: true,
          enableFaq: true
        }
      }),
      rooms: [],
      policies: {
        checkInTime: "12:00 PM",
        checkOutTime: "11:00 AM",
        cancellation: "48h free cancellation",
        idRules: ["Govt Photo ID required"],
        coupleRules: "Couples welcome",
        childRules: "Children under 6 stay free"
      },
      content: {
        about: "Welcome to our guest house.",
        faqs: [],
        nearbyPlaces: [],
        testimonials: []
      }
    };
  }
}
