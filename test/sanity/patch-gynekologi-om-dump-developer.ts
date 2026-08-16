#!/usr/bin/env npx tsx
/**
 * Developer-only: sync ALL gynekologi «Om» sections from dump + force accordion.
 *
 *   cd test && npx tsx sanity/patch-gynekologi-om-dump-developer.ts
 */
import { GYN_OM_SECTIONS } from "./data/gynekologi-om-dump";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";

const DOC_BY_SLUG: Record<string, string> = {
  undersokelse: "treatment-gynekologi-undersokelse",
  hysteroskopi: "treatment-gynekologi-hysteroskopi",
  endometriose: "treatment-gynekologi-endometriose",
  adenomyose: "treatment-gynekologi-adenomyose",
  // Canonical PMOS only (duplicate treatment-gynekologi-pcos removed).
  pmos: "treatment-gynekologi-pmos",
  poi: "treatment-gynekologi-poi",
  "pms-pmdd": "treatment-gynekologi-pms-og-pmdd",
  blodningsforstyrrelser: "treatment-gynekologi-blodningsforstyrrelser",
  cyster: "treatment-gynekologi-cyster",
  celleforandringer: "treatment-gynekologi-celleforandringer",
  vulvalidelser: "treatment-gynekologi-vulvalidelser",
  vaginisme: "treatment-gynekologi-vaginisme",
  urinlekkasje: "treatment-gynekologi-urinlekkasje",
  urogynekologi: "treatment-gynekologi-urogynekologi",
  "vaginale-fremfall": "treatment-gynekologi-vaginale-fremfall",
  overgangsalder: "treatment-gynekologi-overgangsalder",
  kirurgi: "treatment-gynekologi-kirurgi",
  robotkirurgi: "treatment-gynekologi-robotkirurgi",
  "fjerne-livmor": "treatment-gynekologi-fjerne-livmor",
  labiaplastikk: "treatment-gynekologi-labiaplastikk",
  tverrfaglig: "treatment-gynekologi-tverrfaglig",
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

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") throw new Error(`Refusing: project ${PROJECT_ID}`);
  if (DATASET !== "developer") throw new Error(`Refusing: dataset ${DATASET}`);

  let updated = 0;
  for (const [slug, om] of Object.entries(GYN_OM_SECTIONS)) {
    const id = DOC_BY_SLUG[slug];
    if (!id) {
      console.warn("no doc id for", slug);
      continue;
    }
    const exists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, { id });
    if (!exists) {
      console.warn("missing doc", id);
      continue;
    }

    const reasons = om.reasons.map((r, i) => ({
      _key: `om-${slug}-${i}`,
      _type: "object",
      n: i18nString(String(i + 1).padStart(2, "0"), String(i + 1).padStart(2, "0")),
      title: i18nString(r.titleNo, r.titleEn),
      desc: i18nText(r.descNo, r.descEn),
    }));

    const patch: Record<string, unknown> = {
      reasonsLayout: "accordion",
      reasonsTitle: i18nString(om.reasonsTitleNo, om.reasonsTitleEn),
      reasons,
    };

    console.log(
      DRY_RUN ? "DRY" : "PATCH",
      slug,
      `layout=accordion reasons=${reasons.length} lead=${Boolean(om.reasonsLeadNo)}`,
    );

    if (!DRY_RUN) {
      let op = sanityClient.patch(id).set(patch);
      if (om.reasonsLeadNo || om.reasonsLeadEn) {
        op = op.set({
          reasonsLead: i18nText(om.reasonsLeadNo || "", om.reasonsLeadEn || ""),
        });
      } else {
        op = op.unset(["reasonsLead", "reasonsLead2"]);
      }
      await op.commit({ autoGenerateArrayKeys: false });
      try {
        await sanityClient.delete(`drafts.${id}`);
      } catch {
        /* no draft */
      }
    }
    updated++;
  }

  // Also force accordion on any other gyn treatment not in dump map
  const extras = await sanityClient.fetch<Array<{ _id: string; slug: string }>>(
    `*[
      _type=="treatment" &&
      references(*[_type=="treatmentCategory" && categoryId=="gynekologi"][0]._id) &&
      !(_id in path("drafts.**"))
    ]{ _id, "slug": coalesce(slug[language=="no"][0].value.current, slug[0].value.current) }`,
  );
  for (const doc of extras) {
    if (GYN_OM_SECTIONS[doc.slug]) continue;
    console.log(DRY_RUN ? "DRY" : "PATCH", doc.slug, "layout=accordion (layout-only)");
    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).set({ reasonsLayout: "accordion" }).commit();
    }
  }

  console.log(`\nDone. ${DRY_RUN ? "Would update" : "Updated"} ${updated} Om sections.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
