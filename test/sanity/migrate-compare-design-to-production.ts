/**
 * Field-scoped Compare Design → production migration (SAFE REVISION).
 *
 * Policies:
 * - Pricing skipped
 * - FAQ cleared only for approved no-FAQ category/treatment pages; graviditet FAQ kept
 * - Shared insurance: only internalName + title (not partners / unrelated fields)
 * - Shared CTAs: only approved differing fields
 * - Articles: never overwrite EN with Norwegian; keep production slug + publishedAt;
 *   category/body/image only when reference parity confirms developer content
 *
 * Usage (from test/):
 *   # dry-run (default)
 *   cross-env ALLOW_PRODUCTION_MIGRATION=true SANITY_DATASET_FORCE=production npx tsx sanity/migrate-compare-design-to-production.ts
 *
 *   # apply ONLY after explicit authorization
 *   cross-env ALLOW_PRODUCTION_MIGRATION=true APPLY=true SANITY_DATASET_FORCE=production npx tsx sanity/migrate-compare-design-to-production.ts
 */
import fs from "fs";
import path from "path";
import {createClient, type SanityClient} from "@sanity/client";
import {config as loadEnv} from "dotenv";
import {requireSanityProjectId} from "./dataset-env";
import {
  REFERENCE_FEATURED_SLUGS,
  REFERENCE_LISTING_SLUGS,
} from "./reference-listing-slugs";

loadEnv({path: path.join(process.cwd(), ".env.local")});
loadEnv({path: path.join(process.cwd(), "..", ".env.local")});

const PROJECT_ID = requireSanityProjectId();
const TOKEN = process.env.SANITY_TOKEN?.trim();
const ALLOW =
  process.env.ALLOW_PRODUCTION_MIGRATION === "true" ||
  process.env.ALLOW_PRODUCTION_MIGRATION === "1";
const APPLY = process.env.APPLY === "true" || process.env.APPLY === "1";

if (!TOKEN) {
  console.error("Missing SANITY_TOKEN");
  process.exit(1);
}
if (PROJECT_ID !== "9jhqpk3a") {
  throw new Error(`Unexpected project id: ${PROJECT_ID}`);
}
if (!ALLOW) {
  throw new Error("Refusing. Set ALLOW_PRODUCTION_MIGRATION=true");
}

type Decision = "PATCH" | "SKIP" | "CREATE";

type ArticleFieldPlan = {
  id: string;
  slug: string;
  action: "CREATE" | "PATCH" | "SKIP";
  fields: Record<
    "titleNo" | "titleEn" | "excerptNo" | "excerptEn" | "category" | "publishedAt" | "slug" | "body" | "primaryImage",
    Decision
  >;
  reasons: string[];
  setPayload?: Record<string, unknown>;
};

const FAQ_CLEAR_CATEGORIES = [
  "category-fertilitet",
  "category-gynekologi",
  "category-urologi",
  "category-ortopedi",
  "category-flere-fagomrader",
] as const;

const FAQ_CLEAR_TREATMENTS = [
  "treatment-fertilitet-infertilitet",
  "treatment-fertilitet-assistert-befruktning",
  "treatment-fertilitet-donorbehandling",
  "treatment-fertilitet-eggfrys",
  "treatment-fertilitet-hysteroskopi",
  "treatment-fertilitet-saedanalyse",
] as const;

const SHARED_INSURANCE_ID =
  "migrated-insurance-collection.treatment.9eb09505654235fa";
const SHARED_CTA = {
  ortopedi: "migrated-cta-collection.da5deb1ad7a338f5",
  graviditet: "migrated-cta-collection.3d18bc512a8b365f",
  flere: "migrated-cta-collection.33ea61bd3190c308",
} as const;

function clientFor(dataset: "developer" | "production"): SanityClient {
  return createClient({
    projectId: PROJECT_ID,
    dataset,
    apiVersion: "2024-01-01",
    token: TOKEN,
    useCdn: false,
  });
}

function loadParity(): Map<
  string,
  {refCategory: string; ok: boolean; titleOk: boolean; catOk: boolean}
> {
  const file = path.resolve(
    process.cwd(),
    "sanity",
    "data",
    "article-parity-compare.json",
  );
  const alt = path.resolve(
    process.cwd(),
    "..",
    "test",
    "sanity",
    "data",
    "article-parity-compare.json",
  );
  const p = fs.existsSync(file) ? file : alt;
  const json = JSON.parse(fs.readFileSync(p, "utf8"));
  const map = new Map<
    string,
    {refCategory: string; ok: boolean; titleOk: boolean; catOk: boolean}
  >();
  for (const row of json.report || []) {
    map.set(row.slug, {
      refCategory: row.refCategory,
      ok: Boolean(row.ok),
      titleOk: Boolean(row.titleOk),
      catOk: Boolean(row.catOk),
    });
  }
  return map;
}

function i18nGet(arr: unknown, lang: string): string {
  if (!Array.isArray(arr)) return typeof arr === "string" ? arr : "";
  const hit = arr.find((x: any) => x?.language === lang || x?._key === lang) as
    | {value?: string}
    | undefined;
  return typeof hit?.value === "string" ? hit.value : "";
}

