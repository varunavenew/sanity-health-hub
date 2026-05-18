import type { MetadataRoute } from "next";
import { isProductionDeploy, siteUrl } from "@/lib/env";
import { robotsDisallowPaths } from "@/lib/seo/robots-paths";

export default function robots(): MetadataRoute.Robots {
  const host = siteUrl();

  if (!isProductionDeploy()) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: robotsDisallowPaths(),
      },
    ],
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}
