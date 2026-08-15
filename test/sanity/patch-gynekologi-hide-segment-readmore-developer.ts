/**
 * Developer-only: hide segment “Les mer” on Gynekologi (reference parity).
 * Other categories keep showReadMore unset/true until editors toggle in Studio.
 */
import { sanityClient } from "./config";

const IDS = ["category-gynekologi", "drafts.category-gynekologi"] as const;

async function main() {
  for (const id of IDS) {
    const exists = await sanityClient.fetch(`count(*[_id == $id])`, { id });
    if (!exists) {
      console.log(id, "skip — missing");
      continue;
    }
    await sanityClient
      .patch(id)
      .set({ "landingPage.segmentsSection.showReadMore": false })
      .commit({ visibility: "sync" });
    console.log(id, "showReadMore=false");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
