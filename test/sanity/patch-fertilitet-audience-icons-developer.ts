/**
 * Developer-only: set fallback icons on Fertilitet audience cards.
 * Cards already have images; icons were missing and blocked Studio Publish.
 */
import { sanityClient } from "./config";

const ICONS = ["couple", "users", "user", "user"] as const;

async function patchDoc(id: string) {
  const doc = await sanityClient.fetch(
    `*[_id == $id][0]{ _id, "audiences": landingPage.audiencesSection.audiences }`,
    { id },
  );
  if (!doc?.audiences?.length) {
    console.log(id, "no audiences");
    return;
  }

  const audiences = doc.audiences.map((a: any, i: number) => ({
    ...a,
    icon: typeof a.icon === "string" && a.icon.trim() ? a.icon : ICONS[i] || "user",
  }));

  await sanityClient
    .patch(id)
    .set({ "landingPage.audiencesSection.audiences": audiences })
    .commit({ visibility: "sync" });

  console.log(
    id,
    audiences.map((a: any) => ({ key: a._key, icon: a.icon, hasImage: Boolean(a.image?.asset) })),
  );
}

async function main() {
  await patchDoc("drafts.category-fertilitet");
  await patchDoc("category-fertilitet");
  console.log("Done — hard-refresh Studio; Publish should enable.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
