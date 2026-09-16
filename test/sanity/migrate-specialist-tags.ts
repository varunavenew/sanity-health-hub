/**
 * Migrate specialist expertise labels → reusable `specialistTag` documents.
 *
 * Before: specialist.specialties = [{ _type: "specialtyItem", label: i18n }]
 * After:  specialist.specialties = [{ _type: "reference", _ref: "specialistTag.<slug>" }]
 *
 * What it does
 *   1. Reads all specialists (published + drafts) and collects inline labels (NO/EN).
 *   2. Deduplicates by normalized NO label → one shared tag per unique label.
 *   3. Creates a `specialistTag` document per unique label (deterministic _id).
 *   4. Auto-links each tag to a matching treatment / treatmentCategory page
 *      (exact normalized NO title match only).
 *   5. Rewrites specialties as references, keeping order, keeping existing refs.
 *
 * Schema-defensive: the live `specialistTag` schema is not in this repo, so the
 * script probes an existing tag document to learn its field names (title / slug /
 * link) and mirrors that shape. Falls back to title + slug + linkPath. Override
 * with TITLE_FIELD / SLUG_FIELD / LINK_FIELD env vars.
 *
 * Idempotent: re-running reuses existing tags and skips already-converted rows.
 *
 * Usage:
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-specialist-tags.ts --dry-run
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-specialist-tags.ts
 *   cd test && SANITY_TOKEN=<token> SANITY_DATASET=production npx tsx sanity/migrate-specialist-tags.ts
 */
import { sanityClient } from "./config";

const DRY = process.argv.includes("--dry-run");

/* ── i18n helpers (internationalizedArray v5) ─────────────────────────── */
type I18nRow = { _key: string; _type?: string; value?: string; language?: string };

const i18nString = (no: string, en: string): I18nRow[] => {
  const rows: I18nRow[] = [
    { _key: "no", _type: "internationalizedArrayStringValue", value: no },
  ];
  if (en) rows.push({ _key: "en", _type: "internationalizedArrayStringValue", value: en });
  return rows;
};

const pick = (value: unknown, lang: string): string => {
  if (typeof value === "string") return lang === "no" ? value : "";
  if (!Array.isArray(value)) return "";
  const row = value.find((r: any) => (r?.language || r?._key) === lang);
  return (row?.value ?? "").toString().trim();
};

/* ── normalization ────────────────────────────────────────────────────── */
const normalize = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "oe")
    .replace(/å/g, "aa")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const tagId = (noLabel: string) => `specialistTag.${slugify(noLabel)}`;

/* ── types ────────────────────────────────────────────────────────────── */
interface SpecialtyRow {
  _key?: string;
  _type?: string;
  _ref?: string;
  label?: unknown;
}

interface SpecialistDoc {
  _id: string;
  name?: string;
  specialties?: SpecialtyRow[];
}

interface PageDoc {
  _id: string;
  _type: string;
  title?: unknown;
  slug?: unknown;
  categorySlug?: unknown;
}

const slugValue = (slug: unknown): string => {
  if (!slug) return "";
  if (typeof slug === "string") return slug;
  const s = slug as any;
  if (typeof s.current === "string") return s.current;
  // i18n slug object: { no: {current}, en: {current} } or array
  if (s.no?.current) return s.no.current;
  if (Array.isArray(s)) {
    const row = s.find((r: any) => (r?.language || r?._key) === "no");
    if (row?.value?.current) return row.value.current;
    if (typeof row?.value === "string") return row.value;
  }
  return "";
};

