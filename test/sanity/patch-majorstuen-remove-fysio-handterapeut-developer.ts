#!/usr/bin/env npx tsx
/**
 * #307 (Aina): Remove Fysioterapeut and Håndterapeut from Majorstuen clinic list.
 * Keeps Uroterapi (still no page — separate content ticket).
 *
 *   cd test && npx tsx sanity/patch-majorstuen-remove-fysio-handterapeut-developer.ts
 *   DRY_RUN=1 npx tsx sanity/patch-majorstuen-remove-fysio-handterapeut-developer.ts
 */
import { DATASET, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const REMOVE_IDS = new Set(["handterapeut", "fysioterapeut"]);
const CLINIC_ID = "clinicPage-majorstuen";

type L = "no" | "en";

type I18nRow = {
  _key?: string;
  _type?: string;
  language?: string;
  value?: string;
};

type ServiceItem = {
  _key?: string;
  _type?: string;
  serviceId?: string;
  label?: I18nRow[];
  href?: string;
};

type ClinicDoc = {
  _id: string;
  services?: string[];
  servicesSection?: {
    title?: I18nRow[];
    description?: I18nRow[];
    items?: ServiceItem[];
  };
};

const i18n = (type: "String" | "Text", no: string, en: string): I18nRow[] =>
  (["no", "en"] as L[]).map((language) => ({
    _key: language,
    _type: `internationalizedArray${type}Value`,
    language,
    value: language === "no" ? no : en,
  }));

function buildDescription(count: number, allLinked: boolean) {
  return {
    no: `CMedical Oslo Majorstuen tilbyr ${count} ulike tjenester. ${
      allLinked ? "Klikk for å lese mer." : "Klikk på tjenestene med pil for å lese mer."
    }`,
    en: `CMedical Oslo Majorstuen offers ${count} different services. ${
      allLinked ? "Click to read more." : "Click the services with an arrow to read more."
    }`,
  };
}

async function run() {
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}" — developer only.`);
  }

  const doc = await sanityClient.fetch<ClinicDoc | null>(
    `*[_id == $id][0]{ _id, services, servicesSection }`,
    { id: CLINIC_ID },
  );

  if (!doc) {
    throw new Error(`No document found for ${CLINIC_ID}`);
  }

  const prevServices = doc.services ?? [];
  const nextServices = prevServices.filter((id) => !REMOVE_IDS.has(id));
  const prevItems = doc.servicesSection?.items ?? [];
  const nextItems = prevItems.filter((item) => !REMOVE_IDS.has((item.serviceId || "").trim()));

  const removedFromServices = prevServices.filter((id) => REMOVE_IDS.has(id));
  const removedFromItems = prevItems
    .map((item) => (item.serviceId || "").trim())
    .filter((id) => REMOVE_IDS.has(id));

  if (removedFromServices.length === 0 && removedFromItems.length === 0) {
    console.log(`Nothing to remove on ${CLINIC_ID} (already clean).`);
    return;
  }

  const allLinked = nextItems.every((item) => Boolean((item.href || "").trim()));
  const desc = buildDescription(nextItems.length || nextServices.length, allLinked);

  const set: Record<string, unknown> = {
    services: nextServices,
    "servicesSection.items": nextItems,
    "servicesSection.description": i18n("Text", desc.no, desc.en),
  };

  console.log(`Dataset: ${DATASET}${DRY_RUN ? " (DRY RUN)" : ""}`);
  console.log(`Removing from services[]: ${removedFromServices.join(", ") || "(none)"}`);
  console.log(`Removing from items[]: ${removedFromItems.join(", ") || "(none)"}`);
  console.log(`Next count: ${nextItems.length || nextServices.length} services`);

  if (DRY_RUN) {
    console.log("Would set:", JSON.stringify(set, null, 2));
    return;
  }

  await sanityClient.patch(doc._id).set(set).commit({ autoGenerateArrayKeys: true });
  console.log(`✓ Patched ${doc._id}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
