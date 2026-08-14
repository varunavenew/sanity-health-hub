#!/usr/bin/env npx tsx
/**
 * Developer-only: seed pricingPage.priceCategories from scraped reference
 * (tmp/priser-ref-full.json) and attach Metodika apiActivityId when a name
 * match exists (tmp/metodika-activities.json).
 *
 * Sanity remains the pricing list source of truth.
 * Metodika activity id is optional booking identity only.
 *
 *   cd test && npx tsx sanity/seed-pricing-from-reference-developer.ts
 */
import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

type RefItem = {
  name: string;
  price: string;
  duration?: string;
  bookable?: boolean;
  href?: string;
};

type RefSub = { label: string; items: RefItem[] };
type RefSection = { label: string; subcategories: RefSub[] };

type Activity = {
  group: string;
  clinicServiceId: string;
  categoryId: string;
  name: string;
  apiActivityId?: number;
  price: string;
};

const CATEGORY_META: Record<
  string,
  {
    bookingCategorySlug: string;
    treatmentCategoryId?: string;
    en: string;
  }
> = {
  Gynekologi: {
    bookingCategorySlug: "gynekologi",
    treatmentCategoryId: "category-gynekologi",
    en: "Gynecology",
  },
  Urologi: {
    bookingCategorySlug: "urologi",
    treatmentCategoryId: "category-urologi",
    en: "Urology",
  },
  Fertilitet: {
    bookingCategorySlug: "fertilitet",
    treatmentCategoryId: "category-fertilitet",
    en: "Fertility",
  },
  Ortopedi: {
    bookingCategorySlug: "ortopedi",
    treatmentCategoryId: "category-ortopedi",
    en: "Orthopedics",
  },
  Endokrinologi: {
    bookingCategorySlug: "flere-fagomrader",
    treatmentCategoryId: "category-flere-fagomrader",
    en: "Endocrinology",
  },
  Ernæringsfysiolog: {
    bookingCategorySlug: "flere-fagomrader",
    treatmentCategoryId: "category-flere-fagomrader",
    en: "Clinical nutrition",
  },
  "Forebyggende helse": {
    bookingCategorySlug: "flere-fagomrader",
    treatmentCategoryId: "category-flere-fagomrader",
    en: "Preventive health",
  },
  Gastrokirurgi: {
    bookingCategorySlug: "flere-fagomrader",
    treatmentCategoryId: "category-flere-fagomrader",
    en: "Gastrointestinal surgery",
  },
  "Graviditet og fostermedisin": {
    bookingCategorySlug: "graviditet",
    treatmentCategoryId: "category-graviditet",
    en: "Pregnancy and fetal medicine",
  },
  Hudhelse: {
    bookingCategorySlug: "flere-fagomrader",
    treatmentCategoryId: "category-flere-fagomrader",
    en: "Skin health",
  },
  Osteopati: {
    bookingCategorySlug: "flere-fagomrader",
    treatmentCategoryId: "category-flere-fagomrader",
    en: "Osteopathy",
  },
  Overvektskirurgi: {
    bookingCategorySlug: "flere-fagomrader",
    treatmentCategoryId: "category-flere-fagomrader",
    en: "Bariatric surgery",
  },
  Psykologi: {
    bookingCategorySlug: "flere-fagomrader",
    treatmentCategoryId: "category-flere-fagomrader",
    en: "Psychology",
  },
  Revmatologi: {
    bookingCategorySlug: "flere-fagomrader",
    treatmentCategoryId: "category-flere-fagomrader",
    en: "Rheumatology",
  },
  Sexologi: {
    bookingCategorySlug: "flere-fagomrader",
    treatmentCategoryId: "category-flere-fagomrader",
    en: "Sexology",
  },
  Åreknutebehandling: {
    bookingCategorySlug: "flere-fagomrader",
    treatmentCategoryId: "category-flere-fagomrader",
    en: "Varicose vein treatment",
  },
};

