import { isProductionDeploy, siteUrl } from "@/lib/env";
import { AI_CRAWLER_USER_AGENTS } from "@/lib/seo/ai-crawler-user-agents";
import { robotsDisallowPaths } from "@/lib/seo/robots-paths";

export const dynamic = "force-dynamic";

/**
 * Raw text handler (not the `robots.ts` MetadataRoute convention) — Next's
 * typed convention expands an array-valued `userAgent` into one repeated
 * block per name in the actual output text, it does not stack multiple
 * `User-agent:` lines under one shared directive block. Writing the file
 * directly gives real robots.txt-spec grouping: every AI/answer-engine
 * crawler gets its own `User-agent:` line, followed by a single shared
 * Allow/Disallow set, instead of the same list repeated once per crawler.
 */
export async function GET() {
  const host = siteUrl();

  if (!isProductionDeploy()) {
    return new Response("User-agent: *\nDisallow: /\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const disallow = robotsDisallowPaths();
  const disallowLines = disallow.map((path) => `Disallow: ${path}`).join("\n");

  const body =
    [
      "User-agent: *",
      "Allow: /",
      disallowLines,
      "",
      ...AI_CRAWLER_USER_AGENTS.map((ua) => `User-agent: ${ua}`),
      "Allow: /",
      disallowLines,
      "",
      `Sitemap: ${host}/sitemap.xml`,
      `Host: ${host}`,
    ].join("\n") + "\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
