/** Legacy Metodika embed URL — retired; return 410 Gone for crawlers and old bookmarks. */
export const dynamic = "force-static";

export function GET() {
  return new Response("This booking endpoint has been removed.", {
    status: 410,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

export const HEAD = GET;
