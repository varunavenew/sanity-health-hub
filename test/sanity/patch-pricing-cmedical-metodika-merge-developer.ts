#!/usr/bin/env npx tsx
/**
 * Developer-only: merge reference (CMedical) price lines with live Metodika
 * activities. One row per treatment. Bookable only when source=metodika.
 *
 *   cd test && npx tsx sanity/patch-pricing-cmedical-metodika-merge-developer.ts
 */
import { randomBytes } from "crypto";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

type I18nVal = {
  _key?: string;
  language?: string;
  value?: string;
};

type Activity = {
  group: string;
  clinicServiceId: string;
  name: string;
  apiActivityId: number;
  price: string;
};

const CLINIC_TO_CATEGORY: Record<string, string> = {
  endokrinolog: "Endokrinologi",
  fertilitet: "Fertilitet",
  fostermedisiner: "Graviditet og fostermedisin",
  fysioterapeut: "Ortopedi",
  gastrokirurg: "Gastrokirurgi",
  gynekolog: "Gynekologi",
  hudlege: "Hudhelse",
  handterapeut: "Ortopedi",
  ernaringsfysiolog: "Ernæringsfysiolog",
  ortoped: "Ortopedi",
  psykolog: "Psykologi",
  revmatolog: "Revmatologi",
  sexolog: "Sexologi",
  "sprengte-blodkar": "Hudhelse",
  urolog: "Urologi",
  areknuter: "Åreknutebehandling",
};

const CLINIC_TO_SUB: Record<string, string> = {
  endokrinolog: "Endokrinologi",
  fertilitet: "Fertilitetsutredning",
  fostermedisiner: "Svangerskapskontroll",
  fysioterapeut: "Fysioterapi",
  gastrokirurg: "Gastrokirurgi",
  gynekolog: "Konsultasjoner",
  hudlege: "Hudbehandlinger",
  handterapeut: "Håndterapi",
  ernaringsfysiolog: "Ernæringsfysiolog",
  ortoped: "Konsultasjoner",
  psykolog: "Psykologi",
  revmatolog: "Revmatologi",
  sexolog: "Sexologi",
  "sprengte-blodkar": "Hudbehandlinger",
  urolog: "Konsultasjoner",
  areknuter: "Åreknutebehandling",
};

/** Existing CMedical/design name → Metodika activity name. */
const ALIASES: Array<{ name: string; activity: string; category?: string }> = [
  {
    name: "Sterilisering (inkl. sædanalyse etter 3 mnd)",
    activity: "Sterilisering Mann",
  },
  { name: "Konisering", activity: "Konisering i lokalbedøvelse" },
  { name: "Enkel sædanalyse", activity: "Enkel sædanalyse" },
  {
    name: "Osteopat førstekonsultasjon 60 min",
    activity: "1.gangs konsultasjon hos fysioterapeut / osteopat",
  },
  {
    name: "Konsultasjon 30 min",
    activity: "Vurdering åreknuter",
    category: "Åreknutebehandling",
  },
  {
    name: "Konsultasjon hudlege (vurdering før behandling)",
    activity: "Konsultasjon hudlege",
  },
  { name: "Sexolog individuell", activity: "Sexolog" },
  {
    name: "Digital konsultasjon fedme vurdering",
    activity: "Digital konsultasjon fedme vurdering for robotkirurgi",
  },
  {
    name: "Organrettet ultralyd",
    activity: "Organrettet ultralyd (En mer avansert ultralyd)",
  },
  {
    name: "PMOS / hormonforstyrrelser",
    activity: "PCOS / Hormonforstyrrelser",
  },
  {
    name: "Fertilitetsutredning og rådgivning inkl. ultralyd",
    activity: "Fertilitetsutredning par",
  },
  {
    name: "Ultralyd i svangerskapet",
    activity: "Tidlig ultralyd",
  },
  {
    name: "Konsultasjon 30 min",
    activity: "Konsultasjon urolog",
    category: "Urologi",
  },
];

const CONTENT_FIXES: Record<
  string,
  { price?: number; priceLabel?: string; noteNo?: string; noteEn?: string }
> = {
  "Eggdonasjon (inkl. tilbakesetting av én blastocyst)": {
    price: 97000,
    priceLabel: "97.000,-",
    noteNo:
      "Beløpet splittes i to innbetalinger: 51.000,- ved oppstart av behandling og 46.000,- ved nedfrysing av blastocyst.",
    noteEn:
      "The amount is split into two payments: 51,000 at treatment start and 46,000 when the blastocyst is frozen.",
  },
};

function key() {
  return randomBytes(6).toString("hex");
}

function pick(arr: I18nVal[] | undefined, lang: string): string {
  if (!Array.isArray(arr)) return "";
  const hit = arr.find((x) => x.language === lang || x._key === lang);
  return String(hit?.value ?? "").trim();
}

