#!/usr/bin/env npx tsx
/**
 * Developer-only: set expertAreas "Andre ting vi hjelper med" for gynekologi
 * pages that use linkedServices (matches demo 2×2 card grid before promises).
 *
 *   cd test && npx tsx sanity/patch-gynekologi-expert-areas-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

type Card = {
  titleNo: string;
  titleEn: string;
  descNo: string;
  descEn: string;
  /** Public path without locale, e.g. /ovrige/osteopati */
  path: string;
  /** Sanity treatment slug to pull hero image from */
  imageSlug: string;
};

const EXPERT_BY_TREATMENT: Record<string, { cards: Card[] }> = {
  overgangsalder: {
    cards: [
      {
        titleNo: "Ernæringsfysiolog",
        titleEn: "Dietitian",
        descNo:
          "Kostholdsrådgivning tilpasset hormonelle endringer og overgangsalder.",
        descEn:
          "Nutrition advice tailored to hormonal changes and menopause.",
        path: "/ovrige/ernaeringsfysiolog",
        imageSlug: "ernaeringsfysiolog",
      },
      {
        titleNo: "Osteopat",
        titleEn: "Osteopath",
        descNo:
          "Manuell behandling for smerter i ledd og muskler knyttet til hormonelle endringer.",
        descEn:
          "Manual treatment for joint and muscle pain related to hormonal changes.",
        path: "/ovrige/osteopati",
        imageSlug: "osteopati",
      },
      {
        titleNo: "Sexolog",
        titleEn: "Sexologist",
        descNo:
          "Støtte og veiledning ved endringer i seksuell helse gjennom overgangsalderen.",
        descEn:
          "Support and guidance for changes in sexual health through menopause.",
        path: "/ovrige/sexologi",
        imageSlug: "sexologi",
      },
      {
        titleNo: "Psykolog",
        titleEn: "Psychologist",
        descNo:
          "Samtaleterapi for å håndtere emosjonelle utfordringer i overgangsalderen.",
        descEn:
          "Talk therapy for emotional challenges during menopause.",
        path: "/ovrige/psykologi",
        imageSlug: "psykologi",
      },
    ],
  },
  tverrfaglig: {
    cards: [
      {
        titleNo: "Osteopat",
        titleEn: "Osteopath",
        descNo:
          "Manuell behandlingsform som komplementerer medisinsk utredning og behandling innenfor vulvasmerter, bekkenbunnsdysfunksjon og muskelskjelettplager.",
        descEn:
          "Manual therapy that complements medical assessment and treatment for vulval pain, pelvic floor dysfunction and musculoskeletal issues.",
        path: "/ovrige/osteopati",
        imageSlug: "osteopati",
      },
      {
        titleNo: "Sexolog",
        titleEn: "Sexologist",
        descNo:
          "Terapeutiske samtaler for støtte, veiledning og råd knyttet til seksuell helse, funksjon, lyst, selvbilde og intimitet.",
        descEn:
          "Therapeutic conversations for support and guidance on sexual health, function, desire, self-image and intimacy.",
        path: "/ovrige/sexologi",
        imageSlug: "sexologi",
      },
      {
        titleNo: "Psykolog",
        titleEn: "Psychologist",
        descNo:
          "Samtalepartner for å sortere tanker og følelser, håndtere smerter, og motta støtte gjennom utfordrende behandlingsforløp.",
        descEn:
          "A conversation partner to sort thoughts and feelings, manage pain, and receive support through demanding treatment.",
        path: "/ovrige/psykologi",
        imageSlug: "psykologi",
      },
      {
        titleNo: "Ernæringsfysiolog",
        titleEn: "Dietitian",
        descNo:
          "Individuelt tilpasset kostholdsrådgivning med betydning for hormoner, fertilitet, overgangsalder og generell helse.",
        descEn:
          "Individually tailored nutrition advice relevant to hormones, fertility, menopause and general health.",
        path: "/ovrige/ernaeringsfysiolog",
        imageSlug: "ernaeringsfysiolog",
      },
    ],
  },
};

function i18nString(no: string, en: string) {
  return [
    { _type: "internationalizedArrayStringValue", _key: "no", language: "no", value: no },
    { _type: "internationalizedArrayStringValue", _key: "en", language: "en", value: en },
  ];
}

function i18nText(no: string, en: string) {
  return [
    { _type: "internationalizedArrayTextValue", _key: "no", language: "no", value: no },
    { _type: "internationalizedArrayTextValue", _key: "en", language: "en", value: en },
  ];
}

function refKey(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  const imageDocs = await sanityClient.fetch<
    Array<{ slug: string; imageRef?: string; imageAlt?: string }>
  >(
    `*[
      _type=="treatment" &&
      slug[language=="no"][0].value.current in $slugs &&
      !(_id in path("drafts.**"))
    ]{
      "slug": slug[language=="no"][0].value.current,
      "imageRef": coalesce(heroImage.asset->_id, heroMedia.image.asset->_id),
      "imageAlt": coalesce(
        heroImageAlt[language=="no"][0].value,
        title[language=="no"][0].value
      )
    }`,
    {
      slugs: [
        "ernaeringsfysiolog",
        "osteopati",
        "sexologi",
        "psykologi",
      ],
    },
  );

  const imageBySlug = new Map(
    imageDocs.filter((d) => d.slug && d.imageRef).map((d) => [d.slug, d]),
  );

  const title = i18nString(
    "Andre ting vi hjelper med",
    "Other things we help with",
  );

  for (const [slug, cfg] of Object.entries(EXPERT_BY_TREATMENT)) {
    const docId = `treatment-gynekologi-${slug}`;
    const exists = await sanityClient.fetch<string | null>(
      `*[_id==$id][0]._id`,
      { id: docId },
    );
    if (!exists) {
      console.warn(`⚠ missing ${docId}`);
      continue;
    }

    const items = cfg.cards.map((card) => {
      const img = imageBySlug.get(card.imageSlug);
      const row: Record<string, unknown> = {
        _key: refKey(card.imageSlug),
        _type: "object",
        title: i18nString(card.titleNo, card.titleEn),
        desc: i18nText(card.descNo, card.descEn),
        path: card.path,
        imageAlt: i18nString(
          card.titleNo,
          card.titleEn,
        ),
      };
      if (img?.imageRef) {
        row.image = {
          _type: "image",
          asset: { _type: "reference", _ref: img.imageRef },
        };
      }
      return row;
    });

    await sanityClient
      .patch(docId)
      .set({
        expertAreas: {
          _type: "object",
          title,
          items,
        },
        expertReadMoreLabel: i18nString("Les mer", "Read more"),
      })
      .commit({ autoGenerateArrayKeys: true });

    // Do not touch relatedSection — demo keeps "Relaterte tjenester" carousel
    // separately (see patch-gynekologi-relaterte-tjenester-developer.ts).

    const draftId = `drafts.${docId}`;
    if (
      await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
        id: draftId,
      })
    ) {
      await sanityClient.delete(draftId);
    }

    console.log(`✓ ${slug}: expertAreas ${items.length} cards`);
  }

  const verify = await sanityClient.fetch(
    `*[_id=="treatment-gynekologi-overgangsalder"][0]{
      "expertTitle": expertAreas.title[language=="no"][0].value,
      "cards": expertAreas.items[]{
        "title": title[language=="no"][0].value,
        path,
        "hasImage": defined(image.asset)
      },
      "relatedCount": count(relatedSection.items)
    }`,
  );
  console.log(JSON.stringify({ dataset: DATASET, verify }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
