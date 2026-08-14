#!/usr/bin/env npx tsx
/**
 * Developer-only: Fertility treatment pages parity vs avenewdemo
 * `/behandlinger/fertilitet/{slug}` (no `/no` prefix on reference).
 *
 * Shared patterns (same as infertilitet parity):
 * - Clear FAQ (+ faqCollection) so FAQ band hides
 * - Remove insurance pageSection so insurance band hides
 * - Kristian Ophaug specialist (manual)
 * - Related services order (no IVF; include assistert-par-og-single)
 * - Promise titles/desc + mid CTA + primary CTA + hideSeePriser
 * - Specialist band title "Spesialister som utfører dette"
 * - Discard stale drafts that override published with token-bearing client
 *
 * Page-specific:
 * - hysteroskopi titles/hero
 * - eggfrys / donor hero copy trim to reference
 *
 * IVF is handled via slug alias → assistert-befruktning (frontend).
 * Teamet is pageRole:"team" → specialists listing redirect (frontend).
 *
 *   cd test && npx tsx sanity/patch-fertility-treatments-parity-developer.ts
 */
import { randomBytes } from "crypto";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const SPECIALIST_ID = "specialist-kristian-ophaug";

const RELATED_POOL = {
  infertilitet: "treatment-fertilitet-infertilitet",
  assistert: "treatment-fertilitet-assistert-befruktning",
  eggfrys: "treatment-fertilitet-eggfrys",
  donor: "treatment-fertilitet-donorbehandling",
  hysteroskopi: "treatment-fertilitet-hysteroskopi",
  saedanalyse: "treatment-fertilitet-saedanalyse",
  parOgSingle: "treatment-fertilitet-assistert-befruktning-for-par-og-single",
} as const;

type PageConfig = {
  id: string;
  titleNo: string;
  related: (keyof typeof RELATED_POOL)[];
  heroTitleNo?: string;
  reasonsTitleNo?: string;
  descriptionNo?: string;
  officeHysteroskopiDescNo?: string;
};

const PAGES: PageConfig[] = [
  {
    id: "treatment-fertilitet-assistert-befruktning",
    titleNo: "Assistert befruktning",
    related: [
      "infertilitet",
      "eggfrys",
      "donor",
      "hysteroskopi",
      "saedanalyse",
      "parOgSingle",
    ],
  },
  {
    id: "treatment-fertilitet-donorbehandling",
    titleNo: "Donorbehandling",
    related: [
      "infertilitet",
      "assistert",
      "eggfrys",
      "hysteroskopi",
      "saedanalyse",
      "parOgSingle",
    ],
    // Reference hero stops after the bioteknologiloven sentence; accordion covers the rest.
    descriptionNo:
      "Behandling med donorsæd eller donerte egg kan være aktuelt for mange. I Norge er det ikke tillatt med samtidig donasjon av egg og sæd (såkalt dobbeldonasjon) og single kvinner i Norge får derfor ikke tilbud om eggdonasjon i henhold til bioteknologiloven.",
  },
  {
    id: "treatment-fertilitet-eggfrys",
    titleNo: "Eggfrys",
    related: [
      "infertilitet",
      "assistert",
      "donor",
      "hysteroskopi",
      "saedanalyse",
      "parOgSingle",
    ],
    descriptionNo:
      "Om du ønsker å vente med en eventuell graviditet, vil kanskje det å fryse ned egg være riktig for deg. På denne måten kan fremtidige deg, selv om fruktbarheten er redusert eller borte, kunne bli gravid. Ved nedfrysning av egg henter vi ut flere modne egg som legges på frys ubefruktet.",
  },
  {
    id: "treatment-fertilitet-hysteroskopi",
    titleNo: "Hysteroskopi",
    related: [
      "infertilitet",
      "assistert",
      "eggfrys",
      "donor",
      "saedanalyse",
      "parOgSingle",
    ],
    heroTitleNo: "Hysteroskopi",
    reasonsTitleNo: "Om hysteroskopi",
    descriptionNo:
      "Hysteroskopi er en skånsom gynekologisk undersøkelse der vi bruker et tynt instrument med kamera for å se inn i livmorhulen gjennom livmorhalsen. Undersøkelsen gir en grundig oversikt og gjør det mulig å oppdage årsaker til plager som ellers kan være vanskelig å finne.",
    officeHysteroskopiDescNo:
      "Vi tilbyr også office-hysteroskopi som kan gjennomføres uten narkose eller bedøvelse, og umiddelbart ved besøk hos gynekolog.",
  },
  {
    id: "treatment-fertilitet-saedanalyse",
    titleNo: "Sædanalyse",
    related: [
      "infertilitet",
      "assistert",
      "eggfrys",
      "donor",
      "hysteroskopi",
      "parOgSingle",
    ],
  },
];

