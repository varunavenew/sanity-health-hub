#!/usr/bin/env npx tsx
/**
 * Persist formerly positional/static treatment UI values in Sanity.
 *
 * Usage:
 *   DRY_RUN=1 npx tsx sanity/migrate-treatment-ui-contract.ts
 *   npx tsx sanity/migrate-treatment-ui-contract.ts
 */
import { sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const ICON_KEYS = ["file-text", "clock", "shield"] as const;

const i18n = (no: string, en: string) => [
  {
    _key: "no",
    _type: "internationalizedArrayStringValue",
    language: "no",
    value: no,
  },
  {
    _key: "en",
    _type: "internationalizedArrayStringValue",
    language: "en",
    value: en,
  },
];

const insurancePartners = [
  ["gjensidige", "Gjensidige"],
  ["if", "If"],
  ["fremtind", "Fremtind"],
  ["storebrand", "Storebrand"],
  ["tryg", "Tryg"],
  ["vertikal", "Vertikal"],
  ["codan", "Codan"],
  ["eika", "Eika"],
].map(([key, label]) => ({
  _key: key,
  key,
  label: i18n(label, label),
}));

type Treatment = {
  _id: string;
  title?: unknown;
  description?: unknown;
  seo?: Record<string, unknown>;
  quickInfoItems?: unknown[];
  layout?: Record<string, any>;
};

async function main() {
  const treatments = await sanityClient.fetch<Treatment[]>(
    `*[_type == "treatment" && !(_id in path("drafts.**"))]{
      _id,
      title,
      description,
      seo,
      quickInfoItems,
      layout
    }`,
  );

  let changed = 0;
  for (const treatment of treatments) {
    const patch: Record<string, unknown> = {};

    if (!treatment.seo?.metaTitle || !treatment.seo?.metaDescription) {
      patch.seo = {
        _type: "seo",
        ...(treatment.seo || {}),
        metaTitle: treatment.seo?.metaTitle || treatment.title,
        metaDescription: treatment.seo?.metaDescription || treatment.description,
      };
    }

    if (treatment.quickInfoItems?.length) {
      const alreadyStructured = treatment.quickInfoItems.every(
        (item) => item && typeof item === "object" && !Array.isArray(item) && "iconKey" in item,
      );
      if (!alreadyStructured) {
        patch.quickInfoItems = treatment.quickInfoItems.map((label, index) => ({
          _key: `quick-${index}`,
          _type: "treatmentQuickInfoItem",
          iconKey: ICON_KEYS[index] || "info",
          label,
        }));
      }
    }

    if (treatment.layout) {
      const layout = structuredClone(treatment.layout);
      let layoutChanged = false;
      const setIfMissing = (key: string, value: unknown) => {
        if (layout[key] == null || layout[key] === "") {
          layout[key] = value;
          layoutChanged = true;
        }
      };

      setIfMissing("homeBreadcrumbLabel", i18n("Hjem", "Home"));
      setIfMissing("srOnlyTitle", i18n("Behandlingsside hos CMedical", "Treatment page at CMedical"));
      setIfMissing("themesAriaLabel", i18n("Temaer", "Topics"));
      setIfMissing("seePricesLabel", i18n("Se priser", "See prices"));
      setIfMissing("seePricesHref", "/priser");
      setIfMissing("callCtaLabel", i18n("Ring oss", "Call us"));
      setIfMissing("expertReadMoreLabel", i18n("Les mer", "Read more"));
      setIfMissing("scrollLeftLabel", i18n("Scroll venstre", "Scroll left"));
      setIfMissing("scrollRightLabel", i18n("Scroll høyre", "Scroll right"));
      setIfMissing("insuranceEyebrow", i18n("Forsikringspartnere", "Insurance partners"));
      setIfMissing(
        "insuranceTitle",
        i18n("Vi samarbeider med de største forsikringsselskapene", "We work with the leading insurance providers"),
      );
      setIfMissing("insurancePartners", insurancePartners);

      if (Array.isArray(layout.promises)) {
        layout.promises = layout.promises.map((promise: Record<string, unknown>) => {
          const next = { ...promise };
          if (!next.image && layout.heroImage) {
            next.image = layout.heroImage;
            layoutChanged = true;
          }
          if (!next.imageAlt && next.title) {
            next.imageAlt = next.title;
            layoutChanged = true;
          }
          return next;
        });
      }

      if (layoutChanged) patch.layout = layout;
    }

    if (Object.keys(patch).length === 0) continue;
    changed++;
    console.log(`${DRY_RUN ? "DRY" : "PATCH"} ${treatment._id}: ${Object.keys(patch).join(", ")}`);
    if (!DRY_RUN) await sanityClient.patch(treatment._id).set(patch).commit();
  }

  console.log(`${DRY_RUN ? "Would update" : "Updated"} ${changed} treatment documents.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
