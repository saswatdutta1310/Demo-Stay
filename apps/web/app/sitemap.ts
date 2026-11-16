import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://demo-stay.com";

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/rooms`, lastModified: new Date() },
    { url: `${baseUrl}/gallery`, lastModified: new Date() },
    { url: `${baseUrl}/location`, lastModified: new Date() },
    { url: `${baseUrl}/policies`, lastModified: new Date() },
    { url: `${baseUrl}/faq`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() }
  ];
}
