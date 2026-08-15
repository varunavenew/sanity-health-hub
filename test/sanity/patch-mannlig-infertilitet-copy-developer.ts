/**
 * Developer-only: align Fertilitet expert card "Mannlig infertilitet" copy with reference.
 */
import { sanityClient } from "./config";

const TITLE_NO = "Mannlig infertilitet";
const DESC_NO =
  "Utredning og behandling av mannlig fruktbarhet — i samarbeid med urologene våre.";
const DESC_EN =
  "Investigation and treatment of male fertility — in collaboration with our urologists.";

function setI18nText(
  current: Array<Record<string, unknown>> | undefined,
  no: string,
  en: string,
) {
  const base = Array.isArray(current) ? [...current] : [];
  const upsert = (lang: "no" | "en", value: string) => {
    const idx = base.findIndex(
      (row) => row.language === lang || row._key === lang,
    );
    const next = {
      _type: "internationalizedArrayTextValue",
      _key:
        idx >= 0 && typeof base[idx]._key === "string"
          ? String(base[idx]._key)
          : lang,
      language: lang,
      value,
    };
    if (idx >= 0) base[idx] = { ...base[idx], ...next };
    else base.push(next);
  };
  upsert("no", no);
  upsert("en", en);
  return base;
}

async function patchId(id: string) {
  const doc = await sanityClient.fetch(
    `*[_id == $id][0]{ _id, landingPage }`,
    { id },
  );
  if (!doc?.landingPage?.expertAreasSection?.areas) {
    console.log(id, "skip — no expert areas");
    return;
  }

  let changed = false;
  const areas = doc.landingPage.expertAreasSection.areas.map((area: any) => {
    const titleNo =
      area?.title?.find?.((t: any) => t.language === "no" || t._key === "no")
        ?.value || "";
    if (titleNo !== TITLE_NO) return area;
    changed = true;
    return {
      ...area,
      description: setI18nText(area.description, DESC_NO, DESC_EN),
    };
  });

  if (!changed) {
    console.log(id, "Mannlig infertilitet card not found");
    return;
  }

  await sanityClient
    .patch(id)
    .set({ "landingPage.expertAreasSection.areas": areas })
    .commit({ visibility: "sync" });

  console.log(id, "updated Mannlig infertilitet description");
}

async function main() {
  await patchId("drafts.category-fertilitet");
  await patchId("category-fertilitet");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
