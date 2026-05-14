import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const host = siteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/nb/godkjenning", "/en/godkjenning"],
      },
    ],
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}
