#!/usr/bin/env npx tsx
/**
 * Developer-only:
 * 1) Delete stale category drafts (Studio form cache / non-unique key ghosts)
 * 2) Strip `/behandlinger` prefix from all landingPage href strings
 * 3) Rebuild segment tagLinks with globally unique keys + unset legacy tags
 *
 *   cd test && npx tsx sanity/fix-category-urls-and-keys-developer.ts
 */
import { randomUUID } from "crypto";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const IDS = [
  "category-fertilitet",
  "category-gynekologi",
  "category-urologi",
  "category-ortopedi",
  "category-graviditet",
  "category-flere-fagomrader",
] as const;

function stripBehandlinger(value: string): string {
  return value
    .replace(/(^|\/)behandlinger\//g, "$1")
    .replace(/\/{2,}/g, "/")
    .replace(/^\/(?=\?)/, ""); // keep query-only paths as /? or ?
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function rewriteValue(value: unknown, path: string[] = []): unknown {
  if (typeof value === "string") {
    const leaf = path[path.length - 1] || "";
    const looksLikeHref =
      leaf === "href" ||
      leaf === "ctaHref" ||
      leaf === "footerLinkHref" ||
      leaf.toLowerCase().includes("href") ||
      leaf.toLowerCase().includes("path") ||
      value.includes("/behandlinger/");
    if (looksLikeHref && value.includes("behandlinger")) {
      return stripBehandlinger(value);
    }
    return value;
  }

  if (Array.isArray(value)) {
    const parent = path[path.length - 1] || "";
    return value.map((item, index) => {
      if (!isPlainObject(item)) return rewriteValue(item, [...path, String(index)]);

      const next: Record<string, unknown> = { ...item };

      // Fresh unique keys for segment cards + keyword links (Studio array identity)
      if (parent === "segments" || parent === "tagLinks") {
        next._key = randomUUID().replace(/-/g, "").slice(0, 16);
      }

      // Drop legacy tags that used a broken schema shape
      if (parent === "segments") {
        delete next.tags;
      }

      for (const [k, v] of Object.entries(next)) {
        if (k === "_key" || k === "_type" || k === "_ref") continue;
        next[k] = rewriteValue(v, [...path, k]);
      }
      return next;
    });
  }

  if (isPlainObject(value)) {
    const next: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      next[k] = rewriteValue(v, [...path, k]);
    }
    return next;
  }

  return value;
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  // 1) Remove drafts so Studio reloads published (fixes stale form with bad keys)
  for (const id of IDS) {
    const draftId = `drafts.${id}`;
    try {
      await sanityClient.delete(draftId);
      console.log(`✓ deleted ${draftId}`);
    } catch {
      console.log(`· no draft ${draftId}`);
    }
  }

  // 2) Rewrite published docs
  for (const id of IDS) {
    const doc = await sanityClient.getDocument(id);
    if (!doc) throw new Error(`Missing ${id}`);

    const landingPage = rewriteValue((doc as { landingPage?: unknown }).landingPage, [
      "landingPage",
    ]);

    await sanityClient
      .patch(id)
      .set({ landingPage })
      .commit({ autoGenerateArrayKeys: false });

    const check = await sanityClient.fetch(
      `*[_id==$id][0]{
        "segN": count(landingPage.segmentsSection.segments),
        "tagSample": landingPage.segmentsSection.segments[0].tagLinks[0..2]{
          _key, href, "label": label[language=="no"][0].value
        },
        "segHrefs": landingPage.segmentsSection.segments[].href,
        "symptomHrefs": landingPage.symptomsSection.items[0..2].href,
        "serviceHrefs": landingPage.servicesSection.groups[0].items[0..2].href
      }`,
      { id },
    );
    console.log(`✓ ${id}`, JSON.stringify(check));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