function setI18nLang(arr: unknown, lang: string, value: unknown): any[] {
  const list = Array.isArray(arr) ? [...arr] : [];
  const idx = list.findIndex((x: any) => x?.language === lang || x?._key === lang);
  const entry = {
    _type:
      lang && typeof value === "string"
        ? "internationalizedArrayStringValue"
        : (list[0] as any)?._type || "internationalizedArrayStringValue",
    _key: lang,
    language: lang,
    value,
  };
  // Preserve existing _type when present
  if (idx >= 0) {
    entry._type = (list[idx] as any)._type || entry._type;
    list[idx] = {...(list[idx] as object), ...entry, value};
  } else {
    list.push(entry);
  }
  return list;
}

function portablePlain(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((b: any) =>
      (b?.children || []).map((c: any) => c?.text || "").join(""),
    )
    .join("\n")
    .trim();
}

function i18nBodyPlain(body: unknown, lang: string): string {
  if (!Array.isArray(body)) return "";
  const hit = body.find((x: any) => x?.language === lang || x?._key === lang);
  return portablePlain(hit?.value);
}

/** Reject EN values that are empty, equal to NO, or contain Norwegian letters. */
function isUsableEnglish(text: string | null | undefined, noText?: string | null): boolean {
  const t = (text || "").trim();
  if (!t) return false;
  if (noText && t === noText.trim()) return false;
  if (/[æøåÆØÅ]/.test(t)) return false;
  return true;
}

function collectAssetIds(value: unknown, out: Set<string>) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const item of value) collectAssetIds(item, out);
    return;
  }
  const obj = value as Record<string, unknown>;
  if (typeof obj._ref === "string" && (obj._ref.startsWith("image-") || obj._ref.startsWith("file-"))) {
    out.add(obj._ref);
  }
  if (obj.asset && typeof obj.asset === "object") {
    const ref = (obj.asset as any)._ref;
    if (typeof ref === "string") out.add(ref);
  }
  for (const v of Object.values(obj)) collectAssetIds(v, out);
}

function remapAssets(value: unknown, map: Map<string, string>): unknown {
  if (!value || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map((v) => remapAssets(v, map));
  const obj = value as Record<string, unknown>;
  const next: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === "_ref" && typeof v === "string" && map.has(v)) {
      next[k] = map.get(v);
    } else {
      next[k] = remapAssets(v, map);
    }
  }
  return next;
}

function stripSystem(doc: Record<string, unknown>) {
  const {_createdAt, _updatedAt, _rev, ...rest} = doc;
  return rest;
}

function stableEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

