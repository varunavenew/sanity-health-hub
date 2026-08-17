#!/usr/bin/env npx tsx
/**
 * Developer-only: fix gynekologi "Om …" sections to match demo.
 *
 * - ALL pages: accordion layout (collapsed Om points — matches demo)
 * - Restore missing reasonsLead + full reason bodies from reference dump
 *
 * Prefer: patch-gynekologi-om-dump-developer.ts (full dump sync)
 *
 *   cd test && npx tsx sanity/patch-gynekologi-om-sections-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";
import { GYN_PAGE_CONTENT } from "./data/gynekologi-page-content";
import { GYN_OM_SECTIONS } from "./data/gynekologi-om-dump";

function i18nString(no: string, en: string) {
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
      value: en,
    },
  ];
}

function i18nText(no: string, en: string) {
  return [
    {
      _type: "internationalizedArrayTextValue",
      _key: "no",
      language: "no",
      value: no,
    },
    {
      _type: "internationalizedArrayTextValue",
      _key: "en",
      language: "en",
      value: en,
    },
  ];
}

/** Demo-visible lead under Om title (screenshot / dump). */
const LEAD_OVERRIDES: Record<string, { no: string; en: string }> = {
  blodningsforstyrrelser: {
    no: "Blødningsforstyrrelser må utredes for å utelukke underliggende sykdom. Ofte kan det være naturlige forklaringer som enkelt kan behandles.",
    en: "Abnormal bleeding must be investigated to rule out underlying disease. There are often natural explanations that can be treated simply.",
  },
};

/** Accordion only where demo uses long collapsible sections. */
const ACCORDION_SLUGS = new Set(["overgangsalder"]);

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  const docs = await sanityClient.fetch<
    Array<{ _id: string; slug?: string }>
  >(
    `*[
      _type=="treatment" &&
      (
        references(*[_type=="treatmentCategory" && categoryId=="gynekologi"][0]._id) ||
        references(*[_type=="treatmentCategory" && categoryId=="graviditet"][0]._id)
      ) &&
      !(_id in path("drafts.**"))
    ]{
      _id,
      "slug": coalesce(
        slug[language=="no"][0].value.current,
        slug[_key=="no"][0].value.current,
        slug.current
      )
    }`,
  );

  let patched = 0;

  for (const doc of docs) {
    const slug = doc.slug;
    if (!slug || slug === "new-treatment") continue;

    const content = GYN_PAGE_CONTENT[slug];
    const layout = ACCORDION_SLUGS.has(slug)
      ? "accordion"
      : content?.reasonsLayout || "prose";

    if (!content) {
      await sanityClient.patch(doc._id).set({ reasonsLayout: layout }).commit();
      console.log(`~ ${slug}: layout=${layout}`);
      patched += 1;
      continue;
    }

    const leadOverride = LEAD_OVERRIDES[slug];
    // Never leave Om title without a lead: fall back to first hero paragraph.
    // (Previous unset-when-empty wiped description on pages that only had hero copy.)
    const leadNo =
      leadOverride?.no ||
      content.reasonsLeadNo?.trim() ||
      content.heroLeadNo.trim().split(/\n\n+/)[0]?.trim() ||
      "";
    const leadEn =
      leadOverride?.en ||
      content.reasonsLeadEn?.trim() ||
      content.heroLeadEn.trim().split(/\n\n+/)[0]?.trim() ||
      "";

    let reasons = (content.reasons || []).map((r, i) => ({
      _key: `reason-${i}-${slug}`,
      _type: "object",
      n: i18nString(String(i + 1).padStart(2, "0"), String(i + 1).padStart(2, "0")),
      title: i18nString(r.titleNo, r.titleEn),
      desc: i18nText(r.descNo, r.descEn),
    }));

    if (slug === "blodningsforstyrrelser") {
      reasons = [
        {
          _key: "reason-0-blod",
          _type: "object",
          n: i18nString("01", "01"),
          title: i18nString("Vanlige årsaker", "Common causes"),
          desc: i18nText(
            "Vanlige årsaker til blødningsforstyrrelser kan være overgangsalder, seksuelt overførbare infeksjoner, polypper eller muskelknuter, graviditet eller hormonelle ubalanser.\n\nBlødningsforstyrrelser som kommer etter overgangsalderen skal alltid utredes. Det gjøres gjerne med ultralyd og en vevsprøve fra livmorhulen. Videre oppfølging og behandling avhenger av dette prøvesvaret.",
            "Common causes of abnormal bleeding include menopause, sexually transmitted infections, polyps or fibroids, pregnancy, or hormonal imbalances.\n\nBleeding that starts after menopause must always be investigated. This is usually done with ultrasound and a tissue sample from the uterine lining. Further follow-up and treatment depend on the result.",
          ),
        },
        {
          _key: "reason-1-blod",
          _type: "object",
          n: i18nString("02", "02"),
          title: i18nString("Prevensjon", "Contraception"),
          desc: i18nText(
            "Dersom du bruker prevensjon kan du få uregelmessige blødninger. Det kan ofte løses ved å bytte prevensjonsmiddel.",
            "If you use contraception, you may get irregular bleeding. Changing contraceptive method will often resolve it.",
          ),
        },
      ];
    }

    const patch: Record<string, unknown> = {
      reasonsLayout: layout,
      reasonsTitle: i18nString(content.reasonsTitleNo, content.reasonsTitleEn),
      reasons,
    };

    const op = sanityClient.patch(doc._id).set(patch);
    if (leadNo && leadEn) {
      op.set({ reasonsLead: i18nText(leadNo, leadEn) });
    }
    await op.commit({ autoGenerateArrayKeys: false });

    const draftId = `drafts.${doc._id}`;
    if (
      await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
        id: draftId,
      })
    ) {
      await sanityClient.delete(draftId);
    }

    patched += 1;
    console.log(
      `✓ ${slug}: layout=${layout} reasons=${reasons.length} lead=${Boolean(leadNo)}`,
    );
  }

  const verify = await sanityClient.fetch(
    `*[_id=="treatment-gynekologi-blodningsforstyrrelser"][0]{
      reasonsLayout,
      "lead": reasonsLead[language=="no"][0].value,
      "reasons": reasons[]{
        "title": title[language=="no"][0].value,
        "desc": desc[language=="no"][0].value
      }
    }`,
  );

  console.log(JSON.stringify({ dataset: DATASET, patched, verify }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
