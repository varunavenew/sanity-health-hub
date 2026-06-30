import { buildLlmsTxt } from "@/lib/seo/llms-txt";
import { fetchCmsRouteIndex } from "@/lib/routing/fetch-route-index";

export const dynamic = "force-dynamic";

export async function GET() {
  let index = null;
  try {
    index = await fetchCmsRouteIndex();
  } catch {
    /* CMS optional at runtime */
  }

  const body = buildLlmsTxt(index);

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