const PROMISES = [
  {
    titleNo: "Tilpasset dine behov",
    titleEn: "Tailored to your needs",
    descNo:
      "Alle undersøkelser og inngrep tilpasses dine behov og ønsker. Du kan stoppe når som helst, stille spørsmål underveis, og ta med noen om du ønsker det.",
    descEn:
      "All examinations and procedures are tailored to your needs and wishes. You can stop at any time, ask questions along the way, and bring someone if you want.",
  },
  {
    titleNo: "Erfarne spesialister",
    titleEn: "Experienced specialists",
    descNo:
      "Hos oss møter du leger som har spesialisert seg innenfor sitt fagfelt — ikke en generalist på utplassering. Du får riktig kompetanse fra første konsultasjon.",
    descEn:
      "With us you meet doctors who have specialised in their field — not a generalist on rotation. You get the right expertise from the first consultation.",
  },
  {
    titleNo: "Alt under samme tak",
    titleEn: "Everything under one roof",
    descNo:
      "Trenger du videre utredning, behandling eller oppfølging — vi koordinerer hele forløpet for deg.",
    descEn:
      "If you need further investigation, treatment or follow-up — we coordinate the entire pathway for you.",
  },
] as const;

function refKey(): string {
  return randomBytes(6).toString("hex");
}

function refs(ids: readonly string[]) {
  return ids.map((id) => ({
    _type: "reference" as const,
    _ref: id,
    _key: refKey(),
  }));
}

