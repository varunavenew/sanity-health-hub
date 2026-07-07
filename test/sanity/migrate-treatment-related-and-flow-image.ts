#!/usr/bin/env npx tsx
/**
 * Migration: per-treatment `flowImage` (process section photo) and
 * `relatedSection` (Related services block with references).
 *
 * - `flowImage` is set to the shared "hvilerom-hero" clinic photo used by the
 *   frontend adapter (`treatmentToSubLayout.tsx` → `pickClinicImage`). The
 *   image is uploaded to Sanity once and reused across all treatments.
 * - `relatedSection` is built from `linkedServices` paths in
 *   src/data/treatmentContent.ts, resolved to true `treatment` references,
 *   plus a `seeAllHref/seeAllLabel` derived from the category.
 *
 * Only the two target fields are patched — nothing else is overwritten.
 * Idempotent: safe to re-run.
 *
 * Usage:
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-treatment-related-and-flow-image.ts
 */
import * as fs from "fs";
import * as path from "path";
import { sanityClient } from "./config";

const SOURCE = path.resolve(__dirname, "../../src/data/treatmentContent.ts");

// Shared clinic photo used by the frontend adapter for every treatment flow.
const FLOW_IMAGE_URL =
  "https://sanity-care-craft.lovable.app/__l5e/assets-v1/82f3d075-45d0-45d4-a306-9c16d3153472/hvilerom-hero.jpg";
const FLOW_IMAGE_FILENAME = "hvilerom-hero.jpg";
const FLOW_IMAGE_ALT_NO = "CMedical klinikk — hvilerom";
const FLOW_IMAGE_ALT_EN = "CMedical clinic — lounge";

const CATEGORY_LABEL_NO: Record<string, string> = {
  gynekologi: "Gynekologi",
  fertilitet: "Fertilitet",
  urologi: "Urologi",
  ortopedi: "Ortopedi",
  graviditet: "Graviditet",
  "flere-fagomrader": "Flere fagområder",
};

// ── slug helper (matches migrate-treatments.ts) ──────────────
function slugifyKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/æ/g, "ae").replace(/ø/g, "o").replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function readBalanced(src: string, start: number, open: string, close: string): { end: number; body: string } {
  let depth = 1;
  let i = start;
  let inStr: string | null = null;
  let escape = false;
  while (i < src.length) {
    const ch = src[i];
    if (inStr) {
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === inStr) inStr = null;
    } else {
      if (ch === '"' || ch === "'" || ch === "`") inStr = ch;
      else if (ch === open) depth++;
      else if (ch === close) {
        depth--;
        if (depth === 0) return { end: i, body: src.slice(start, i) };
      }
    }
    i++;
  }
  throw new Error("Unbalanced brackets");
}

interface Extracted {
  key: string; // "category/sub"
  linkedServices?: Array<{ label: string; description: string; path: string; image?: string }>;
}

