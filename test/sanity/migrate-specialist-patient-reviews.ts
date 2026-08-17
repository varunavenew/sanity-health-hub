/**
 * Migration: "Hva pasientene sier" / "What patients say" on specialist profiles.
 *
 * Schema targets:
 *   - googleReview            (author, rating, text, date)
 *   - specialist.patientReviews  → array of references to googleReview (max 6)
 *
 * What it does:
 *   1. Upserts every review from src/data/googleReviews.ts as a `googleReview`
 *      document with a deterministic _id (`googleReview.static-<id>`), so the
 *      script is fully idempotent and can be re-run safely.
 *      Relative Norwegian dates ("5 måneder siden") are converted to ISO dates.
 *   2. For every specialist in Sanity, picks up to 6 relevant reviews using the
 *      SAME logic the live site uses (src/components/specialist/SpecialistReviews.tsx):
 *        a) reviews whose text mentions the specialist's first or last name
 *        b) otherwise category-keyword matches (from categories[0] slug)
 *        c) padded with top general reviews so every profile has ≥ 3
 *      and writes them to `patientReviews` (Studio order preserved).
 *
 * Notes:
 *   - googleReview has no i18n fields in the schema (author/text/date are plain),
 *     so the review bodies are stored as authored (Norwegian). Nothing to
 *     duplicate per language — the heading around the section is what is
 *     localized on the page.
 *   - Existing `patientReviews` on a specialist are preserved unless FORCE=1.
 *
 * Usage:
 *   cd test
 *   SANITY_TOKEN=xxx npx tsx sanity/migrate-specialist-patient-reviews.ts --dry-run
 *   SANITY_TOKEN=xxx npx tsx sanity/migrate-specialist-patient-reviews.ts
 *   SANITY_TOKEN=xxx FORCE=1 npx tsx sanity/migrate-specialist-patient-reviews.ts
 */
import { sanityClient } from "./config";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const DRY_RUN = process.argv.includes("--dry-run");
const FORCE = process.env.FORCE === "1";
const MAX_REVIEWS = 6;
const MIN_REVIEWS = 3;

type StaticReview = {
  id: number;
  name: string;
  rating: number;
  text: string;
  date: string;
  source: string;
};

/* ── 1. Load reviews from the live static file ───────────────────────────── */

