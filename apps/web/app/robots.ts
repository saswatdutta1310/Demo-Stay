import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Disallow indexing by default during demo / showcase mode
  return {
    rules: {
      userAgent: "*",
      disallow: "/"
    }
  };
}
