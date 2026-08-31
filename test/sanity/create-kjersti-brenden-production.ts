#!/usr/bin/env npx tsx
/**
 * Production: create published specialist Kjersti Brenden.
 *
 * Source: Aina/CMedical specialist brief (old site + avenewdemo, identical bio).
 *
 *   cd test
 *   ALLOW_PRODUCTION_MIGRATION=true \
 *   SANITY_DATASET=production \
 *   SANITY_STUDIO_DATASET=production \
 *   NEXT_PUBLIC_SANITY_DATASET=production \
 *   npx tsx sanity/create-kjersti-brenden-production.ts
 *
 *   DRY_RUN=1 … (same env) to inspect without writing
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DATASET, PROJECT_ID, sanityClient } from "./config";
import { i18nString, i18nText } from "./lib/category-landing-i18n";
import { bioToPortableText, parseBioParagraphs } from "./lib/specialist-bio-i18n";

const DRY_RUN = process.env.DRY_RUN === "1";
const DOC_ID = "specialist-kjersti-brenden";
const SLUG = "kjersti-brenden";
const PHOTO_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../src/assets/specialists/kjersti-brenden.jpg",
);

const BIO_NO = `Kjersti Brenden er utdannet ved det medisinske fakultet i Oslo og fullførte i 1999.

Hun er spesialist i gynekologi og obstetrikk og har over 20 års erfaring som gynekolog. Hun har tidligere jobbet ved kvinneklinikken i Vestre Viken, Drammen, men har helt siden 2012 vært en del av fertilitetsteamet ved Livio - Norges eldste fertilitetsklinikk. Livio ble i 2025 en del av CMedical.

I tillegg til bred erfaring i generell gynekologi har hun en spisskompetanse innen fertilitetsbehandling. Siden lovverksendringene i 2021 har hun også vært mye engasjert i spesielt eggdonasjonsbehandling som da ble tillatt i Norge.

Hun har sittet i styret i NOFAB (Norsk Forening for Assistert Befruktning) i perioden 2017-2019. Kjersti er opptatt av å sette pasientene i fokus, og gi medisinsk faglig oppdatert informasjon i tillegg til varme, omsorg og trygghet.`;

const BIO_EN = `Kjersti Brenden graduated from the Faculty of Medicine in Oslo in 1999.

She is a specialist in gynaecology and obstetrics and has more than 20 years of experience as a gynaecologist. She previously worked at the women’s clinic in Vestre Viken, Drammen, but has been part of the fertility team at Livio — Norway’s oldest fertility clinic — since 2012. Livio became part of CMedical in 2025.

In addition to broad experience in general gynaecology, she has specialist expertise in fertility treatment. Since the legislative changes in 2021 she has also been particularly involved in egg donation treatment, which then became permitted in Norway.

She served on the board of NOFAB (the Norwegian Society for Assisted Reproduction) from 2017 to 2019. Kjersti is committed to putting patients first and providing medically up-to-date information together with warmth, care and reassurance.`;

const SHORT_NO =
  "Kjersti Brenden er utdannet ved det medisinske fakultet i Oslo og fullførte i 1999.";
const SHORT_EN =
  "Kjersti Brenden graduated from the Faculty of Medicine in Oslo in 1999.";

function i18nSlug(slug: string) {
  return [
    {
      _type: "internationalizedArraySlugValue",
      _key: "no",
      language: "no",
      value: { _type: "slug", current: slug },
    },
    {
      _type: "internationalizedArraySlugValue",
      _key: "en",
      language: "en",
      value: { _type: "slug", current: slug },
    },
  ];
}

function i18nBio(no: string, en: string) {
  return [
    {
      _type: "internationalizedArrayBlockContentValue",
      _key: "no",
      language: "no",
      value: bioToPortableText(parseBioParagraphs(no)),
    },
    {
      _type: "internationalizedArrayBlockContentValue",
      _key: "en",
      language: "en",
      value: bioToPortableText(parseBioParagraphs(en)),
    },
  ];
}

function specialty(no: string, en: string) {
  return {
    _type: "specialtyItem" as const,
    _key: `spec-${no
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}`,
    label: i18nString(no, en),
  };
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "production") {
    throw new Error(
      `Refusing: this script targets production, current dataset is "${DATASET}".`,
    );
  }

  console.log(`Kjersti Brenden → ${PROJECT_ID}/${DATASET} dryRun=${DRY_RUN}`);

  const existing = await sanityClient.fetch<{
    _id?: string;
    name?: string;
  } | null>(
    `*[_id in [$id, $draftId] || slug[_key=="no"][0].value.current == $slug || slug[language=="no"][0].value.current == $slug][0]{ _id, name }`,
    { id: DOC_ID, draftId: `drafts.${DOC_ID}`, slug: SLUG },
  );

  if (existing?._id && process.env.FORCE !== "1") {
    throw new Error(
      `Already exists as ${existing._id} (${existing.name || "unnamed"}). Re-run with FORCE=1 to replace.`,
    );
  }

  const [categoryId, clinicId, faqCollectionId, peers, template] =
    await Promise.all([
      sanityClient.fetch<string | null>(
        `*[_type=="treatmentCategory" && categoryId=="fertilitet" && !(_id in path("drafts.**"))][0]._id`,
      ),
      sanityClient.fetch<string | null>(
        `*[_type=="clinicPage" && !(_id in path("drafts.**")) && (
          slug[_key=="no"][0].value.current=="majorstuen" ||
          slug[language=="no"][0].value.current=="majorstuen" ||
          slug.current=="majorstuen"
        )][0]._id`,
      ),
      sanityClient.fetch<string | null>(
        `*[_id=="faqCollection-spesialist-generell"][0]._id`,
      ),
      sanityClient.fetch<Array<{ _id: string; name?: string }>>(
        `*[_type=="specialist" && !(_id in path("drafts.**")) && _id != $id && count(categories[@->categoryId=="fertilitet"])>0] | order(coalesce(sortOrder, 999) asc, name asc)[0...4]{ _id, name }`,
        { id: DOC_ID },
      ),
      sanityClient.fetch<{
        relatedSpecialistsSection?: Record<string, unknown>;
        faqSectionTitle?: unknown;
        sortOrder?: number;
      } | null>(
        `*[_id=="specialist-jackson-tok"][0]{ relatedSpecialistsSection, faqSectionTitle, sortOrder }`,
      ),
    ]);

  if (!categoryId) throw new Error("Missing fertilitet treatmentCategory");
  if (!clinicId) throw new Error("Missing Majorstuen clinicPage");
  if (!peers.length) throw new Error("No fertility peers for related specialists");

  console.log("  category:", categoryId);
  console.log("  clinic:", clinicId);
  console.log("  faqCollection:", faqCollectionId || "(none)");
  console.log(
    "  related:",
    peers.map((p) => `${p.name} (${p._id})`).join(", "),
  );

  if (!fs.existsSync(PHOTO_PATH)) {
    throw new Error(`Photo missing: ${PHOTO_PATH}`);
  }

  let photo: { _type: "image"; asset: { _type: "reference"; _ref: string } } | null =
    null;
  if (!DRY_RUN) {
    const buffer = fs.readFileSync(PHOTO_PATH);
    const asset = await sanityClient.assets.upload("image", buffer, {
      filename: "kjersti-brenden.jpg",
      contentType: "image/jpeg",
    });
    photo = {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
    };
    console.log("  photo:", asset._id);
  } else {
    console.log("  [dry-run] would upload kjersti-brenden.jpg");
  }

  const relatedFromTemplate = template?.relatedSpecialistsSection || {};
  const doc: Record<string, unknown> = {
    _id: DOC_ID,
    _type: "specialist",
    name: "Kjersti Brenden",
    slug: i18nSlug(SLUG),
    role: i18nString("Fertilitetslege", "Fertility doctor"),
    subtitle: i18nString("Gynekolog", "Gynaecologist"),
    specialties: [
      specialty("Fertilitet", "Fertility"),
      specialty("IVF", "IVF"),
      specialty("Gynekologi", "Gynaecology"),
      specialty("Eggdonasjon", "Egg donation"),
    ],
    categories: [
      { _type: "reference", _ref: categoryId, _key: "cat-fertilitet" },
    ],
    clinics: [
      { _type: "reference", _ref: clinicId, _key: "clinic-majorstuen" },
    ],
    showBookingButton: true,
    showCallButton: true,
    shortBio: i18nText(SHORT_NO, SHORT_EN),
    bio: i18nBio(BIO_NO, BIO_EN),
    education: [
      {
        _type: "educationItem",
        _key: "edu-0",
        label: i18nString(
          "Det medisinske fakultet, Universitetet i Oslo (fullført 1999)",
          "Faculty of Medicine, University of Oslo (completed 1999)",
        ),
      },
    ],
    languages: ["Norsk", "Engelsk"],
    relatedSpecialistsSection: {
      _type: "object",
      eyebrow:
        relatedFromTemplate.eyebrow ||
        i18nString("Samme fagområde", "Same specialty area"),
      heading:
        relatedFromTemplate.heading ||
        i18nString("Andre spesialister", "Other specialists"),
      ctaLabel: relatedFromTemplate.ctaLabel || i18nString("Se alle", "See all"),
      ctaPath:
        typeof relatedFromTemplate.ctaPath === "string"
          ? relatedFromTemplate.ctaPath
          : "/spesialister",
      specialists: peers.map((p) => ({
        _type: "reference",
        _ref: p._id,
        _key: p._id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 16),
      })),
    },
    faqSectionTitle:
      template?.faqSectionTitle ||
      i18nString("Ofte stilte spørsmål", "Frequently asked questions"),
    ...(faqCollectionId
      ? {
          faqCollection: {
            _type: "reference",
            _ref: faqCollectionId,
          },
        }
      : {}),
    seo: {
      _type: "seo",
      metaTitle: i18nString(
        "Kjersti Brenden | CMedical",
        "Kjersti Brenden | CMedical",
      ),
      metaDescription: i18nText(
        "Kjersti Brenden er fertilitetslege og gynekolog ved CMedical Majorstuen. Spesialist i gynekologi, IVF og eggdonasjon. Ingen henvisning nødvendig.",
        "Kjersti Brenden is a fertility doctor and gynaecologist at CMedical Majorstuen. Specialist in gynaecology, IVF and egg donation. No referral needed.",
      ),
    },
    geoSummary: i18nText(
      "Kjersti Brenden er fertilitetslege og gynekolog ved CMedical Majorstuen. Hun har over 20 års erfaring og spisskompetanse innen fertilitetsbehandling og eggdonasjon. Du kan bestille time uten henvisning.",
      "Kjersti Brenden is a fertility doctor and gynaecologist at CMedical Majorstuen. She has more than 20 years of experience and specialist expertise in fertility treatment and egg donation. You can book without a referral.",
    ),
    bookingEnabled: true,
    bookingCategoryIds: [1],
    ...(photo
      ? {
          photo,
          heroMedia: {
            _type: "media",
            mediaType: "image",
            image: photo,
          },
        }
      : {}),
  };

  if (DRY_RUN) {
    console.log("\n[dry-run] would createOrReplace", DOC_ID);
    console.log(JSON.stringify({ name: doc.name, slug: doc.slug, role: doc.role }, null, 2));
    return;
  }

  await sanityClient.createOrReplace(doc);
  const verify = await sanityClient.fetch<{
    _id: string;
    name: string;
    "slugNo": string;
    "hasPhoto": boolean;
    "bioBlocks": number;
  }>(
    `*[_id==$id][0]{
      _id, name,
      "slugNo": coalesce(slug[_key=="no"][0].value.current, slug[language=="no"][0].value.current),
      "hasPhoto": defined(photo.asset) || defined(heroMedia.image.asset),
      "bioBlocks": count(bio[_key=="no"][0].value)
    }`,
    { id: DOC_ID },
  );
  console.log("\n✓ Published", verify);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
