import { buildLlmsTxt } from "@/lib/seo/llms-txt";
import { fetchCmsRouteIndex } from "@/lib/routing/fetch-route-index";
import { isProductionDeploy } from "@/lib/env";
import { applyStagingCrawlBlockHeaders } from "@/lib/seo/staging-crawl-block";

export const dynamic = "force-dynamic";

export async function GET() {
  let index = null;
  try {
    index = await fetchCmsRouteIndex();
  } catch {
    /* CMS optional at runtime */
  }

  const body = isProductionDeploy()
    ? buildLlmsTxt(index)
    : "# CMedical staging — not for indexing\n";

  const headers = new Headers({
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": isProductionDeploy()
      ? "public, max-age=3600, s-maxage=3600"
      : "no-store",
  });
  applyStagingCrawlBlockHeaders(headers);

  return new Response(body, { headers });
}
