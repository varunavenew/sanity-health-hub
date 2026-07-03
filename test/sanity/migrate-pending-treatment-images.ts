#!/usr/bin/env npx tsx
/**
 * Fill pending treatment media without sourcing legacy page content.
 *
 * - treatment.heroImage: category hero when missing
 * - layout.heroImage: treatment hero
 * - layout.flowImage: shared clinic image when flow steps exist
 * - related/expert/text images: referenced treatment hero or current treatment hero
 * - every image receives an explicitly stored localized alt field
 *
 * Usage:
 *   DRY_RUN=1 npx tsx sanity/migrate-pending-treatment-images.ts
 *   npx tsx sanity/migrate-pending-treatment-images.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FLOW_IMAGE_PATH = path.resolve(
  __dirname,
  "../../src/assets/hero/hero-clinic-lounge.jpg",
);

type Image = {
  _type?: string;
  asset?: { _type?: string; _ref?: string };
};

type I18nValue = Array<{
  _key?: string;
  language?: string;
  value?: string;
}>;

type Card = {
  _key?: string;
  title?: I18nValue;
  path?: string;
  image?: Image;
  imageAlt?: I18nValue;
  [key: string]: unknown;
};

type Treatment = {
  _id: string;
  title?: I18nValue;
  slug?: string;
  categoryId?: string;
  categoryHero?: Image;
  heroImage?: Image;
  heroImageAlt?: I18nValue;
  layout?: {
    heroImage?: Image;
    heroImageAlt?: I18nValue;
    flow?: unknown[];
    flowImage?: Image;
    flowImageAlt?: I18nValue;
    related?: Card[];
    expertAreas?: {
      items?: Card[];
      [key: string]: unknown;
    };
    textSection?: {
      image?: Image;
      imageAlt?: I18nValue;
      [key: string]: unknown;
    };
  };
};

const hasImage = (image: Image | undefined) => Boolean(image?.asset?._ref);
const hasAlt = (alt: I18nValue | undefined) =>
  Array.isArray(alt) && alt.some((entry) => entry?.value?.trim());

function slugFromPath(value: string | undefined): string {
  return (value || "").split("?")[0].split("#")[0].split("/").filter(Boolean).pop() || "";
}

function categoryFromPath(value: string | undefined): string {
  const parts = (value || "").split("?")[0].split("#")[0].split("/").filter(Boolean);
  return parts.length >= 3 ? parts[parts.length - 2] || "" : "";
}

function fixedAlt(no: string, en: string): I18nValue {
  return [
    {
      _key: "no",
      language: "no",
      _type: "internationalizedArrayStringValue",
      value: no,
    },
    {
      _key: "en",
      language: "en",
      _type: "internationalizedArrayStringValue",
      value: en,
    },
  ];
}

async function sharedFlowImage(): Promise<Image | undefined> {
  if (!fs.existsSync(FLOW_IMAGE_PATH)) {
    throw new Error(`Missing shared flow image: ${FLOW_IMAGE_PATH}`);
  }
  if (DRY_RUN) return undefined;
  const asset = await sanityClient.assets.upload("image", fs.readFileSync(FLOW_IMAGE_PATH), {
    filename: "treatment-flow-clinic.jpg",
    contentType: "image/jpeg",
  });
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
}

async function main() {
  const treatments = await sanityClient.fetch<Treatment[]>(
    `*[_type == "treatment" && !(_id in path("drafts.**"))]{
      _id,
      title,
      "slug": coalesce(
        slug[language == "no"][0].value.current,
        slug[_key == "no"][0].value.current,
        slug[0].value.current,
        slug.current
      ),
      "categoryId": category->categoryId,
      "categoryHero": category->heroImage,
      heroImage,
      heroImageAlt,
      layout
    }`,
  );

  const byCategorySlug = new Map<string, Treatment>();
  for (const treatment of treatments) {
    if (treatment.categoryId && treatment.slug) {
      byCategorySlug.set(`${treatment.categoryId}/${treatment.slug}`, treatment);
    }
  }

  const needsFlowAsset = treatments.some(
    (treatment) =>
      treatment.layout &&
      (treatment.layout.flow?.length || 0) > 0 &&
      !hasImage(treatment.layout.flowImage),
  );
  const flowImage = needsFlowAsset ? await sharedFlowImage() : undefined;
  let changed = 0;

  for (const treatment of treatments) {
    const patch: Record<string, unknown> = {};
    const treatmentHero = hasImage(treatment.heroImage)
      ? treatment.heroImage
      : treatment.categoryHero;

    if (!hasImage(treatment.heroImage) && hasImage(treatmentHero)) {
      patch.heroImage = treatmentHero;
    }
    if (!hasAlt(treatment.heroImageAlt) && treatment.title?.length) {
      patch.heroImageAlt = treatment.title;
    }

    if (treatment.layout) {
      const layout = structuredClone(treatment.layout);
      let layoutChanged = false;

      if (!hasImage(layout.heroImage) && hasImage(treatmentHero)) {
        layout.heroImage = treatmentHero;
        layoutChanged = true;
      }
      if (!hasAlt(layout.heroImageAlt) && treatment.title?.length) {
        layout.heroImageAlt = treatment.title;
        layoutChanged = true;
      }

      if ((layout.flow?.length || 0) > 0 && !hasImage(layout.flowImage)) {
        if (flowImage) layout.flowImage = flowImage;
        layoutChanged = true;
      }
      if ((layout.flow?.length || 0) > 0 && !hasAlt(layout.flowImageAlt)) {
        layout.flowImageAlt = fixedAlt(
          "Interiør fra CMedical-klinikken",
          "Interior at the CMedical clinic",
        );
        layoutChanged = true;
      }

      if (layout.related?.length) {
        layout.related = layout.related.map((card) => {
          const next = { ...card };
          const target = byCategorySlug.get(
            `${categoryFromPath(card.path)}/${slugFromPath(card.path)}`,
          );
          const relatedImage = hasImage(target?.heroImage)
            ? target?.heroImage
            : treatmentHero;
          if (!hasImage(next.image) && hasImage(relatedImage)) {
            next.image = relatedImage;
            layoutChanged = true;
          }
          if (!hasAlt(next.imageAlt) && next.title?.length) {
            next.imageAlt = next.title;
            layoutChanged = true;
          }
          return next;
        });
      }

      if (layout.expertAreas?.items?.length) {
        layout.expertAreas = {
          ...layout.expertAreas,
          items: layout.expertAreas.items.map((card) => {
            const next = { ...card };
            if (!hasImage(next.image) && hasImage(treatmentHero)) {
              next.image = treatmentHero;
              layoutChanged = true;
            }
            if (!hasAlt(next.imageAlt) && next.title?.length) {
              next.imageAlt = next.title;
              layoutChanged = true;
            }
            return next;
          }),
        };
      }

      if (layout.textSection) {
        layout.textSection = { ...layout.textSection };
        if (!hasImage(layout.textSection.image) && hasImage(treatmentHero)) {
          layout.textSection.image = treatmentHero;
          layoutChanged = true;
        }
        if (!hasAlt(layout.textSection.imageAlt) && treatment.title?.length) {
          layout.textSection.imageAlt = treatment.title;
          layoutChanged = true;
        }
      }

      if (layoutChanged) patch.layout = layout;
    }

    if (Object.keys(patch).length === 0) continue;
    changed++;
    console.log(`${DRY_RUN ? "DRY" : "PATCH"} ${treatment._id}: ${Object.keys(patch).join(", ")}`);
    if (!DRY_RUN) {
      await sanityClient.patch(treatment._id).set(patch).commit();
    }
  }

  console.log(`${DRY_RUN ? "Would update" : "Updated"} ${changed} treatment documents.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
