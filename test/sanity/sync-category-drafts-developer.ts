#!/usr/bin/env npx tsx
/**
 * Developer-only: copy published treatmentCategory docs → drafts.*
 * so Studio section panes match the website after API patches.
 *
 *   cd test && npx tsx sanity/sync-category-drafts-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const IDS = [
  "category-fertilitet",
  "category-gynekologi",
  "category-urologi",
  "category-ortopedi",
  "category-graviditet",
  "category-flere-fagomrader",
] as const;

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  for (const id of IDS) {
    const published = await sanityClient.getDocument(id);
    if (!published) throw new Error(`Missing ${id}`);

    const draftId = `drafts.${id}`;
    const { _rev: _discard, ...rest } = published as Record<string, unknown> & {
      _rev?: string;
    };
    await sanityClient.createOrReplace({
      ...rest,
      _id: draftId,
    });

    const check = await sanityClient.fetch(
      `*[_id==$draftId][0]{
        "segmentsTitle": landingPage.segmentsSection.title[language=="no"][0].value,
        "symptomsTitle": landingPage.symptomsSection.title[language=="no"][0].value,
        "symptomsN": count(landingPage.symptomsSection.items),
        "servicesTitle": landingPage.servicesSection.title[language=="no"][0].value,
        "servicesGroups": count(landingPage.servicesSection.groups),
        "reviewsTitle": landingPage.reviewsSection.title[language=="no"][0].value,
        "reviewsN": count(landingPage.reviewsSection.reviews),
        "specsMode": pageSections[_type=="pageSectionSpecialists"][0].displayMode,
        "specsN": count(pageSections[_type=="pageSectionSpecialists"][0].specialists),
        "specsTitle": pageSections[_type=="pageSectionSpecialists"][0].title[language=="no"][0].value
      }`,
      { draftId },
    );
    console.log(`✓ ${draftId}`, JSON.stringify(check));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
