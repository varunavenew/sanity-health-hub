import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanityClient";

/**
 * Server proxy for browser GROQ fetches.
 *
 * The `developer` dataset is private, so the browser cannot query Sanity
 * directly without exposing SANITY_TOKEN. Client hooks POST here instead;
 * the route uses the server-side token-bearing client.
 *
 * Body: { query: string, params?: Record<string, unknown> }
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ message: "Expected object body" }, { status: 400 });
  }

  const { query, params } = body as {
    query?: unknown;
    params?: unknown;
  };

  if (typeof query !== "string" || query.trim().length === 0) {
    return NextResponse.json({ message: "query must be a non-empty string" }, { status: 400 });
  }
  if (query.length > 100_000) {
    return NextResponse.json({ message: "query too large" }, { status: 400 });
  }
  if (params !== undefined && (typeof params !== "object" || params === null || Array.isArray(params))) {
    return NextResponse.json({ message: "params must be an object" }, { status: 400 });
  }

  try {
    const data = await sanityClient.fetch(query, (params ?? {}) as Record<string, unknown>);
    return NextResponse.json({ data });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[api/sanity/groq]", message);
    return NextResponse.json({ message: "Sanity query failed", error: message }, { status: 502 });
  }
}