function i18nStr(no: string, en?: string): I18nVal[] {
  return [
    {
      _type: "internationalizedArrayStringValue",
      _key: "no",
      language: "no",
      value: no,
    } as I18nVal,
    {
      _type: "internationalizedArrayStringValue",
      _key: "en",
      language: "en",
      value: en ?? no,
    } as I18nVal,
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

function formatNok(raw: string | number): string {
  if (raw === "" || raw == null) return "";
  const n =
    typeof raw === "number"
      ? raw
      : Number(String(raw).replace(/[^\d]/g, ""));
  if (!Number.isFinite(n)) return String(raw);
  if (n === 0) return "Gratis";
  return `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".")},-`;
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

async function loadMetodika(): Promise<Activity[]> {
  const res = await fetch("http://localhost:3000/api/booking/activity-groups");
  const json = (await res.json()) as {
    ok?: boolean;
    categories?: Array<{
      label?: string;
      clinicServiceId?: string;
      services?: Array<{
        name?: string;
        apiActivityId?: number;
        price?: string;
      }>;
    }>;
  };
  const acts: Activity[] = [];
  for (const g of json.categories || []) {
    for (const s of g.services || []) {
      if (typeof s.apiActivityId !== "number" || s.apiActivityId <= 0) continue;
      acts.push({
        group: g.label || "",
        clinicServiceId: g.clinicServiceId || "",
        name: String(s.name || "").trim(),
        apiActivityId: s.apiActivityId,
        price: String(s.price ?? ""),
      });
    }
  }
  return acts;
}

function findActivity(
  name: string,
  activities: Activity[],
  used: Set<number>,
  clinicHint?: string,
  categoryName?: string,
): Activity | undefined {
  const alias = ALIASES.find(
    (row) =>
      row.name === name && (!row.category || row.category === categoryName),
  )?.activity;
  const target = normalize(alias || name);
  const pool = clinicHint
    ? activities.filter((a) => a.clinicServiceId === clinicHint)
    : activities;

  const search = (list: Activity[], min: number) => {
    let best: { act: Activity; score: number } | null = null;
    for (const act of list) {
      if (used.has(act.apiActivityId)) continue;
      const n = normalize(act.name);
      let score = 0;
      if (n === target) score = 1;
      else if (n.includes(target) || target.includes(n)) score = 0.9;
      else score = jaccard(tokenSet(name), tokenSet(act.name));
      if (score < min) continue;
      if (!best || score > best.score) best = { act, score };
    }
    return best?.score && best.score >= min ? best.act : undefined;
  };

  return (
    search(pool, 0.72) ||
    (clinicHint ? search(activities, 0.88) : undefined)
  );
}

function bookingSlugToClinic(slug: string): string | undefined {
  const map: Record<string, string> = {
    gynekologi: "gynekolog",
    urologi: "urolog",
    fertilitet: "fertilitet",
    ortopedi: "ortoped",
    graviditet: "fostermedisiner",
  };
  return map[slug];
}

async function main() {
  console.log({ PROJECT_ID, DATASET });
  if (PROJECT_ID !== "9jhqpk3a" || DATASET !== "developer") {
    throw new Error("developer dataset only");
  }

  const activities = await loadMetodika();
  const validIds = new Set(activities.map((a) => a.apiActivityId));
  console.log("Metodika activities:", activities.length);

  const page = await sanityClient.fetch<any>(
    `*[_type=="pricingPage" && !(_id in path("drafts.**"))][0]{
      _id, title, introText, priceCategories
    }`,
  );
  if (!page?._id) throw new Error("pricingPage missing");

  const used = new Set<number>();
  const matched: string[] = [];
  const added: string[] = [];

  const priceCategories = (page.priceCategories || []).map((cat: any) => {
    const catName = pick(cat.categoryName, "no");
    const clinicHint = bookingSlugToClinic(cat.bookingCategorySlug);

    const subcategories = (cat.subcategories || []).map((sub: any) => {
      const items = (sub.items || []).map((item: any) => {
        const nameNo = pick(item.name, "no");
        const fix = CONTENT_FIXES[nameNo];
        let source =
          item.source === "metodika" ? "metodika" : "cmedical";
        let apiActivityId =
          typeof item.apiActivityId === "number" && item.apiActivityId > 0
            ? item.apiActivityId
            : undefined;

        if (apiActivityId && !validIds.has(apiActivityId)) {
          apiActivityId = undefined;
          source = "cmedical";
        }
        if (apiActivityId && used.has(apiActivityId)) {
          apiActivityId = undefined;
          source = "cmedical";
        }
        if (apiActivityId) {
          const bound = activities.find((a) => a.apiActivityId === apiActivityId);
          const alias = ALIASES.find(
            (row) =>
              row.name === nameNo &&
              (!row.category || row.category === catName),
          )?.activity;
          const target = normalize(alias || nameNo);
          const boundName = normalize(bound?.name || "");
          const similar =
            boundName === target ||
            boundName.includes(target) ||
            target.includes(boundName) ||
            jaccard(tokenSet(nameNo), tokenSet(bound?.name || "")) >= 0.5;
          if (!similar) {
            apiActivityId = undefined;
            source = "cmedical";
          }
        }

        if (!apiActivityId) {
          const hit = findActivity(
            nameNo,
            activities,
            used,
            clinicHint,
            catName,
          );
          if (hit) {
            apiActivityId = hit.apiActivityId;
            source = "metodika";
            matched.push(`${catName} / ${nameNo} → #${hit.apiActivityId} (${hit.name})`);
          }
        }

        if (apiActivityId && validIds.has(apiActivityId)) {
          used.add(apiActivityId);
          source = "metodika";
        } else {
          apiActivityId = undefined;
          source = "cmedical";
        }

        const next: Record<string, unknown> = {
          ...item,
          source,
        };
        if (apiActivityId) next.apiActivityId = apiActivityId;
        else delete next.apiActivityId;

        if (fix?.price != null) next.price = fix.price;
        if (fix?.priceLabel) next.priceLabel = i18nStr(fix.priceLabel, fix.priceLabel);
        if (fix?.noteNo) next.note = i18nStr(fix.noteNo, fix.noteEn || fix.noteNo);

        return next;
      });
      const seenIds = new Set<number>();
      const deduped = items.filter((item: any) => {
        const id = item.apiActivityId;
        if (typeof id !== "number" || id <= 0) return true;
        if (seenIds.has(id)) return false;
        seenIds.add(id);
        return true;
      });
      return { ...sub, items: deduped };
    });

    return { ...cat, subcategories };
  });

  for (const cat of priceCategories) {
    for (const sub of cat.subcategories || []) {
      sub.items = (sub.items || []).filter((item: any) => {
        if (item.apiActivityId) return true;
        const nameNo = pick(item.name, "no");
        const act = activities.find(
          (a) =>
            normalize(a.name) === normalize(nameNo) ||
            normalize(a.name).includes(normalize(nameNo)) ||
            normalize(nameNo).includes(normalize(a.name)),
        );
        return !(act && used.has(act.apiActivityId));
      });
    }
  }

  const leftover = activities.filter((a) => !used.has(a.apiActivityId));
  for (const act of leftover) {
    const catName = CLINIC_TO_CATEGORY[act.clinicServiceId];
    const subLabel = CLINIC_TO_SUB[act.clinicServiceId];
    if (!catName || !subLabel) {
      console.warn("No category mapping for", act.clinicServiceId, act.name);
      continue;
    }
    const cat = priceCategories.find(
      (c: any) => pick(c.categoryName, "no") === catName,
    );
    if (!cat) {
      console.warn("Missing category", catName);
      continue;
    }
    let sub = (cat.subcategories || []).find(
      (s: any) => pick(s.label, "no") === subLabel,
    );
    if (!sub) {
      sub = {
        _type: "object",
        _key: key(),
        label: i18nStr(subLabel, subLabel),
        linkToCategoryPage: false,
        items: [],
      };
      cat.subcategories = [...(cat.subcategories || []), sub];
    }
    const priceNum = Number(String(act.price).replace(/[^\d]/g, ""));
    const priceLabel = formatNok(act.price);
    sub.items = [
      ...(sub.items || []),
      {
        _type: "object",
        _key: key(),
        name: i18nStr(act.name, act.name),
        ...(Number.isFinite(priceNum) ? { price: priceNum } : {}),
        priceLabel: i18nStr(priceLabel, priceLabel),
        source: "metodika",
        apiActivityId: act.apiActivityId,
      },
    ];
    used.add(act.apiActivityId);
    added.push(`${catName} / ${act.name} #${act.apiActivityId}`);
  }

  const titleNo = pick(page.title, "no");
  const introNo = pick(page.introText, "no");
  const patch: Record<string, unknown> = { priceCategories };
  if (titleNo !== "Prisliste") {
    patch.title = i18nStr("Prisliste", "Price list");
  }
  if (introNo !== "Oversiktlige priser sortert etter tjeneste") {
    patch.introText = i18nStr(
      "Oversiktlige priser sortert etter tjeneste",
      "Clear prices sorted by service",
    );
  }

  await sanityClient.patch(page._id).set(patch).commit({ autoGenerateArrayKeys: false });

  let metodika = 0;
  let cmedical = 0;
  for (const cat of priceCategories) {
    for (const sub of cat.subcategories || []) {
      for (const item of sub.items || []) {
        if (item.source === "metodika") metodika++;
        else cmedical++;
      }
    }
  }

  console.log(
    JSON.stringify(
      {
        documentId: page._id,
        metodika,
        cmedical,
        matched,
        added,
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