async function ensureAssetsCopied(
  developer: SanityClient,
  production: SanityClient,
  assetIds: string[],
  apply: boolean,
) {
  const map = new Map<string, string>();
  const uploaded: string[] = [];
  const skipped: string[] = [];
  const unused: string[] = [];
  if (!assetIds.length) return {uploaded, skipped, unused, map};

  const existing = await production.fetch<{_id: string}[]>(`*[_id in $ids]{_id}`, {
    ids: assetIds,
  });
  const existingSet = new Set(existing.map((d) => d._id));

  for (const id of assetIds) {
    if (existingSet.has(id)) {
      map.set(id, id);
      skipped.push(id);
      continue;
    }
    const meta = await developer.fetch<any>(
      `*[_id==$id][0]{_id,_type,originalFilename,mimeType,url,extension}`,
      {id},
    );
    if (!meta?.url) {
      unused.push(`${id} (missing url)`);
      continue;
    }
    if (!apply) {
      uploaded.push(`${id} (planned)`);
      map.set(id, id);
      continue;
    }
    const res = await fetch(meta.url);
    if (!res.ok) throw new Error(`Asset download failed ${id}: ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const filename =
      meta.originalFilename ||
      `${id}.${meta.extension || (meta._type === "sanity.fileAsset" ? "bin" : "jpg")}`;
    const created = await production.assets.upload(
      meta._type === "sanity.fileAsset" ? "file" : "image",
      buf,
      {filename, contentType: meta.mimeType || undefined},
    );
    map.set(id, created._id);
    uploaded.push(`${id} -> ${created._id}`);
  }
  return {uploaded, skipped, unused, map};
}

function mergeI18nStringField(
  devArr: unknown,
  prodArr: unknown,
  opts: {patchNo: boolean; patchEn: boolean},
): unknown {
  let out = Array.isArray(prodArr) ? [...prodArr] : Array.isArray(devArr) ? [...devArr] : [];
  if (opts.patchNo) {
    const no = i18nGet(devArr, "no");
    if (no) out = setI18nLang(out, "no", no);
  }
  if (opts.patchEn) {
    const en = i18nGet(devArr, "en");
    if (en) out = setI18nLang(out, "en", en);
  }
  return out;
}

function mergeI18nBody(devBody: unknown, prodBody: unknown): unknown {
  const devList = Array.isArray(devBody) ? devBody : [];
  const prodList = Array.isArray(prodBody) ? prodBody : [];
  const devNo = devList.find((x: any) => x?.language === "no" || x?._key === "no");
  const prodEn = prodList.find((x: any) => x?.language === "en" || x?._key === "en");
  const devEn = devList.find((x: any) => x?.language === "en" || x?._key === "en");
  const out: any[] = [];
  if (devNo) out.push(devNo);
  else {
    const prodNo = prodList.find((x: any) => x?.language === "no" || x?._key === "no");
    if (prodNo) out.push(prodNo);
  }
  const devEnText = i18nBodyPlain(devBody, "en");
  const noText = i18nBodyPlain(devBody, "no") || i18nBodyPlain(prodBody, "no");
  if (devEn && isUsableEnglish(devEnText, noText)) out.push(devEn);
  else if (prodEn) out.push(prodEn);
  return out;
}

async function main() {
  const developer = clientFor("developer");
  const production = clientFor("production");
  const parity = loadParity();

  console.log("\n=== migrate-compare-design-to-production (SAFE REVISION) ===");
  console.log("projectId:", PROJECT_ID);
  console.log("APPLY:", APPLY);

  const summary = {
    created: [] as string[],
    patched: [] as string[],
    skipped: [] as string[],
    faqChanges: [] as any[],
    sharedInsurance: [] as any[],
    sharedCta: [] as any[],
    articles: [] as ArticleFieldPlan[],
    englishFieldsSkipped: [] as string[],
    slugChangesSkipped: [] as string[],
    publishedAtSkipped: [] as string[],
    mediaUploaded: [] as string[],
    mediaSkippedExisting: [] as string[],
    mediaUnused: [] as string[],
    missingReferences: [] as string[],
    errors: [] as string[],
  };

  // ── Load docs ─────────────────────────────────────────────────────────
  const pageIds = [
    "aboutPage",
    "newsPage",
    "clinicsPage",
    "clinicPage-majorstuen",
    "clinicPage-bekkestua",
    "clinicPage-moss",
    "clinicPage-moelv",
    "contactPage",
    "insurancePage",
    "category-fertilitet",
    "category-gynekologi",
    "category-urologi",
    "category-ortopedi",
    "category-graviditet",
    "category-flere-fagomrader",
    ...FAQ_CLEAR_TREATMENTS,
    SHARED_INSURANCE_ID,
    SHARED_CTA.ortopedi,
    SHARED_CTA.graviditet,
    SHARED_CTA.flere,
    "insurance-collection.shared-kvinnehelse",
    "specialist-cennet-akdeniz",
    "specialist-mia-kitter",
    "specialist-alenka-bindas",
    "specialist-ane-gerda-z-eriksson",
    "specialist-ashi-ahmad",
    "specialist-birgitte-aspenes",
    "specialist-henrik-michelsen-wahl",
    "specialist-jorgen-perminow",
    "specialist-madeleine-engen",
    "specialist-siri-klokstad",
    "specialist-thomas-fredrik-thaulow",
  ];

  const [devDocs, prodDocs] = await Promise.all([
    developer.fetch<any[]>(`*[_id in $ids]`, {ids: pageIds}),
    production.fetch<any[]>(`*[_id in $ids]`, {ids: pageIds}),
  ]);
  const devMap = new Map(devDocs.map((d) => [d._id, d]));
  const prodMap = new Map(prodDocs.map((d) => [d._id, d]));

  // Resolve articles by reference listing slugs
  async function articleIdForSlug(slug: string, client: SanityClient) {
    return client.fetch<string | null>(
      `*[_type=="article" && !(_id in path("drafts.**")) && coalesce(
        slug[language=="no"][0].value.current,
        slug[_key=="no"][0].value.current,
        slug[0].value.current,
        slug.current
      )==$slug][0]._id`,
      {slug},
    );
  }

  const articlePlans: ArticleFieldPlan[] = [];
  const articleDevById = new Map<string, any>();
  const articleProdById = new Map<string, any>();

  for (const slug of REFERENCE_LISTING_SLUGS) {
    const devId = await articleIdForSlug(slug, developer);
    if (!devId) {
      summary.errors.push(`Missing developer article for slug ${slug}`);
      continue;
    }
    const [devArt, prodArt] = await Promise.all([
      developer.fetch(`*[_id==$id][0]`, {id: devId}),
      production.fetch(`*[_id==$id][0]`, {id: devId}),
    ]);
    articleDevById.set(devId, devArt);
    if (prodArt) articleProdById.set(devId, prodArt);

    const ref = parity.get(slug);
    const fields: ArticleFieldPlan["fields"] = {
      titleNo: "SKIP",
      titleEn: "SKIP",
      excerptNo: "SKIP",
      excerptEn: "SKIP",
      category: "SKIP",
      publishedAt: "SKIP",
      slug: "SKIP",
      body: "SKIP",
      primaryImage: "SKIP",
    };
    const reasons: string[] = [];
    const setPayload: Record<string, unknown> = {};

    if (!prodArt) {
      // CREATE — NO from developer; EN only if usable English
      const titleNo = i18nGet(devArt.title, "no");
      const titleEn = i18nGet(devArt.title, "en");
      const excerptNo = i18nGet(devArt.excerpt, "no");
      const excerptEn = i18nGet(devArt.excerpt, "en");
      let title = setI18nLang([], "no", titleNo);
      if (isUsableEnglish(titleEn, titleNo)) {
        title = setI18nLang(title, "en", titleEn);
        fields.titleEn = "PATCH";
      } else {
        fields.titleEn = "SKIP";
        summary.englishFieldsSkipped.push(`${devId}.title.en (CREATE; Norwegian/unusable)`);
      }
      fields.titleNo = "PATCH";
      let excerpt = excerptNo ? setI18nLang([], "no", excerptNo) : undefined;
      if (excerpt && isUsableEnglish(excerptEn, excerptNo)) {
        excerpt = setI18nLang(excerpt, "en", excerptEn);
        fields.excerptEn = "PATCH";
      } else if (excerptEn) {
        fields.excerptEn = "SKIP";
        summary.englishFieldsSkipped.push(`${devId}.excerpt.en (CREATE; Norwegian/unusable)`);
      }
      if (excerptNo) fields.excerptNo = "PATCH";

      const body = mergeI18nBody(devArt.body, null);
      fields.body = "PATCH";
      fields.category = "PATCH";
      fields.primaryImage = devArt.primaryImage ? "PATCH" : "SKIP";
      fields.publishedAt = "PATCH"; // new doc needs a date — use developer/reference
      fields.slug = "PATCH"; // new doc needs slug

      Object.assign(setPayload, {
        title,
        ...(excerpt ? {excerpt} : {}),
        category: devArt.category,
        publishedAt: devArt.publishedAt,
        slug: devArt.slug,
        body,
        ...(devArt.primaryImage ? {primaryImage: devArt.primaryImage} : {}),
      });
      reasons.push("CREATE missing production article from reference listing");
      articlePlans.push({
        id: devId,
        slug,
        action: "CREATE",
        fields,
        reasons,
        setPayload,
      });
      continue;
    }

    // PATCH existing — conservative
    summary.slugChangesSkipped.push(`${devId}.slug (keep production)`);
    summary.publishedAtSkipped.push(`${devId}.publishedAt (keep production)`);

    const titleNoDev = i18nGet(devArt.title, "no");
    const titleNoProd = i18nGet(prodArt.title, "no");
    const titleEnDev = i18nGet(devArt.title, "en");
    const titleEnProd = i18nGet(prodArt.title, "en");
    const excerptNoDev = i18nGet(devArt.excerpt, "no");
    const excerptNoProd = i18nGet(prodArt.excerpt, "no");
    const excerptEnDev = i18nGet(devArt.excerpt, "en");
    const excerptEnProd = i18nGet(prodArt.excerpt, "en");

    let patchNoTitle = false;
    let patchEnTitle = false;
    if (titleNoDev && titleNoDev !== titleNoProd && ref?.titleOk) {
      fields.titleNo = "PATCH";
      patchNoTitle = true;
    }
    if (isUsableEnglish(titleEnDev, titleNoDev) && titleEnDev !== titleEnProd) {
      fields.titleEn = "PATCH";
      patchEnTitle = true;
    } else if (titleEnDev && !isUsableEnglish(titleEnDev, titleNoDev)) {
      fields.titleEn = "SKIP";
      summary.englishFieldsSkipped.push(
        `${devId}.title.en (developer EN is Norwegian/unusable; keep production EN)`,
      );
    }
    if (patchNoTitle || patchEnTitle) {
      setPayload.title = mergeI18nStringField(devArt.title, prodArt.title, {
        patchNo: patchNoTitle,
        patchEn: patchEnTitle,
      });
    }

    let patchNoExcerpt = false;
    let patchEnExcerpt = false;
    if (excerptNoDev && excerptNoDev !== excerptNoProd && ref?.ok) {
      fields.excerptNo = "PATCH";
      patchNoExcerpt = true;
    }
    if (isUsableEnglish(excerptEnDev, excerptNoDev) && excerptEnDev !== excerptEnProd) {
      fields.excerptEn = "PATCH";
      patchEnExcerpt = true;
    } else if (excerptEnDev && !isUsableEnglish(excerptEnDev, excerptNoDev)) {
      fields.excerptEn = "SKIP";
      summary.englishFieldsSkipped.push(
        `${devId}.excerpt.en (developer EN is Norwegian/unusable; keep production EN)`,
      );
    }
    if (patchNoExcerpt || patchEnExcerpt) {
      setPayload.excerpt = mergeI18nStringField(devArt.excerpt, prodArt.excerpt, {
        patchNo: patchNoExcerpt,
        patchEn: patchEnExcerpt,
      });
    }

    // Category only if reference confirms developer category
    if (
      ref?.catOk &&
      ref.refCategory &&
      devArt.category === ref.refCategory &&
      prodArt.category !== ref.refCategory
    ) {
      fields.category = "PATCH";
      setPayload.category = ref.refCategory;
      reasons.push(
        `category ${prodArt.category} -> ${ref.refCategory} (reference confirmed)`,
      );
    } else if (prodArt.category !== devArt.category) {
      fields.category = "SKIP";
      reasons.push(
        `category skipped (prod=${prodArt.category}, dev=${devArt.category}, ref=${ref?.refCategory || "?"})`,
      );
    }

    // Body: migrate NO from developer when parity ok; preserve production EN
    if (ref?.ok) {
      const merged = mergeI18nBody(devArt.body, prodArt.body);
      if (!stableEqual(merged, prodArt.body)) {
        fields.body = "PATCH";
        setPayload.body = merged;
        reasons.push("body NO from reference-parity developer; EN preserved from production");
        const devEnText = i18nBodyPlain(devArt.body, "en");
        if (devEnText && !isUsableEnglish(devEnText, i18nBodyPlain(devArt.body, "no"))) {
          summary.englishFieldsSkipped.push(
            `${devId}.body.en (developer EN Norwegian/unusable; kept production EN)`,
          );
        }
      }
    } else {
      fields.body = "SKIP";
      reasons.push("body skipped — no reference parity confirmation");
    }

    // Image: only when reference parity ok and asset differs
    const devImg = devArt.primaryImage?.asset?._ref;
    const prodImg = prodArt.primaryImage?.asset?._ref;
    if (ref?.ok && devImg && devImg !== prodImg) {
      fields.primaryImage = "PATCH";
      setPayload.primaryImage = devArt.primaryImage;
      reasons.push("primaryImage from reference-synced developer asset");
    } else if (devImg !== prodImg) {
      fields.primaryImage = "SKIP";
      reasons.push("primaryImage skipped — parity not confirmed or unchanged");
    }

    const anyPatch = Object.values(fields).some((v) => v === "PATCH");
    articlePlans.push({
      id: devId,
      slug,
      action: anyPatch ? "PATCH" : "SKIP",
      fields,
      reasons,
      setPayload: anyPatch ? setPayload : undefined,
    });
  }
  summary.articles = articlePlans;

  // newsPage featured/listing from reference order
  const listingIds: string[] = [];
  for (const slug of REFERENCE_LISTING_SLUGS) {
    const id = await articleIdForSlug(slug, developer);
    if (id) listingIds.push(id);
  }
  const featuredIds = listingIds.slice(0, REFERENCE_FEATURED_SLUGS.length);

  // ── Build non-article operations ──────────────────────────────────────
  type Op = {
    id: string;
    area: string;
    mode: "patch" | "create";
    set?: Record<string, unknown>;
    unset?: string[];
    note?: string;
  };
  const ops: Op[] = [];

  function addPatch(
    id: string,
    area: string,
    set: Record<string, unknown>,
    unset: string[] = [],
    note?: string,
  ) {
    if (!Object.keys(set).length && !unset.length) {
      summary.skipped.push(`${id} (no field changes)`);
      return;
    }
    ops.push({id, area, mode: "patch", set, unset, note});
  }

  // About / clinics / contact / insurance page / specialists — same intentional parity fields
  const simplePatches: Array<{id: string; area: string; fields: string[]; unset?: string[]}> = [
    {
      id: "aboutPage",
      area: "About",
      fields: ["title", "subtitle", "heroImage", "heroImageAlt", "body", "pageSections"],
    },
    {
      id: "clinicsPage",
      area: "Clinics",
      fields: ["heroImage", "seo", "pageSections"],
      unset: ["heroEyebrow"],
    },
    {
      id: "clinicPage-majorstuen",
      area: "Clinics",
      fields: [
        "title",
        "sortOrder",
        "address",
        "hours",
        "description",
        "primaryImage",
        "heroMedia",
      ],
      unset: ["locationSearch"],
    },
    {
      id: "clinicPage-bekkestua",
      area: "Clinics",
      fields: ["title", "sortOrder", "hours", "description", "primaryImage", "heroMedia"],
    },
    {
      id: "clinicPage-moss",
      area: "Clinics",
      fields: ["title", "sortOrder", "hours", "description", "primaryImage", "heroMedia"],
    },
    {
      id: "clinicPage-moelv",
      area: "Clinics",
      fields: ["title", "sortOrder", "hours", "description", "primaryImage", "heroMedia"],
    },
    {
      id: "contactPage",
      area: "Contact",
      fields: ["clinicsSection", "ctaCards", "pageSections"],
    },
    {
      id: "insurancePage",
      area: "Insurance",
      fields: ["slug", "partners", "partnersLocalized", "steps", "benefits", "heroImage"],
    },
  ];

  for (const sp of [
    {id: "specialist-alenka-bindas", fields: ["name", "clinics"]},
    {id: "specialist-ane-gerda-z-eriksson", fields: ["subtitle", "specialties"]},
    {id: "specialist-ashi-ahmad", fields: ["subtitle", "specialties"]},
    {id: "specialist-birgitte-aspenes", fields: ["specialties"]},
    {id: "specialist-henrik-michelsen-wahl", fields: ["specialties", "clinics"]},
    {id: "specialist-jorgen-perminow", fields: ["specialties"]},
    {id: "specialist-madeleine-engen", fields: ["specialties"]},
    {id: "specialist-siri-klokstad", fields: ["role", "subtitle", "specialties"]},
    {id: "specialist-thomas-fredrik-thaulow", fields: ["role", "subtitle", "specialties"]},
  ]) {
    simplePatches.push({id: sp.id, area: "Gynecology", fields: sp.fields});
  }

  for (const item of simplePatches) {
    const dev = devMap.get(item.id);
    const prod = prodMap.get(item.id);
    if (!dev) {
      summary.missingReferences.push(item.id);
      continue;
    }
    if (!prod) {
      ops.push({
        id: item.id,
        area: item.area,
        mode: "create",
        set: stripSystem(dev),
        note: "missing in production",
      });
      continue;
    }
    const set: Record<string, unknown> = {};
    for (const f of item.fields) {
      if (!stableEqual(dev[f], prod[f]) && dev[f] !== undefined) set[f] = dev[f];
    }
    const unset = (item.unset || []).filter((f) => prod[f] !== undefined);
    addPatch(item.id, item.area, set, unset);
  }

  // newsPage listing/social
  {
    const dev = devMap.get("newsPage");
    const prod = prodMap.get("newsPage");
    if (dev && prod) {
      const set: Record<string, unknown> = {
        featuredArticles: featuredIds.map((id, i) => ({
          _type: "reference",
          _ref: id,
          _key: `feat-${i}`,
        })),
        listingArticles: listingIds.map((id, i) => ({
          _type: "reference",
          _ref: id,
          _key: `list-${i}`,
        })),
        listSize: dev.listSize ?? 9,
      };
      for (const f of [
        "instagramSectionTitle",
        "socialPlatformCards",
        "instagramProfile",
      ] as const) {
        if (!stableEqual(dev[f], prod[f]) && dev[f] !== undefined) set[f] = dev[f];
      }
      addPatch("newsPage", "Aktuelt", set);
    }
  }

  // Categories with FAQ clear (except graviditet)
  for (const id of FAQ_CLEAR_CATEGORIES) {
    const dev = devMap.get(id);
    const prod = prodMap.get(id);
    if (!dev || !prod) {
      summary.missingReferences.push(id);
      continue;
    }
    const set: Record<string, unknown> = {};
    for (const f of ["landingPage", "pageSections", "heroMedia", "heroImage"] as const) {
      if (dev[f] !== undefined && !stableEqual(dev[f], prod[f])) set[f] = dev[f];
    }
    const unset = ["faqCollection", "faqs", "faqSectionTitle"].filter(
      (f) => prod[f] !== undefined,
    );
    summary.faqChanges.push({
      id,
      action: "CLEAR_FAQ",
      productionCollection: prod.faqCollection?._ref || null,
      developerCollection: dev.faqCollection?._ref || null,
      unset,
    });
    addPatch(id, "Category", set, unset, "reference has no FAQ");
  }

  // graviditet — keep FAQ collection/title; patch landing/pageSections only
  {
    const id = "category-graviditet";
    const dev = devMap.get(id);
    const prod = prodMap.get(id);
    if (dev && prod) {
      const set: Record<string, unknown> = {};
      for (const f of ["landingPage", "pageSections"] as const) {
        if (dev[f] !== undefined && !stableEqual(dev[f], prod[f])) set[f] = dev[f];
      }
      summary.faqChanges.push({
        id,
        action: "KEEP_PRODUCTION_FAQ",
        productionCollection: prod.faqCollection?._ref || null,
        developerCollection: dev.faqCollection?._ref || null,
      });
      addPatch(id, "Pregnancy", set, [], "FAQ collection/title preserved");
    }
  }

  // Fertility treatments — clear FAQ + parity fields
  for (const id of FAQ_CLEAR_TREATMENTS) {
    const dev = devMap.get(id);
    const prod = prodMap.get(id);
    if (!dev || !prod) {
      summary.missingReferences.push(id);
      continue;
    }
    const set: Record<string, unknown> = {};
    for (const f of [
      "pageSections",
      "hideSeePriser",
      "relatedSection",
      "primaryCtaLabel",
      "conversationCtaTitle",
      "promises",
    ] as const) {
      if (dev[f] !== undefined && !stableEqual(dev[f], prod[f])) set[f] = dev[f];
    }
    const unset = ["faqs", "faqCollection", "faqSectionTitle", "insurancePartners"].filter(
      (f) => prod[f] !== undefined,
    );
    summary.faqChanges.push({
      id,
      action: "CLEAR_FAQ",
      productionCollection: prod.faqCollection?._ref || null,
      unset,
    });
    addPatch(id, "Fertility", set, unset, "reference treatment has no FAQ");
  }

  // Shared insurance — only internalName + title
  {
    const id = SHARED_INSURANCE_ID;
    const dev = devMap.get(id);
    const prod = prodMap.get(id);
    if (dev && prod) {
      const set: Record<string, unknown> = {};
      if (!stableEqual(dev.internalName, prod.internalName)) set.internalName = dev.internalName;
      if (!stableEqual(dev.title, prod.title)) set.title = dev.title;
      // description intentionally skipped (internal note only; partners unchanged)
      summary.sharedInsurance.push({
        id,
        production: {
          internalName: prod.internalName,
          title: prod.title,
          description: prod.description,
        },
        developer: {
          internalName: dev.internalName,
          title: dev.title,
          description: dev.description,
        },
        fieldsToPatch: Object.keys(set),
        skippedFields: ["description", "partners", "partnersLocalized"],
      });
      addPatch(id, "Shared", set, [], "insurance title/internalName only");
    }
  }

  // Shared CTAs
  const ctaFieldPlan: Record<string, string[]> = {
    [SHARED_CTA.ortopedi]: ["subtitle", "primaryPath"],
    [SHARED_CTA.graviditet]: [
      "title",
      "subtitle",
      "primaryLabel",
      "primaryPath",
      "secondaryLabel",
      "quickInfoItems",
    ],
    [SHARED_CTA.flere]: ["subtitle", "primaryPath"],
  };
  for (const [id, fields] of Object.entries(ctaFieldPlan)) {
    const dev = devMap.get(id);
    const prod = prodMap.get(id);
    if (!dev || !prod) {
      summary.missingReferences.push(id);
      continue;
    }
    const set: Record<string, unknown> = {};
    for (const f of fields) {
      if (!stableEqual(dev[f], prod[f]) && dev[f] !== undefined) set[f] = dev[f];
    }
    summary.sharedCta.push({
      id,
      fieldsPlanned: fields,
      fieldsToPatch: Object.keys(set),
      production: {
        titleNo: i18nGet(prod.title, "no"),
        subtitleNo: i18nGet(prod.subtitle, "no"),
        primaryPath: prod.primaryPath,
      },
      developer: {
        titleNo: i18nGet(dev.title, "no"),
        subtitleNo: i18nGet(dev.subtitle, "no"),
        primaryPath: dev.primaryPath,
      },
    });
    addPatch(id, "Shared CTA", set);
  }

  // CREATE docs (including specialists referenced by approved fertility patches)
  for (const id of [
    "insurance-collection.shared-kvinnehelse",
    "specialist-cennet-akdeniz",
    "specialist-mia-kitter",
    // Required by approved category-fertilitet / treatment-fertilitet-infertilitet pageSections
    "specialist-anamika-choudhury",
    "specialist-kjersti-brenden",
  ]) {
    const dev = await developer.getDocument(id).catch(() => null);
    const prod = await production.getDocument(id).catch(() => null);
    if (!dev) {
      summary.missingReferences.push(id);
      continue;
    }
    if (!devMap.has(id)) devMap.set(id, dev as any);
    if (prod) {
      if (!prodMap.has(id)) prodMap.set(id, prod as any);
      summary.skipped.push(`${id} (already exists)`);
      continue;
    }
    ops.push({
      id,
      area: "CREATE",
      mode: "create",
      set: stripSystem(dev as any),
    });
  }

  // Article ops appended later after media map

  // ── Assets only for fields we will write ──────────────────────────────
  const assetIds = new Set<string>();
  for (const op of ops) {
    collectAssetIds(op.set, assetIds);
  }
  for (const plan of articlePlans) {
    collectAssetIds(plan.setPayload, assetIds);
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.resolve(
    process.cwd(),
    "..",
    "tmp",
    "production-backups",
    `compare-design-safe-${stamp}`,
  );
  fs.mkdirSync(backupDir, {recursive: true});

  const backupIds = [
    ...ops.filter((o) => o.mode === "patch").map((o) => o.id),
    ...articlePlans.filter((a) => a.action === "PATCH").map((a) => a.id),
  ];
  for (const id of backupIds) {
    const doc = prodMap.get(id) || articleProdById.get(id);
    if (!doc) continue;
    fs.writeFileSync(
      path.join(backupDir, `${id.replace(/[^\w.-]+/g, "_")}.json`),
      JSON.stringify(doc, null, 2),
    );
  }
  fs.writeFileSync(
    path.join(backupDir, "_index.json"),
    JSON.stringify(
      {
        backedUpAt: new Date().toISOString(),
        apply: APPLY,
        documentCount: backupIds.length,
        documents: backupIds,
      },
      null,
      2,
    ),
  );
  console.log("Backup directory:", backupDir);

  const assetResult = await ensureAssetsCopied(
    developer,
    production,
    [...assetIds],
    APPLY,
  );
  summary.mediaUploaded = assetResult.uploaded;
  summary.mediaSkippedExisting = assetResult.skipped;
  summary.mediaUnused = assetResult.unused;

  // ── Execute in dependency-safe order ──────────────────────────────────
  // 1) CREATE non-article docs
  // 2) CREATE articles (newsPage refs them)
  // 3) PATCH pages/categories/shared
  // 4) PATCH existing articles
  const createOps = ops.filter((o) => o.mode === "create");
  const patchOps = ops.filter((o) => o.mode === "patch");
  const articleCreates = articlePlans.filter((p) => p.action === "CREATE" && p.setPayload);
  const articlePatches = articlePlans.filter((p) => p.action === "PATCH" && p.setPayload);

  async function runCreateOp(op: (typeof ops)[number]) {
    const label = `${op.area} / ${op.id}`;
    console.log(`[CREATE] ${label}`);
    const body = remapAssets(op.set, assetResult.map) as Record<string, unknown>;
    if (!APPLY) {
      summary.created.push(`${op.id} (planned)`);
      return;
    }
    await production.createOrReplace({...body, _id: op.id});
    summary.created.push(op.id);
  }

  async function runPatchOp(op: (typeof ops)[number]) {
    console.log(
      `[PATCH] ${op.area} / ${op.id} set=[${Object.keys(op.set || {}).join(",")}] unset=[${(op.unset || []).join(",")}]`,
    );
    if (!APPLY) {
      summary.patched.push(`${op.id} (planned)`);
      return;
    }
    let p = production.patch(op.id);
    if (op.set && Object.keys(op.set).length) {
      p = p.set(remapAssets(op.set, assetResult.map) as Record<string, unknown>);
    }
    if (op.unset?.length) p = p.unset(op.unset);
    await p.commit({autoGenerateArrayKeys: false});
    summary.patched.push(op.id);
  }

  for (const op of createOps) {
    try {
      await runCreateOp(op);
    } catch (err: any) {
      summary.errors.push(`${op.id}: ${err?.message || err}`);
    }
  }

  for (const plan of articleCreates) {
    try {
      const payload = remapAssets(plan.setPayload, assetResult.map) as Record<
        string,
        unknown
      >;
      console.log(`[CREATE] Aktuelt / ${plan.id}`);
      if (!APPLY) {
        summary.created.push(`${plan.id} (planned)`);
        continue;
      }
      await production.createOrReplace({
        _id: plan.id,
        _type: "article",
        ...payload,
      });
      summary.created.push(plan.id);
    } catch (err: any) {
      summary.errors.push(`${plan.id}: ${err?.message || err}`);
    }
  }

  for (const op of patchOps) {
    try {
      await runPatchOp(op);
    } catch (err: any) {
      summary.errors.push(`${op.id}: ${err?.message || err}`);
    }
  }

  for (const plan of articlePatches) {
    try {
      const payload = remapAssets(plan.setPayload, assetResult.map) as Record<
        string,
        unknown
      >;
      console.log(
        `[PATCH] Aktuelt / ${plan.id} fields=${Object.keys(payload).join(",")}`,
      );
      if (!APPLY) {
        summary.patched.push(`${plan.id} (planned)`);
        continue;
      }
      await production
        .patch(plan.id)
        .set(payload)
        .commit({autoGenerateArrayKeys: false});
      summary.patched.push(plan.id);
    } catch (err: any) {
      summary.errors.push(`${plan.id}: ${err?.message || err}`);
    }
  }

  for (const plan of articlePlans) {
    if (plan.action === "SKIP" || !plan.setPayload) {
      summary.skipped.push(`${plan.id} (article no-op)`);
      console.log(`[SKIP] Aktuelt / ${plan.id}`);
    }
  }

  summary.skipped.push("pricingPage (already migrated)");
  summary.skipped.push("cta-collection-pricing-page (already migrated)");
  summary.skipped.push("clinicPage-ski delete (not applicable)");

  const outPath = path.join(
    backupDir,
    APPLY ? "apply-summary.json" : "dry-run-summary.json",
  );
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));

  // Compact article decision table
  console.log("\n=== ARTICLE FIELD DECISIONS ===");
  for (const a of articlePlans) {
    console.log(
      `${a.action} ${a.slug}\n  titleNo=${a.fields.titleNo} titleEn=${a.fields.titleEn} category=${a.fields.category} publishedAt=${a.fields.publishedAt} slug=${a.fields.slug} body=${a.fields.body} image=${a.fields.primaryImage}`,
    );
  }
  console.log("\n=== SHARED INSURANCE ===");
  console.log(JSON.stringify(summary.sharedInsurance, null, 2));
  console.log("\n=== FAQ ===");
  console.log(JSON.stringify(summary.faqChanges, null, 2));
  console.log("\n=== SUMMARY COUNTS ===");
  console.log({
    created: summary.created.length,
    patched: summary.patched.length,
    skipped: summary.skipped.length,
    englishSkipped: summary.englishFieldsSkipped.length,
    mediaUpload: summary.mediaUploaded.length,
    mediaExisting: summary.mediaSkippedExisting.length,
    errors: summary.errors.length,
  });
  console.log("\nSummary written:", outPath);
  if (!APPLY) {
    console.log("\nDRY RUN only — no production mutations.");
  }
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
