import fs from "fs";
import path from "path";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

const ASSETS_DIR = path.join(process.cwd(), "src/assets");
const R2_CDN =
  process.env.L5E_ASSETS_CDN_URL ??
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev";
const L5E_PROJECT_ID =
  process.env.L5E_PROJECT_ID ?? "3dcc4aff-3deb-44f0-b035-de0201b2a94e";

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  mp4: "video/mp4",
};

function contentTypeFor(filename: string): string {
  const ext = path.extname(filename).slice(1).toLowerCase();
  return MIME[ext] ?? "application/octet-stream";
}

function findFileByName(dir: string, filename: string): string | null {
  if (!fs.existsSync(dir)) return null;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isFile() && entry.name === filename) return full;
    if (entry.isDirectory() && !entry.name.startsWith(".")) {
      const found = findFileByName(full, filename);
      if (found) return found;
    }
  }
  return null;
}

function findLocalAsset(assetId: string, filename: string): string | null {
  const direct = findFileByName(ASSETS_DIR, filename);
  if (direct) return direct;

  function walkAssetJson(dir: string): string | null {
    if (!fs.existsSync(dir)) return null;

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isFile() && entry.name.endsWith(".asset.json")) {
        try {
          const meta = JSON.parse(fs.readFileSync(full, "utf8")) as {
            asset_id?: string;
            original_filename?: string;
          };
          if (meta.asset_id !== assetId) continue;
          const original = meta.original_filename ?? filename;
          const sibling = path.join(path.dirname(full), original);
          if (fs.existsSync(sibling)) return sibling;
          const anywhere = findFileByName(ASSETS_DIR, original);
          if (anywhere) return anywhere;
        } catch {
          // ignore malformed metadata
        }
      } else if (entry.isDirectory() && !entry.name.startsWith(".")) {
        const found = walkAssetJson(full);
        if (found) return found;
      }
    }
    return null;
  }

  return walkAssetJson(ASSETS_DIR);
}

type RouteContext = { params: Promise<{ assetId: string; filename: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { assetId, filename } = await context.params;

  if (!assetId || !filename || filename.includes("..") || assetId.includes("..")) {
    return new Response("Bad request", { status: 400 });
  }

  const localPath = findLocalAsset(assetId, filename);
  if (localPath) {
    const buffer = fs.readFileSync(localPath);
    return new Response(buffer, {
      headers: {
        "Content-Type": contentTypeFor(filename),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  const remoteUrl = `${R2_CDN}/a/v1/${L5E_PROJECT_ID}/${assetId}/${encodeURIComponent(filename)}`;
  try {
    const remote = await fetch(remoteUrl);
    if (!remote.ok) {
      return new Response("Asset not found", { status: 404 });
    }

    const body = await remote.arrayBuffer();
    return new Response(body, {
      headers: {
        "Content-Type":
          remote.headers.get("content-type") ?? contentTypeFor(filename),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Asset unavailable", { status: 502 });
  }
}