async function run() {
  console.log(`🏷  Specialist tag migration${DRY ? " (DRY RUN)" : ""}`);

  /* ── 1. Probe the specialistTag shape ──────────────────────────────── */
  const sampleTag: Record<string, any> | null = await sanityClient.fetch(
    `*[_type == "specialistTag"][0]`
  );

  const has = (f: string) => !!sampleTag && Object.prototype.hasOwnProperty.call(sampleTag, f);

  const TITLE_FIELD =
    process.env.TITLE_FIELD ||
    ["title", "label", "name"].find(has) ||
    "title";
  const SLUG_FIELD = process.env.SLUG_FIELD || ["slug"].find(has) || "slug";
  const LINK_FIELD =
    process.env.LINK_FIELD ||
    ["linkPath", "link", "path", "url", "href"].find(has) ||
    (sampleTag ? "" : "linkPath");

  const titleIsI18n = sampleTag ? Array.isArray(sampleTag[TITLE_FIELD]) : true;
  const linkIsReference =
    !!LINK_FIELD &&
    !!sampleTag &&
    !!sampleTag[LINK_FIELD] &&
    typeof sampleTag[LINK_FIELD] === "object" &&
    !!(sampleTag[LINK_FIELD] as any)._ref;

  console.log(
    `   Tag shape: title="${TITLE_FIELD}" (${titleIsI18n ? "i18n" : "string"}), slug="${SLUG_FIELD}", link=${
      LINK_FIELD ? `"${LINK_FIELD}" (${linkIsReference ? "reference" : "path string"})` : "(none – links skipped)"
    }${sampleTag ? "" : " [no existing tag found, using defaults]"}`
  );

  /* ── 2. Load specialists ───────────────────────────────────────────── */
  const specialists: SpecialistDoc[] = await sanityClient.fetch(
    `*[_type == "specialist"]{ _id, name, specialties }`
  );
  console.log(`   Loaded ${specialists.length} specialist document(s) (incl. drafts).`);

  /* ── 3. Collect unique labels ──────────────────────────────────────── */
  const labels = new Map<string, { no: string; en: string; count: number }>();

  for (const s of specialists) {
    for (const row of s.specialties || []) {
      if (!row || row._type === "reference" || row._ref) continue;
      const no = pick(row.label, "no") || pick(row.label, "en");
      if (!no) continue;
      const en = pick(row.label, "en");
      const key = normalize(no);
      if (!key) continue;
      const existing = labels.get(key);
      if (existing) {
        existing.count++;
        if (!existing.en && en) existing.en = en;
      } else {
        labels.set(key, { no, en, count: 1 });
      }
    }
  }

  console.log(`   Found ${labels.size} unique legacy label(s).`);
  if (labels.size === 0) {
    console.log("✅ Nothing to migrate — all specialties are already references.");
    return;
  }

  /* ── 4. Build link lookup from treatments + categories ─────────────── */
  const pages: PageDoc[] = await sanityClient.fetch(
    `*[_type in ["treatment", "treatmentCategory"]]{
      _id, _type, title, slug,
      "categorySlug": category->slug
    }`
  );

  const pageByTitle = new Map<string, PageDoc>();
  for (const p of pages) {
    const t = pick(p.title, "no") || (typeof p.title === "string" ? p.title : "");
    const key = normalize(t);
    if (!key) continue;
    // Categories win over treatments when both match the same label.
    if (!pageByTitle.has(key) || p._type === "treatmentCategory") pageByTitle.set(key, p);
  }
  console.log(`   Indexed ${pageByTitle.size} treatment/category page title(s) for auto-linking.`);

  const pathFor = (p: PageDoc): string => {
    const slug = slugValue(p.slug);
    if (!slug) return "";
    if (p._type === "treatmentCategory") return `/behandlinger/${slug}`;
    const cat = slugValue(p.categorySlug);
    return cat ? `/behandlinger/${cat}/${slug}` : "";
  };

  /* ── 5. Load existing tags (avoid duplicates) ──────────────────────── */
  const existingTags: { _id: string; title?: unknown; slug?: unknown }[] =
    await sanityClient.fetch(
      `*[_type == "specialistTag"]{ _id, "title": ${TITLE_FIELD}, "slug": ${SLUG_FIELD} }`
    );
  const existingByKey = new Map<string, string>();
  for (const t of existingTags) {
    const label = pick(t.title, "no") || (typeof t.title === "string" ? t.title : "");
    const key = normalize(label) || normalize(slugValue(t.slug).replace(/-/g, " "));
    if (key) existingByKey.set(key, t._id.replace(/^drafts\./, ""));
  }
  console.log(`   ${existingTags.length} existing tag document(s).`);

  /* ── 6. Create tags ────────────────────────────────────────────────── */
  const idByKey = new Map<string, string>();
  let created = 0;
  let reused = 0;
  let linked = 0;
  const unlinked: string[] = [];

  for (const [key, { no, en, count }] of labels) {
    const reusedId = existingByKey.get(key);
    const _id = reusedId || tagId(no);
    idByKey.set(key, _id);

    if (reusedId) {
      reused++;
      continue;
    }

    const doc: Record<string, any> = {
      _id,
      _type: "specialistTag",
      [TITLE_FIELD]: titleIsI18n ? i18nString(no, en) : no,
      [SLUG_FIELD]: { _type: "slug", current: slugify(no) },
    };

    const match = pageByTitle.get(key);
    if (LINK_FIELD && match) {
      if (linkIsReference) {
        doc[LINK_FIELD] = { _type: "reference", _ref: match._id.replace(/^drafts\./, "") };
        linked++;
      } else {
        const path = pathFor(match);
        if (path) {
          doc[LINK_FIELD] = path;
          linked++;
        } else {
          unlinked.push(no);
        }
      }
    } else {
      unlinked.push(no);
    }

    if (DRY) {
      console.log(
        `   + tag "${no}"${en ? ` / "${en}"` : ""} (${count} usage${count === 1 ? "" : "s"})` +
          (doc[LINK_FIELD] ? ` → ${JSON.stringify(doc[LINK_FIELD])}` : " → no link")
      );
    } else {
      await sanityClient.createIfNotExists(doc as any);
      console.log(`   ✓ tag "${no}" (${_id})`);
    }
    created++;
  }

  /* ── 7. Rewrite specialist.specialties ─────────────────────────────── */
  let updated = 0;
  let skipped = 0;

  for (const s of specialists) {
    const rows = s.specialties || [];
    if (rows.length === 0) continue;
    const hasLegacy = rows.some((r) => r && r._type !== "reference" && !r._ref);
    if (!hasLegacy) {
      skipped++;
      continue;
    }

    const seen = new Set<string>();
    const next = rows
      .map((row, idx) => {
        if (!row) return null;
        if (row._type === "reference" || row._ref) {
          const ref = row._ref!;
          if (seen.has(ref)) return null;
          seen.add(ref);
          return { ...row, _key: row._key || `tag-${idx}-${ref.slice(-6)}` };
        }
        const no = pick(row.label, "no") || pick(row.label, "en");
        const key = normalize(no);
        const id = key ? idByKey.get(key) : undefined;
        if (!id) return null;
        if (seen.has(id)) return null;
        seen.add(id);
        return { _type: "reference" as const, _ref: id, _key: `tag-${idx}-${slugify(no).slice(0, 12)}` };
      })
      .filter(Boolean);

    if (next.length === 0) {
      console.log(`   ⚠ ${s.name || s._id}: no resolvable tags — left unchanged`);
      continue;
    }

    if (DRY) {
      console.log(`   ~ ${s.name || s._id}: ${rows.length} row(s) → ${next.length} reference(s)`);
    } else {
      await sanityClient.patch(s._id).set({ specialties: next }).commit();
      console.log(`   ✓ ${s.name || s._id} → ${next.length} reference(s)`);
    }
    updated++;
  }

  /* ── 8. Summary ────────────────────────────────────────────────────── */
  console.log("\n──────────────────────────────────────────");
  console.log(`Tags created:            ${created}`);
  console.log(`Tags reused:             ${reused}`);
  console.log(`Tags auto-linked:        ${linked}`);
  console.log(`Specialists updated:     ${updated}`);
  console.log(`Specialists skipped:     ${skipped} (already references)`);
  if (unlinked.length) {
    console.log(`\nTags without a link (${unlinked.length}) — add manually in Studio:`);
    unlinked.forEach((l) => console.log(`   - ${l}`));
  }
  if (DRY) console.log("\nDry run — nothing was written.");
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
