import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import {
  invalidationPlanFromSanityDoc,
  SANITY_CACHE_TAGS,
  type SanityDocRef,
} from "@/lib/sanity/sanity-revalidate";

/**
 * Sanity → Next.js on-demand revalidation.
 *
 * Configure a Sanity webhook (HTTP POST) pointing to this route with header
 * `x-sanity-revalidate-secret: <SANITY_REVALIDATE_SECRET>`.
 *
 * Recommended GROQ projection on the webhook so `body` includes `_type` and
 * `slug` (and for treatments optionally `parentSlug` / `categorySlug`):
 *
 * `*[_id in ^.ids][0]{ _type, slug, "slugBefore": slug, parentSlug, categorySlug }`
 *
 * For slug changes, configure the webhook to also send the previous slug as
 * `slugBefore` (e.g. via a before/after projection) so old URLs are invalidated.
 *
 * If the body cannot be parsed to a document, all entries tagged `sanity` are invalidated.
 */

function readSecret(request: Request): string | null {
  const header = request.headers.get("x-sanity-revalidate-secret");
  if (header) return header;
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7).trim();
  return null;
}

function extractDocument(body: Record<string, unknown>): SanityDocRef | null {
  const candidates: unknown[] = [body, body.document, body.result];
  for (const c of candidates) {
    if (
      c &&
      typeof c === "object" &&
      "_type" in c &&
      typeof (c as { _type: unknown })._type === "string"
    ) {
      return c as SanityDocRef;
    }
  }
  return null;
}

export async function POST(request: Request) {
  const expected = process.env.SANITY_REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json(
      { message: "SANITY_REVALIDATE_SECRET is not configured" },
      { status: 503 },
    );
  }

  const secret = readSecret(request);
  if (secret !== expected) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (typeof body.dataset === "string" && dataset && body.dataset !== dataset) {
    return NextResponse.json(
      { message: "Dataset mismatch", dataset: body.dataset },
      { status: 400 },
    );
  }

  const tags = new Set<string>();
  const paths = new Set<string>();

  if (Array.isArray(body.revalidateTags)) {
    for (const t of body.revalidateTags) {
      if (typeof t === "string" && t.length > 0) tags.add(t);
    }
  }

  const doc = extractDocument(body);
  if (doc?._type) {
    const plan = await invalidationPlanFromSanityDoc(doc);
    plan.tags.forEach((t) => tags.add(t));
    plan.paths.forEach((p) => paths.add(p));
  } else if (tags.size === 0) {
    tags.add(SANITY_CACHE_TAGS.all);
  }

  const tagList = [...tags];
  const pathList = [...paths];

  for (const t of tagList) {
    revalidateTag(t);
  }
  for (const p of pathList) {
    revalidatePath(p);
  }

  return NextResponse.json({
    revalidated: true,
    tags: tagList,
    paths: pathList,
    now: Date.now(),
  });
}

export function GET() {
  return NextResponse.json({ message: "POST JSON webhook payloads only" }, { status: 405 });
}