function parseTreatmentContent(src: string): Extracted[] {
  const out: Extracted[] = [];
  const entryRe = /"([a-z0-9-]+\/[a-z0-9-]+)":\s*\{/g;
  let m: RegExpExecArray | null;
  while ((m = entryRe.exec(src)) !== null) {
    const key = m[1];
    const bodyStart = m.index + m[0].length;
    const { end: bodyEnd, body } = readBalanced(src, bodyStart, "{", "}");
    entryRe.lastIndex = bodyEnd + 1;

    const entry: Extracted = { key };
    const lsMatch = /linkedServices\s*:\s*\[/.exec(body);
    if (lsMatch) {
      const start = lsMatch.index + lsMatch[0].length;
      const { body: arrBody } = readBalanced(body, start, "[", "]");
      try {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        const arr = new Function(`return [${arrBody}]`)() as Extracted["linkedServices"];
        if (Array.isArray(arr) && arr.length) entry.linkedServices = arr;
      } catch (e) {
        console.warn(`   ⚠ ${key}: failed to parse linkedServices`, (e as Error).message);
      }
    }
    out.push(entry);
  }
  return out;
}

// ── i18n array shape helpers ─────────────────────────────────
function i18n(value: string, kind: "String" | "Text" = "String") {
  return [{ _key: "no", _type: `internationalizedArray${kind}Value`, value }];
}
function i18nNoEn(no: string, en: string, kind: "String" | "Text" = "String") {
  return [
    { _key: "no", _type: `internationalizedArray${kind}Value`, value: no },
    { _key: "en", _type: `internationalizedArray${kind}Value`, value: en },
  ];
}

// ── main ─────────────────────────────────────────────────────
async function run() {
  console.log("📖 Reading treatmentContent.ts …");
  const src = fs.readFileSync(SOURCE, "utf8");
  const entries = parseTreatmentContent(src);
  console.log(`   Parsed ${entries.length} entries.`);

  console.log("\n🏥 Fetching treatment slug → _id …");
  const treatments: Array<{ _id: string; slug?: string; categorySlug?: string; flowImage?: any }> =
    await sanityClient.fetch(
      `*[_type == "treatment" && !(_id in path("drafts.**"))]{
         _id,
         flowImage,
         "slug": coalesce(slug[language == "no"][0].value.current, slug.current),
         "categorySlug": coalesce(category->slug[language == "no"][0].value.current, category->slug.current)
       }`
    );
  const treatmentIdByKey = new Map<string, string>();
  const flowImageByKey = new Map<string, any>();
  for (const t of treatments) {
    if (t.categorySlug && t.slug) {
      treatmentIdByKey.set(`${t.categorySlug}/${t.slug}`, t._id);
      flowImageByKey.set(`${t.categorySlug}/${t.slug}`, t.flowImage);
    }
  }
  console.log(`   Loaded ${treatmentIdByKey.size} treatments.`);

  // ── Upload shared flow image once ───────────────────────────
  console.log(`\n🖼  Uploading shared flow image (${FLOW_IMAGE_FILENAME}) …`);
  const resp = await fetch(FLOW_IMAGE_URL);
  if (!resp.ok) throw new Error(`Failed to fetch flow image: ${resp.status}`);
  const buf = Buffer.from(await resp.arrayBuffer());
  const uploaded = await sanityClient.assets.upload("image", buf, {
    filename: FLOW_IMAGE_FILENAME,
    contentType: "image/jpeg",
  });
  const flowImageAssetId = uploaded._id;
  console.log(`   ✓ Asset uploaded: ${flowImageAssetId}`);

  let patched = 0;
  const missing: string[] = [];
  const unresolvedLinks: Array<{ treatment: string; path: string }> = [];

  for (const e of entries) {
    let treatmentId = treatmentIdByKey.get(e.key);
    if (!treatmentId) {
      const fallback = `treatment-${slugifyKey(e.key)}`;
      if (treatments.find((t) => t._id === fallback)) treatmentId = fallback;
    }
    if (!treatmentId) {
      missing.push(e.key);
      continue;
    }

    const patch: Record<string, any> = {};

    // flowImage — only set if missing (don't overwrite editor uploads)
    if (!flowImageByKey.get(e.key)) {
      patch.flowImage = {
        _type: "image",
        asset: { _type: "reference", _ref: flowImageAssetId },
      };
      patch.flowImageAlt = i18nNoEn(FLOW_IMAGE_ALT_NO, FLOW_IMAGE_ALT_EN);
    }

    // relatedSection — from linkedServices, resolved to references
    if (e.linkedServices?.length) {
      const [categorySlug] = e.key.split("/");
      const items = e.linkedServices
        .map((ls, idx) => {
          // Path shape: /behandlinger/<cat>/<sub> or /<cat>/<sub>
          const m = ls.path.match(/\/([^/?#]+)\/([^/?#]+)\/?$/);
          if (!m) return null;
          const key = `${m[1]}/${m[2]}`;
          let id = treatmentIdByKey.get(key);
          if (!id) {
            const fallback = `treatment-${slugifyKey(key)}`;
            if (treatments.find((t) => t._id === fallback)) id = fallback;
          }
          if (!id) {
            unresolvedLinks.push({ treatment: e.key, path: ls.path });
            return null;
          }
          return { _type: "reference" as const, _ref: id, _key: `rel-${idx}-${id.slice(-6)}` };
        })
        .filter((x): x is { _type: "reference"; _ref: string; _key: string } => !!x);

      if (items.length) {
        const catLabel = CATEGORY_LABEL_NO[categorySlug] ?? categorySlug;
        patch.relatedSection = {
          _type: "object",
          eyebrow: i18nNoEn("Relatert", "Related"),
          title: i18nNoEn("Relaterte tjenester", "Related services"),
          seeAllHref: `/behandlinger/${categorySlug}`,
          seeAllLabel: i18nNoEn(
            `Se alle ${catLabel.toLowerCase()}-tjenester`,
            `See all ${catLabel.toLowerCase()} services`
          ),
          items,
        };
      }
    }

    if (Object.keys(patch).length === 0) continue;

    await sanityClient.patch(treatmentId).set(patch).commit();
    const parts = [
      patch.flowImage ? "flowImage" : null,
      patch.relatedSection ? `relatedSection(${patch.relatedSection.items.length})` : null,
    ].filter(Boolean).join(" + ");
    console.log(`   ✓ ${e.key} → ${parts}`);
    patched++;
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`✅ Patched: ${patched} treatments`);
  if (missing.length) {
    console.log(`⚠  Treatment doc not found (${missing.length}):`);
    missing.forEach((k) => console.log(`     - ${k}`));
  }
  if (unresolvedLinks.length) {
    console.log(`⚠  Unresolved linkedService paths (${unresolvedLinks.length}):`);
    unresolvedLinks.forEach((u) => console.log(`     - ${u.path} in ${u.treatment}`));
  }
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
