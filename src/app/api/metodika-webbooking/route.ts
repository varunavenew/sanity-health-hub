/** Legacy Metodika embed URL — retired; return 410 Gone for crawlers and old bookmarks. */
export const dynamic = "force-static";

function gone() {
  return new Response("This booking endpoint has been removed.", {
    status: 410,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

export function GET() {
  return gone();
}

export const HEAD = GET;
export const POST = GET;
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
