#!/usr/bin/env npx tsx
/**
 * Clear the optional small text on Gynekologi’s «Menstruasjonssyklus…» segment.
 *
 *   cd test && npx tsx sanity/patch-gynekologi-clear-prevensjon-lead.ts
 *   SANITY_DATASET_FORCE=production ALLOW_PRODUCTION_MIGRATION=true \
 *     npx tsx sanity/patch-gynekologi-clear-prevensjon-lead.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DOC_ID = "category-gynekologi";
const TARGET_RE =
  /hjelper deg med prevensjon|help you with contraception|Menstruasjonssyklus, hormonell helse/i;

type I18nVal = { language?: string; _key?: string; value?: string };

function pick(value: unknown, lang: string): string {
  if (!Array.isArray(value)) return typeof value === "string" ? value : "";
  const hit = (value as I18nVal[]).find(
    (x) => (x.language || x._key) === lang,
  );
  return typeof hit?.value === "string" ? hit.value : "";
}

function isTarget(seg: Record<string, unknown>): boolean {
  if (seg.id === "menstruasjon") return true;
  const blob = [
    pick(seg.title, "no"),
    pick(seg.title, "en"),
    pick(seg.description, "no"),
    pick(seg.description, "en"),
  ].join(" ");
  return TARGET_RE.test(blob);
}

async function patchDoc(id: string): Promise<string> {
  const doc = await sanityClient.fetch<{
    _id: string;
    landingPage?: {
      segmentsSection?: { segments?: Array<Record<string, unknown>> };
    };
  } | null>(
    `*[_id == $id][0]{ _id, landingPage{ segmentsSection{ segments[]{ _key, id, title, description } } } }`,
    { id },
  );
  if (!doc) return `${id}: missing`;

  const segments = doc.landingPage?.segmentsSection?.segments ?? [];
  const keys = segments
    .filter(isTarget)
    .map((s) => String(s._key || ""))
    .filter(Boolean);
  if (keys.length === 0) return `${id}: no matching segment`;

  const paths = keys.map(
    (key) => `landingPage.segmentsSection.segments[_key=="${key}"].description`,
  );
  await sanityClient.patch(id).unset(paths).commit({ visibility: "sync" });
  return `${id}: cleared ${keys.join(", ")}`;
}

async function run() {
  console.log(`Project ${PROJECT_ID} / ${DATASET}`);
  for (const id of [DOC_ID, `drafts.${DOC_ID}`]) {
    console.log(await patchDoc(id));
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