function i18nString(no: string, en: string) {
  return [
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
}

function i18nText(no: string, en: string) {
  return [
    {
      _key: "no",
      _type: "internationalizedArrayTextValue",
      language: "no",
      value: no,
    },
    {
      _key: "en",
      _type: "internationalizedArrayTextValue",
      language: "en",
      value: en,
    },
  ];
}

async function ensureI18nString(
  docId: string,
  field: string,
  language: "no" | "en",
  value: string,
) {
  const current = await sanityClient.fetch<
    Array<{ _key?: string; language?: string; value?: string }> | null
  >(`*[_id == $id][0].${field}`, { id: docId });

  if (!Array.isArray(current) || current.length === 0) {
    await sanityClient
      .patch(docId)
      .set({
        [field]: [
          {
            _key: language,
            _type: "internationalizedArrayStringValue",
            language,
            value,
          },
        ],
      })
      .commit({ autoGenerateArrayKeys: true });
    return;
  }

  const byLang = current.find((row) => row.language === language || row._key === language);
  if (byLang?._key) {
    await sanityClient
      .patch(docId)
      .set({ [`${field}[_key=="${byLang._key}"].value`]: value })
      .commit();
    return;
  }

  await sanityClient
    .patch(docId)
    .insert("after", `${field}[-1]`, [
      {
        _key: language,
        _type: "internationalizedArrayStringValue",
        language,
        value,
      },
    ])
    .commit({ autoGenerateArrayKeys: true });
}

async function ensureI18nText(
  docId: string,
  field: string,
  language: "no" | "en",
  value: string,
) {
  const current = await sanityClient.fetch<
    Array<{ _key?: string; language?: string; value?: string }> | null
  >(`*[_id == $id][0].${field}`, { id: docId });

  if (!Array.isArray(current) || current.length === 0) {
    await sanityClient
      .patch(docId)
      .set({
        [field]: [
          {
            _key: language,
            _type: "internationalizedArrayTextValue",
            language,
            value,
          },
        ],
      })
      .commit({ autoGenerateArrayKeys: true });
    return;
  }

  const byLang = current.find((row) => row.language === language || row._key === language);
  if (byLang?._key) {
    await sanityClient
      .patch(docId)
      .set({ [`${field}[_key=="${byLang._key}"].value`]: value })
      .commit();
    return;
  }

  await sanityClient
    .patch(docId)
    .insert("after", `${field}[-1]`, [
      {
        _key: language,
        _type: "internationalizedArrayTextValue",
        language,
        value,
      },
    ])
    .commit({ autoGenerateArrayKeys: true });
}

async function patchPromises(docId: string) {
  const promises = await sanityClient.fetch<
    Array<{
      _key?: string;
      title?: Array<{ _key?: string; language?: string; value?: string }>;
      desc?: Array<{ _key?: string; language?: string; value?: string }>;
    }>
  >(`*[_id==$id][0].promises[]{_key, title, desc}`, { id: docId });

  if (!Array.isArray(promises) || promises.length === 0) {
    console.warn(`  No promises on ${docId}`);
    return;
  }

  for (let i = 0; i < Math.min(promises.length, PROMISES.length); i++) {
    const row = promises[i];
    const target = PROMISES[i];
    if (!row?._key) continue;

    await sanityClient
      .patch(docId)
      .set({
        [`promises[_key=="${row._key}"].title`]: i18nString(target.titleNo, target.titleEn),
        [`promises[_key=="${row._key}"].desc`]: i18nText(target.descNo, target.descEn),
      })
      .commit();
  }
}

async function patchPage(page: PageConfig) {
  console.log(`\n→ ${page.id}`);

  const exists = await sanityClient.fetch<string | null>(
    `*[_id==$id && !(_id in path("drafts.**"))][0]._id`,
    { id: page.id },
  );
  if (!exists) throw new Error(`Missing published treatment: ${page.id}`);

  const pageSections = await sanityClient.fetch<
    Array<Record<string, unknown> & { _type?: string; _key?: string }>
  >(`*[_id==$id][0].pageSections[]`, { id: page.id });

  if (!Array.isArray(pageSections)) {
    throw new Error(`pageSections missing on ${page.id}`);
  }

  const nextSections = pageSections
    .filter((section) => section._type !== "pageSectionInsurance")
    .map((section) => {
      if (section._type !== "pageSectionSpecialists") return section;
      return {
        ...section,
        displayMode: "manual",
        variant: section.variant || "carousel",
        title: i18nString(
          "Spesialister som utfører dette",
          "Specialists who perform this",
        ),
        specialists: refs([SPECIALIST_ID]),
        seeAllHref: "/spesialister?kategori=fertilitet",
        seeAllLabel: i18nString(
          "Se alle fertilitetsspesialister",
          "See all fertility specialists",
        ),
      };
    });

  const relatedIds = page.related.map((key) => RELATED_POOL[key]);

  await sanityClient
    .patch(page.id)
    .unset(["faqs", "faqCollection", "faqSectionTitle", "insurancePartners"])
    .set({
      pageSections: nextSections,
      hideSeePriser: true,
      "relatedSection.items": refs(relatedIds),
      srOnlyTitle: i18nString(`${page.titleNo} hos CMedical`, `${page.titleNo} at CMedical`),
    })
    .commit({ autoGenerateArrayKeys: true });

  await ensureI18nString(page.id, "primaryCtaLabel", "no", "Se ledige tider og book");
  await ensureI18nString(page.id, "primaryCtaLabel", "en", "See available times and book");
  await ensureI18nString(
    page.id,
    "conversationCtaTitle",
    "no",
    "Snakk med en av våre fertilitetsspesialister",
  );
  await ensureI18nString(
    page.id,
    "conversationCtaTitle",
    "en",
    "Talk to one of our fertility specialists",
  );

  if (page.heroTitleNo) {
    await ensureI18nString(page.id, "heroTitle", "no", page.heroTitleNo);
    await ensureI18nString(page.id, "heroTitle", "en", page.heroTitleNo);
  }
  if (page.reasonsTitleNo) {
    await ensureI18nString(page.id, "reasonsTitle", "no", page.reasonsTitleNo);
    await ensureI18nString(page.id, "reasonsTitle", "en", page.reasonsTitleNo);
  }
  if (page.descriptionNo) {
    await ensureI18nText(page.id, "description", "no", page.descriptionNo);
  }

  if (page.officeHysteroskopiDescNo) {
    const reasons = await sanityClient.fetch<
      Array<{ _key?: string; title?: Array<{ language?: string; value?: string }> }>
    >(`*[_id==$id][0].reasons[]{_key, title}`, { id: page.id });
    const office = reasons?.find((r) =>
      (r.title || []).some((t) => /office-hysteroskopi/i.test(t.value || "")),
    );
    if (office?._key) {
      await sanityClient
        .patch(page.id)
        .set({
          [`reasons[_key=="${office._key}"].desc`]: i18nText(
            page.officeHysteroskopiDescNo,
            "We also offer office hysteroscopy that can be performed without anaesthesia or sedation, immediately during a visit to the gynaecologist.",
          ),
        })
        .commit();
    }
  }

  await patchPromises(page.id);

  // Discard draft so token-bearing queries cannot prefer stale draft content.
  const draftId = `drafts.${page.id}`;
  const draftExists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
    id: draftId,
  });
  if (draftExists) {
    await sanityClient.delete(draftId);
    console.log(`  deleted ${draftId}`);
  }

  const verify = await sanityClient.fetch(
    `*[_id==$id][0]{
      "faqColl": faqCollection._ref,
      "hasIns": count(pageSections[_type=="pageSectionInsurance"]),
      "specTitle": pageSections[_type=="pageSectionSpecialists"][0].title[language=="no"][0].value,
      "specIds": pageSections[_type=="pageSectionSpecialists"][0].specialists[]._ref,
      "related": relatedSection.items[]->title[language=="no"][0].value,
      "primaryCta": primaryCtaLabel[language=="no"][0].value,
      "conversation": conversationCtaTitle[language=="no"][0].value,
      "promise0": promises[0].title[language=="no"][0].value,
      "promise1": promises[1].title[language=="no"][0].value,
      "hideSeePriser": hideSeePriser,
      "heroTitle": heroTitle[language=="no"][0].value,
      "reasonsTitle": reasonsTitle[language=="no"][0].value,
      "srOnly": srOnlyTitle[language=="no"][0].value
    }`,
    { id: page.id },
  );
  console.log("  verify", JSON.stringify(verify));
}

