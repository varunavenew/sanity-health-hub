#!/usr/bin/env npx tsx
/**
 * Developer-only: restore Metodika identities lost during reference sync,
 * and re-append CMS Metodika lines that the reference scrape omitted.
 *
 *   cd test && npx tsx sanity/restore-pricing-metodika-parity-developer.ts
 */
import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

type I18nVal = {
  _type?: string;
  _key?: string;
  language?: string;
  value?: string;
};

function key() {
  return randomBytes(6).toString("hex");
}

function pick(arr: I18nVal[] | undefined, lang: string): string {
  if (!Array.isArray(arr)) return "";
  const hit = arr.find((x) => x.language === lang || x._key === lang);
  return String(hit?.value ?? "").trim();
}

function i18nStr(no: string, en: string): I18nVal[] {
  return [
    {
      _type: "internationalizedArrayStringValue",
      _key: "no",
      language: "no",
      value: no,
    },
    {
      _type: "internationalizedArrayStringValue",
      _key: "en",
      language: "en",
      value: en,
    },
  ];
}

function setItemSource(
  item: any,
  source: "metodika" | "sanity",
  apiActivityId?: number,
) {
  item.source = source;
  if (source === "metodika" && apiActivityId != null) {
    item.apiActivityId = apiActivityId;
  } else {
    delete item.apiActivityId;
  }
}

async function main() {
  console.log({ PROJECT_ID, DATASET });
  if (PROJECT_ID !== "9jhqpk3a" || DATASET !== "developer") {
    throw new Error("Refusing restore outside developer/9jhqpk3a");
  }

  const backup = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "..",
        "tmp",
        "pricingPage-backup-2026-08-11T12-29-48-395Z.json",
      ),
      "utf8",
    ),
  );

  const page = await sanityClient.fetch<any>(
    `*[_type=="pricingPage" && !(_id in path("drafts.**"))][0]`,
  );
  if (!page?._id) throw new Error("No pricingPage");

  const cats = page.priceCategories || [];

  // ── Endokrinologi: reattach id 111 ───────────────────────────────────────
  const endo = cats.find((c: any) => pick(c.categoryName, "no") === "Endokrinologi");
  if (endo) {
    for (const sub of endo.subcategories || []) {
      for (const item of sub.items || []) {
        const name = pick(item.name, "no");
        if (/endokrinolog.*konsultasjon/i.test(name) && !/oppfølging/i.test(name)) {
          setItemSource(item, "metodika", 111);
        }
      }
    }
  }

  // ── Psykologi: map durations → backup Metodika IDs ───────────────────────
  const psyk = cats.find((c: any) => pick(c.categoryName, "no") === "Psykologi");
  if (psyk) {
    const map: Array<{ test: (n: string) => boolean; id: number }> = [
      { test: (n) => /^psykolog 50 min$/i.test(n), id: 70 },
      { test: (n) => /psykolog 50 min,\s*digitaltime/i.test(n), id: 88 },
      { test: (n) => /^psykolog 80 min$/i.test(n), id: 82 },
      { test: (n) => /psykolog 80 min,\s*digitaltime/i.test(n), id: 89 },
      { test: (n) => /partime 50/i.test(n), id: 100 },
      { test: (n) => /partime 80/i.test(n), id: 101 },
    ];
    for (const sub of psyk.subcategories || []) {
      for (const item of sub.items || []) {
        const name = pick(item.name, "no");
        const hit = map.find((m) => m.test(name));
        if (hit) setItemSource(item, "metodika", hit.id);
      }
    }
  }

  // ── Urologi: restore Metodika consultations omitted by reference scrape ─
  const uro = cats.find((c: any) => pick(c.categoryName, "no") === "Urologi");
  const backupUro = (backup.priceCategories || []).find(
    (c: any) => pick(c.categoryName, "no") === "Urologi",
  );
  if (uro && backupUro) {
    const sub =
      (uro.subcategories || []).find(
        (s: any) => pick(s.label, "no") === "Konsultasjoner",
      ) || uro.subcategories?.[0];
    if (sub) {
      const existingNames = new Set(
        (sub.items || []).map((i: any) => pick(i.name, "no").toLowerCase()),
      );
      const backupSub = (backupUro.subcategories || []).find(
        (s: any) => pick(s.label, "no") === "Konsultasjoner",
      );
      for (const item of backupSub?.items || []) {
        if (item.source !== "metodika") continue;
        const name = pick(item.name, "no");
        // Skip generic Konsultasjon — already represented as 30 min
        if (/^konsultasjon$/i.test(name) || /utter/i.test(name)) continue;
        if (existingNames.has(name.toLowerCase())) continue;
        sub.items = [
          ...(sub.items || []),
          {
            _type: "object",
            _key: key(),
            name: item.name,
            price: item.price,
            priceLabel: item.priceLabel,
            note: item.note,
            source: "metodika",
            apiActivityId: item.apiActivityId,
          },
        ];
        existingNames.add(name.toLowerCase());
      }
    }
  }

  await sanityClient.patch(page._id).set({ priceCategories: cats }).commit();

  // Recount
  let metodika = 0;
  let sanityOnly = 0;
  let total = 0;
  for (const cat of cats) {
    for (const sub of cat.subcategories || []) {
      for (const item of sub.items || []) {
        total++;
        if (item.source === "metodika") metodika++;
        else sanityOnly++;
      }
    }
  }
  console.log({ total, metodika, sanityOnly });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