function loadStaticReviews(): StaticReview[] {
  const path = resolve(__dirname, "../../src/data/googleReviews.ts");
  const src = readFileSync(path, "utf8");
  const body = src.slice(src.indexOf("googleReviews: GoogleReview[] = ["));

  const out: StaticReview[] = [];
  const objRe = /\{\s*id:\s*(\d+),([\s\S]*?)\n  \}/g;
  let m: RegExpExecArray | null;
  while ((m = objRe.exec(body)) !== null) {
    const chunk = m[2];
    const get = (key: string) => {
      const r = chunk.match(new RegExp(`${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
      return r ? r[1].replace(/\\"/g, '"') : "";
    };
    const rating = Number((chunk.match(/rating:\s*([\d.]+)/) || [])[1] || 5);
    out.push({
      id: Number(m[1]),
      name: get("name"),
      rating,
      text: get("text"),
      date: get("date"),
      source: get("source") || "google",
    });
  }
  return out;
}

/* ── 2. Relative Norwegian date → ISO date ───────────────────────────────── */

function relativeNoToIso(input: string): string | undefined {
  if (!input) return undefined;
  const s = input.toLowerCase().trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  const m = s.match(/(\d+)?\s*(dag|uke|måned|maned|år|ar)/);
  if (!m) return undefined;
  const n = Number(m[1] || 1);
  const unit = m[2];
  const d = new Date();
  if (unit.startsWith("dag")) d.setDate(d.getDate() - n);
  else if (unit.startsWith("uke")) d.setDate(d.getDate() - n * 7);
  else if (unit.startsWith("m")) d.setMonth(d.getMonth() - n);
  else d.setFullYear(d.getFullYear() - n);
  return d.toISOString().slice(0, 10);
}

/* ── 3. Relevance logic — mirrors SpecialistReviews.tsx ──────────────────── */

const categoryKeywords: Record<string, string[]> = {
  gynekologi: ["gynekolog", "kvinne", "ultralyd"],
  fertilitet: ["fertil", "ivf", "egg", "befruktning", "embryo"],
  urologi: ["urolog", "prostata"],
  ortopedi: ["skulder", "kne", "hånd", "fot", "ortoped", "kirurg"],
  "robotassistert-kirurgi": ["robot", "prostata", "kirurg"],
  gastrokirurgi: ["kirurg", "mage", "galle", "brokk"],
  hudhelse: ["hud", "føflekk"],
};

function pickReviews(name: string, categorySlugs: string[], reviews: StaticReview[]) {
  const parts = name.trim().split(/\s+/);
  const first = (parts[0] || "").toLowerCase();
  const last = (parts[parts.length - 1] || "").toLowerCase();

  const nameMatched = reviews.filter(
    (r) =>
      (first.length > 2 && r.text.toLowerCase().includes(first)) ||
      (last.length > 2 && r.text.toLowerCase().includes(last))
  );
  if (nameMatched.length >= MIN_REVIEWS) {
    return { picked: nameMatched.slice(0, MAX_REVIEWS), source: "name" as const };
  }

  const keywords = categorySlugs.flatMap((c) => categoryKeywords[c] || []);
  const catMatched = reviews.filter((r) =>
    keywords.some((kw) => r.text.toLowerCase().includes(kw))
  );

  const combined = [...nameMatched];
  for (const r of catMatched) {
    if (combined.length >= MIN_REVIEWS) break;
    if (!combined.includes(r)) combined.push(r);
  }
  for (const r of reviews) {
    if (combined.length >= MIN_REVIEWS) break;
    if (!combined.includes(r)) combined.push(r);
  }
  return {
    picked: combined.slice(0, MAX_REVIEWS),
    source: nameMatched.length ? ("name+category" as const) : catMatched.length ? ("category" as const) : ("general" as const),
  };
}

/* ── 4. Run ──────────────────────────────────────────────────────────────── */

const reviewDocId = (id: number) => `googleReview.static-${id}`;

async function run() {
  const reviews = loadStaticReviews();
  console.log(`🔍 Parsed ${reviews.length} review(s) from src/data/googleReviews.ts${DRY_RUN ? " (DRY RUN)" : ""}`);
  if (reviews.length === 0) {
    console.error("❌ No reviews parsed — aborting.");
    process.exit(1);
  }

  // 4a. Upsert review documents
  let createdReviews = 0;
  for (const r of reviews) {
    const doc = {
      _id: reviewDocId(r.id),
      _type: "googleReview",
      author: r.name,
      rating: r.rating,
      text: r.text,
      ...(relativeNoToIso(r.date) ? { date: relativeNoToIso(r.date) } : {}),
    };
    if (!DRY_RUN) {
      if (FORCE) await sanityClient.createOrReplace(doc);
      else await sanityClient.createIfNotExists(doc);
    }
    createdReviews++;
  }
  console.log(`   ✓ Upserted ${createdReviews} googleReview document(s).`);

  // 4b. Attach to specialists
  const specialists: {
    _id: string;
    name: string;
    categorySlugs?: string[];
    patientReviews?: { _ref: string }[];
  }[] = await sanityClient.fetch(
    `*[_type == "specialist" && !(_id in path("drafts.**"))]{
      _id,
      name,
      "categorySlugs": categories[]->slug.current,
      patientReviews
    }`
  );
  console.log(`🔍 Found ${specialists.length} specialist(s).\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const s of specialists) {
    try {
      const existing = Array.isArray(s.patientReviews) ? s.patientReviews : [];
      if (existing.length > 0 && !FORCE) {
        console.log(`⏭  Skipped (already has ${existing.length} review(s)): ${s.name}`);
        skipped++;
        continue;
      }

      const cats = (s.categorySlugs || []).filter(Boolean).map((c) => String(c));
      const { picked, source } = pickReviews(s.name || "", cats, reviews);
      if (picked.length === 0) {
        console.log(`⏭  Skipped (no matches): ${s.name}`);
        skipped++;
        continue;
      }

      const refs = picked.map((r) => ({
        _type: "reference" as const,
        _ref: reviewDocId(r.id),
        _key: `rev-${r.id}`,
      }));

      if (!DRY_RUN) {
        await sanityClient.patch(s._id).set({ patientReviews: refs }).commit();
      }
      console.log(`✓ ${s.name} → ${refs.length} review(s) [${source}]`);
      updated++;
    } catch (err: any) {
      console.error(`✗ Failed: ${s.name} — ${err?.message || err}`);
      errors++;
    }
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`Review documents:  ${createdReviews}`);
  console.log(`Specialists set:   ${updated}`);
  console.log(`Skipped:           ${skipped}`);
  console.log(`Errors:            ${errors}`);
  if (DRY_RUN) console.log("\n(dry run — no changes committed)");
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