async function ensureTeamPageRole() {
  const id = "treatment-fertilitet-teamet";
  const exists = await sanityClient.fetch<string | null>(
    `*[_id==$id && !(_id in path("drafts.**"))][0]._id`,
    { id },
  );
  if (!exists) {
    console.warn("teamet missing — skip");
    return;
  }
  await sanityClient.patch(id).set({ pageRole: "team" }).commit();
  const draftId = `drafts.${id}`;
  const draftExists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
    id: draftId,
  });
  if (draftExists) await sanityClient.delete(draftId);
  console.log("\n→ teamet pageRole=team (redirect via frontend)");
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  const specialist = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
    id: SPECIALIST_ID,
  });
  if (!specialist) throw new Error(`Missing specialist: ${SPECIALIST_ID}`);

  for (const id of Object.values(RELATED_POOL)) {
    const exists = await sanityClient.fetch<string | null>(
      `*[_id==$id && !(_id in path("drafts.**"))][0]._id`,
      { id },
    );
    if (!exists) throw new Error(`Missing published related treatment: ${id}`);
  }

  for (const page of PAGES) {
    await patchPage(page);
  }
  await ensureTeamPageRole();

  // Also discard IVF drafts (content served via alias to assistert).
  const ivfDraft = "drafts.treatment-fertilitet-ivf";
  if (await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, { id: ivfDraft })) {
    await sanityClient.delete(ivfDraft);
    console.log(`\n→ deleted ${ivfDraft}`);
  }

  console.log("\n✓ Fertility treatment parity patched on developer");
  console.log(JSON.stringify({ dataset: DATASET, pages: PAGES.map((p) => p.id) }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
