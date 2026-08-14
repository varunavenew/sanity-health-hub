#!/usr/bin/env npx tsx
/**
 * Developer-only: set explicit `source` on every pricing price line.
 *
 * Evidence for Metodika origin (not name/slug guessing):
 * - line already stores apiActivityId > 0
 * - that id currently resolves in /api/booking/activity-groups
 *
 * Lines without a valid stored apiActivityId → source = "sanity"
 * (apiActivityId cleared).
 *
 *   cd test && npx tsx sanity/migrate-pricing-source-developer.ts
 */
import fs from "fs";
import path from "path";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

async function loadMetodikaIds(): Promise<Set<number>> {
  const base = process.env.BOOKING_API_BASE ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/booking/activity-groups?prices=api`);
  const json = (await res.json()) as {
    ok?: boolean;
    categories?: Array<{ services?: Array<{ apiActivityId?: number }> }>;
  };
  if (!json.ok || !json.categories) {
    throw new Error("Could not load Metodika activity-groups for ID confirmation.");
  }
  const ids = new Set<number>();
  for (const c of json.categories) {
    for (const s of c.services || []) {
      if (typeof s.apiActivityId === "number" && s.apiActivityId > 0) {
        ids.add(s.apiActivityId);
      }
    }
  }
  return ids;
}

async function main() {
  console.log({ PROJECT_ID, DATASET });
  if (DATASET !== "developer") {
    throw new Error("Refusing to migrate outside developer dataset.");
  }

  const metodikaIds = await loadMetodikaIds();
  console.log("Confirmed Metodika activity IDs:", metodikaIds.size);

  const page = await sanityClient.fetch(`*[_type=="pricingPage" && !(_id in path("drafts.**"))][0]{
    _id,
    priceCategories
  }`);
  if (!page?._id) throw new Error("pricingPage missing");

  let total = 0;
  let metodika = 0;
  let sanity = 0;
  let metodikaWithValidId = 0;
  let metodikaMissingId = 0;
  let sanityHadAccidentalId = 0;
  const rows: Array<Record<string, unknown>> = [];

  const priceCategories = (page.priceCategories || []).map((cat: any) => {
    const mapItems = (items: any[] | undefined) =>
      (items || []).map((item: any) => {
        total++;
        const id =
          typeof item.apiActivityId === "number" && item.apiActivityId > 0
            ? item.apiActivityId
            : null;
        const confirmedMetodika = id != null && metodikaIds.has(id);

        let source: "metodika" | "sanity";
        let nextId: number | undefined;

        if (confirmedMetodika) {
          source = "metodika";
          nextId = id!;
          metodika++;
          metodikaWithValidId++;
        } else {
          source = "sanity";
          nextId = undefined;
          sanity++;
          if (id != null) {
            // Stored id did not confirm against live Metodika — treat as Sanity-only
            // and clear the id (do not invent / keep unconfirmed IDs).
            sanityHadAccidentalId++;
            metodikaMissingId += 0;
          }
        }

        const nameNo =
          item.name?.find?.((x: any) => x.language === "no")?.value ??
          item.name?.[0]?.value ??
          "";

        rows.push({
          nameNo,
          previousApiActivityId: id,
          source,
          apiActivityId: nextId ?? null,
          confirmedInMetodikaApi: confirmedMetodika,
        });

        const next: Record<string, unknown> = {
          ...item,
          source,
        };
        if (nextId != null) {
          next.apiActivityId = nextId;
        } else {
          delete next.apiActivityId;
        }
        return next;
      });

    return {
      ...cat,
      subcategories: (cat.subcategories || []).map((sub: any) => ({
        ...sub,
        items: mapItems(sub.items),
      })),
      items: mapItems(cat.items),
    };
  });

  await sanityClient.patch(page._id).set({ priceCategories }).commit();
  try {
    await sanityClient.delete(`drafts.${page._id}`);
  } catch {
    /* none */
  }

  // Post-verify from CMS
  const verify = await sanityClient.fetch(`*[_id==$id][0]{
    "total": count(priceCategories[].subcategories[].items[]),
    "metodika": count(priceCategories[].subcategories[].items[source == "metodika"]),
    "sanity": count(priceCategories[].subcategories[].items[source == "sanity"]),
    "metodikaValidId": count(priceCategories[].subcategories[].items[source == "metodika" && defined(apiActivityId) && apiActivityId > 0]),
    "metodikaMissingId": count(priceCategories[].subcategories[].items[source == "metodika" && (!defined(apiActivityId) || !(apiActivityId > 0))]),
    "sanityWithId": count(priceCategories[].subcategories[].items[source == "sanity" && defined(apiActivityId) && apiActivityId > 0]),
    "invalidSource": count(priceCategories[].subcategories[].items[!(source in ["metodika", "sanity"])])
  }`, { id: page._id });

  const summary = {
    projectId: PROJECT_ID,
    dataset: DATASET,
    pricingPageId: page._id,
    migrationPass: {
      total,
      metodika,
      sanity,
      metodikaWithValidId,
      metodikaMissingId,
      sanityHadAccidentalIdCleared: sanityHadAccidentalId,
    },
    verify,
  };

  const out = path.join(process.cwd(), "..", "tmp", "pricing-source-migration-report.json");
  fs.writeFileSync(out, JSON.stringify({ summary, rows }, null, 2), "utf8");
  console.log(JSON.stringify(summary, null, 2));
  console.log("Wrote", out);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
