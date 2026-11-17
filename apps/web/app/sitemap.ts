import { MetadataRoute } from "next";
import { getClientConfig } from "@/lib/client-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.WEB_URL || "https://demo-stay.com";
  const { rooms } = getClientConfig();

  const staticPages = [
    "",
    "/rooms",
    "/gallery",
    "/location",
    "/policies",
    "/faq",
    "/contact",
    "/book",
    "/my-booking",
    "/legal/privacy",
    "/legal/terms",
    "/legal/refunds"
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1.0 : 0.8
  }));

  const roomPages = rooms.map((room) => ({
    url: `${baseUrl}/rooms/${room.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9
  }));

  return [...staticPages, ...roomPages];
}
