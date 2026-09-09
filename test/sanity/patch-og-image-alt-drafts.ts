/**
 * Copy seo.ogImageAlt from each published document onto its draft when the
 * draft is missing the field. Re-runnable; skips drafts that already have alt.
 *
 *   cd test && npx tsx sanity/patch-og-image-alt-drafts.ts
 *   DRY_RUN=1 npx tsx sanity/patch-og-image-alt-drafts.ts
 *
 * Production:
 *   ALLOW_PRODUCTION_MIGRATION=true SANITY_DATASET_FORCE=production npx tsx sanity/patch-og-image-alt-drafts.ts
 */
import {sanityClient} from "./config";
import {isOgImageAltMissing} from "./lib/preserve-og-image-alt";

const DRY_RUN = process.env.DRY_RUN === "1";

type Row = {
  _id: string;
  _type: string;
  seo?: {ogImageAlt?: unknown};
};

async function main() {
  const drafts = await sanityClient.fetch<Row[]>(
    `*[_id in path("drafts.**") && defined(seo)]{ _id, _type, seo }`,
  );

  let copied = 0;
  let skipped = 0;

  console.log(
    `[ogImageAlt drafts] ${drafts.length} draft(s) with seo — mode=${DRY_RUN ? "DRY_RUN" : "WRITE"}`,
  );

  for (const draft of drafts) {
    if (!isOgImageAltMissing(draft.seo)) {
      skipped += 1;
      continue;
    }
    const publishedId = draft._id.replace(/^drafts\./, "");
    const published = await sanityClient.fetch<Row | null>(
      `*[_id == $id][0]{ _id, seo }`,
      {id: publishedId},
    );
    if (isOgImageAltMissing(published?.seo)) {
      skipped += 1;
      continue;
    }
    const alt = published!.seo!.ogImageAlt;
    console.log(`  ${draft._id} (${draft._type}) ← published ogImageAlt`);
    if (!DRY_RUN) {
      await sanityClient
        .patch(draft._id)
        .set({"seo.ogImageAlt": alt})
        .commit({autoGenerateArrayKeys: true});
    }
    copied += 1;
  }

  console.log(`done — copied ${copied}, skipped ${skipped}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