const SUB_EN: Record<string, string> = {
  Konsultasjoner: "Consultations",
  "Operasjoner og kirurgi": "Surgery",
  Kirurgi: "Surgery",
  "Robotkirurgi og prostata": "Robotic surgery and prostate",
  Fertilitetsutredning: "Fertility assessment",
  "Assistert befruktning": "Assisted reproduction",
  "Frysebehandlinger (assistert befruktning)": "Cryopreservation (assisted reproduction)",
  Inseminasjon: "Insemination",
  "Sædanalyse og mannlig infertilitet": "Semen analysis and male infertility",
  Donorbehandling: "Donor treatment",
  "Nedfrysing og oppbevaring av egne egg": "Egg freezing and storage",
  "Øvrige tjenester": "Other services",
  Håndterapi: "Hand therapy",
  Fysioterapi: "Physiotherapy",
  Endokrinologi: "Endocrinology",
  Ernæringsfysiolog: "Clinical nutrition",
  "Forebyggende helse": "Preventive health",
  Gastrokirurgi: "Gastrointestinal surgery",
  Svangerskapskontroll: "Pregnancy check-ups",
  Fosterdiagnostikk: "Fetal diagnostics",
  "Fødselsforberedelse og oppfølging": "Birth preparation and follow-up",
  "Konsultasjon og priser": "Consultation and prices",
  Hudbehandlinger: "Skin treatments",
  Behandlingsutstyr: "Treatment equipment",
  Hudpleieprodukter: "Skincare products",
  Osteopati: "Osteopathy",
  Overvektskirurgi: "Bariatric surgery",
  Psykologi: "Psychology",
  Revmatologi: "Rheumatology",
  Sexologi: "Sexology",
  Åreknutebehandling: "Varicose vein treatment",
};

/** Prefer matching within these Metodika clinicServiceIds per Sanity booking slug. */
const BOOKING_TO_CLINIC: Record<string, string[]> = {
  gynekologi: ["gynekolog"],
  urologi: ["urolog"],
  fertilitet: ["fertilitet"],
  ortopedi: ["ortoped", "handterapeut", "fysioterapeut"],
  graviditet: ["fostermedisiner"],
  "flere-fagomrader": [],
};

/** Explicit Sanity display name → Metodika activity name (when fuzzy match fails). */
const MANUAL_ALIASES: Record<string, string> = {
  "PMOS / hormonforstyrrelser": "PCOS / Hormonforstyrrelser",
  "Smerter i underlivet / vulvodyni / vaginisme":
    "Smerter i underlivet / Vulvodyni / Vaginisme",
  "Ultralyd i svangerskapet": "Tidlig ultralyd",
  Konsultasjon: "Konsultasjon urolog",
  "Konsultasjon utter": "Konsultasjon urolog",
  "Sædanalyse (ikke infertilitetsutredning)": "Sædanalyse",
  "Fertilitetsutredning og rådgivning inkl. ultralyd":
    "Fertilitetsutredning par",
  "Enkel sædanalyse": "Enkel sædanalyse",
  "Infertilitet Mann (inkl. sædprøve)": "Infertilitet Mann (inkl. sædprøve)",
  "Uforpliktende telefonsamtale om fertilitet med sykepleier":
    "Uforpliktende telefonsamtale om fertilitet med sykepleier",
  "Telefonkonsultasjon fertilitet": "Telefonkonsultasjon fertilitet",
  "Samtaleterapi under fertilitetsbehandling":
    "Samtaleterapi under fertilitetsbehandling",
  "Tidlig ultralyd": "Tidlig ultralyd",
  "Tidlig ultralyd + NIPT-test": "Tidlig ultralyd + NIPT-test",
  "Organrettet ultralyd (En mer avansert ultralyd)":
    "Organrettet ultralyd (En mer avansert ultralyd)",
  "Organrettet ultralyd + NIPT test (uke 12-14)":
    "Organrettet ultralyd + NIPT test (uke 12-14)",
  Svangerskapskontroll: "Svangerskapskontroll",
  "Blod i urin, cystoskopi": "Blod i urin, cystoskopi",
  "Vurdering åreknuter": "Vurdering åreknuter fra kr.",
  Sexolog: "Sexolog",
  "Sexolog for par": "Sexolog for par",
  "Førstegangskonsultasjon revmatolog": "Førstegangskonsultasjon revmatolog",
  "Kontroll revmatolog": "Kontroll revmatolog",
  "Klinisk ernæringsfysiolog": "Klinisk ernæringsfysiolog",
  "Endokrinolog 60 min konsultasjon": "Endokrinolog 60 min konsultasjon",
  "Endokrinolog oppfølging/kontroll 30 min":
    "Endokrinolog oppfølging/kontroll 30 min",
};

