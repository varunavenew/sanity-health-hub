import type { NextRequest } from "next/server";
import { proxyLegacySeRequest } from "@/lib/legacy-se-proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ path?: string[] }> };

async function handle(request: NextRequest, _context: RouteContext) {
  return proxyLegacySeRequest(request);
}

export const GET = handle;
export const HEAD = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
