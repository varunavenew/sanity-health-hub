import type { MetadataRoute } from "next";
import { isProductionDeploy, siteUrl } from "@/lib/env";
import { AI_CRAWLER_USER_AGENTS } from "@/lib/seo/ai-crawler-user-agents";
import { robotsDisallowPaths } from "@/lib/seo/robots-paths";

export default function robots(): MetadataRoute.Robots {
  const host = siteUrl();

  if (!isProductionDeploy()) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  const disallow = robotsDisallowPaths();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      ...AI_CRAWLER_USER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/" as const,
        disallow,
      })),
    ],
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}
