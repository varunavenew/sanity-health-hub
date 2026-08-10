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
      // One shared block for all named AI/answer-engine crawlers (GEO) —
      // grouping them under a single rule (multiple User-agent lines,
      // one directive set) instead of repeating the same Allow/Disallow
      // list once per crawler name.
      {
        userAgent: [...AI_CRAWLER_USER_AGENTS],
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}
