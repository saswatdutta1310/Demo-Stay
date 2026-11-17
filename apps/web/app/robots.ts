import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isDemo = process.env.DEMO_MODE === "true";

  if (isDemo) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/"
      }
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/owner", "/owner/*", "/api/*"]
    },
    sitemap: "https://demo-stay.com/sitemap.xml"
  };
}