function key() {
  return randomBytes(6).toString("hex");
}

function i18nStr(no: string, en?: string) {
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
      value: en ?? no,
    },
  ];
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function tokenSet(s: string): Set<string> {
  return new Set(normalize(s).split(" ").filter((t) => t.length > 2));
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

function parsePriceNok(label: string): number | undefined {
  const m = label.replace(/\s/g, "").match(/(\d[\d.]*)/);
  if (!m) return undefined;
  const n = Number(m[1].replace(/\./g, ""));
  return Number.isFinite(n) ? n : undefined;
}

type MatchResult = {
  apiActivityId?: number;
  matchedName?: string;
  score?: number;
};

function matchActivity(
  itemName: string,
  bookingSlug: string,
  activities: Activity[],
  usedIds: Set<number>,
): MatchResult {
  const preferred = BOOKING_TO_CLINIC[bookingSlug] ?? [];
  const pool =
    preferred.length > 0
      ? activities.filter((a) => preferred.includes(a.clinicServiceId))
      : activities;

  const alias = MANUAL_ALIASES[itemName];
  if (alias) {
    const exact = activities.find(
      (a) =>
        a.apiActivityId != null &&
        !usedIds.has(a.apiActivityId) &&
        normalize(a.name) === normalize(alias),
    );
    if (exact?.apiActivityId != null) {
      usedIds.add(exact.apiActivityId);
      return {
        apiActivityId: exact.apiActivityId,
        matchedName: exact.name,
        score: 1,
      };
    }
  }

  const target = normalize(itemName);
  const targetTokens = tokenSet(itemName);

  let best: { act: Activity; score: number } | null = null;

  for (const act of pool) {
    if (act.apiActivityId == null || usedIds.has(act.apiActivityId)) continue;
    const name = normalize(act.name);
    let score = 0;
    if (name === target) score = 1;
    else if (name.includes(target) || target.includes(name)) score = 0.92;
    else score = jaccard(targetTokens, tokenSet(act.name));

    // Soft boost when significant shared tokens
    if (score < 0.55) continue;
    if (!best || score > best.score) best = { act, score };
  }

  // Broader search if category-scoped miss
  if (!best && preferred.length > 0) {
    for (const act of activities) {
      if (act.apiActivityId == null || usedIds.has(act.apiActivityId)) continue;
      const name = normalize(act.name);
      let score = 0;
      if (name === target) score = 1;
      else if (name.includes(target) || target.includes(name)) score = 0.9;
      else score = jaccard(targetTokens, tokenSet(act.name));
      if (score < 0.72) continue;
      if (!best || score > best.score) best = { act, score };
    }
  }

  if (!best || best.act.apiActivityId == null) return {};
  usedIds.add(best.act.apiActivityId);
  return {
    apiActivityId: best.act.apiActivityId,
    matchedName: best.act.name,
    score: best.score,
  };
}

async function main() {
  console.log("\nSanity Pricing Seed");
  console.log("Project ID:", PROJECT_ID);
  console.log("Dataset:", DATASET);

  if (DATASET !== "developer") {
    throw new Error("Refusing to seed pricing outside developer dataset.");
  }

  const root = path.join(process.cwd(), "..");
  const refPath = path.join(root, "tmp", "priser-ref-full.json");
  const actPath = path.join(root, "tmp", "metodika-activities.json");

  const ref = JSON.parse(fs.readFileSync(refPath, "utf8")) as {
    sections: RefSection[];
  };
  const acts = JSON.parse(fs.readFileSync(actPath, "utf8")) as {
    activities: Activity[];
  };

  const page = await sanityClient.fetch<{ _id: string } | null>(
    `*[_type=="pricingPage" && !(_id in path("drafts.**"))][0]{_id}`,
  );
  if (!page?._id) throw new Error("No published pricingPage found.");

  const usedIds = new Set<number>();
  const matchLog: Array<{
    category: string;
    item: string;
    apiActivityId?: number;
    matchedName?: string;
    score?: number;
    bookableOnRef: boolean;
  }> = [];

  const priceCategories = ref.sections.map((section) => {
    const meta = CATEGORY_META[section.label] ?? {
      bookingCategorySlug: "flere-fagomrader",
      treatmentCategoryId: "category-flere-fagomrader",
      en: section.label,
    };

    const subcategories = section.subcategories.map((sub) => {
      const items = sub.items.map((item) => {
        const match = item.bookable
          ? matchActivity(
              item.name,
              meta.bookingCategorySlug,
              acts.activities,
              usedIds,
            )
          : {};

        matchLog.push({
          category: section.label,
          item: item.name,
          bookableOnRef: !!item.bookable,
          ...match,
        });

        const doc: Record<string, unknown> = {
          _key: key(),
          _type: "object",
          name: i18nStr(item.name),
          priceLabel: i18nStr(item.price),
          note: item.duration ? i18nStr(item.duration) : undefined,
          price: parsePriceNok(item.price),
          // Explicit CMS origin — never infer at runtime from name/slug.
          source: match.apiActivityId != null ? "metodika" : "sanity",
        };
        if (match.apiActivityId != null) {
          doc.apiActivityId = match.apiActivityId;
        }
        return doc;
      });

      return {
        _key: key(),
        _type: "object",
        label: i18nStr(sub.label, SUB_EN[sub.label] ?? sub.label),
        items,
      };
    });

    const catDoc: Record<string, unknown> = {
      _key: key(),
      _type: "object",
      categoryName: i18nStr(section.label, meta.en),
      bookingCategorySlug: meta.bookingCategorySlug,
      subcategories,
      items: [],
    };
    if (meta.treatmentCategoryId) {
      catDoc.category = {
        _type: "reference",
        _ref: meta.treatmentCategoryId,
      };
    }
    return catDoc;
  });

  await sanityClient
    .patch(page._id)
    .set({ priceCategories })
    .commit({ autoGenerateArrayKeys: false });

  // Discard draft override if present
  const draftId = `drafts.${page._id}`;
  try {
    await sanityClient.delete(draftId);
  } catch {
    /* no draft */
  }

  const withId = matchLog.filter((m) => m.apiActivityId != null);
  const bookableRef = matchLog.filter((m) => m.bookableOnRef);
  const bookableWithId = bookableRef.filter((m) => m.apiActivityId != null);
  const nonBookable = matchLog.filter((m) => !m.bookableOnRef);

  const reportPath = path.join(root, "tmp", "pricing-seed-match-report.json");
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        pricingPageId: page._id,
        totals: {
          items: matchLog.length,
          withApiActivityId: withId.length,
          bookableOnRef: bookableRef.length,
          bookableOnRefWithId: bookableWithId.length,
          nonBookableOnRef: nonBookable.length,
        },
        matches: withId,
        unmatchedBookable: bookableRef.filter((m) => m.apiActivityId == null),
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(`Patched ${page._id}`);
  console.log(
    `Items: ${matchLog.length} | with apiActivityId: ${withId.length}`,
  );
  console.log(
    `Ref bookable: ${bookableRef.length} | matched: ${bookableWithId.length}`,
  );
  console.log(`Report → ${reportPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
