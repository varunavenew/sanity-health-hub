import { buildLlmsTxt } from "@/lib/seo/llms-txt";
import { fetchCmsRouteIndex } from "@/lib/routing/fetch-route-index";
import {
  applyStagingCrawlBlockHeaders,
  getHostFromHeaderBag,
  isProductionSiteHost,
} from "@/lib/seo/staging-crawl-block";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const host = getHostFromHeaderBag(new Headers(request.headers));
  const productionHost = isProductionSiteHost(host);

  let index = null;
  try {
    index = await fetchCmsRouteIndex();
  } catch {
    /* CMS optional at runtime */
  }

  const body = productionHost
    ? buildLlmsTxt(index)
    : "# CMedical staging — not for indexing\n";

  const headers = new Headers({
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": productionHost
      ? "public, max-age=3600, s-maxage=3600"
      : "no-store",
  });
  applyStagingCrawlBlockHeaders(headers, host);

  return new Response(body, { headers });
}
