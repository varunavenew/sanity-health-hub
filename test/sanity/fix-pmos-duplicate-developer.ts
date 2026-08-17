/**
 * Developer-only: remove duplicate PMOS treatment.
 *
 * Keep treatment-gynekologi-pmos (demo content / green hero).
 * Set EN slug to "pcos" (NO stays "pmos") so language switch + next.config
 * EN redirects still hit the same document.
 * Delete treatment-gynekologi-pcos (wrong hero / older content).
 *
 *   cd test && npx tsx sanity/fix-pmos-duplicate-developer.ts
 *   DRY_RUN=1 npx tsx sanity/fix-pmos-duplicate-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const KEEP_ID = "treatment-gynekologi-pmos";
const DROP_ID = "treatment-gynekologi-pcos";

function slugEntry(lang: "no" | "en", current: string) {
  return {
    _key: lang,
    _type: "internationalizedArraySlugValue",
    language: lang,
    value: { _type: "slug", current },
  };
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing: dataset "${DATASET}" (developer only)`);
  }

  const keep = await sanityClient.fetch(
    `*[_id == $id][0]{ _id, slug, title, "heroUrl": heroImage.asset->url }`,
    { id: KEEP_ID },
  );
  const drop = await sanityClient.fetch(
    `*[_id == $id][0]{ _id, slug, title, "heroUrl": heroImage.asset->url }`,
    { id: DROP_ID },
  );

  if (!keep) throw new Error(`Missing keep doc ${KEEP_ID}`);
  if (!drop) {
    console.log(`Drop doc ${DROP_ID} already gone — will still normalize EN slug on keep.`);
  } else {
    console.log("KEEP", KEEP_ID, keep.heroUrl);
    console.log("DROP", DROP_ID, drop.heroUrl);
  }

  // Refs pointing at the duplicate
  const refs = drop
    ? await sanityClient.fetch(
        `*[references($id)]{ _id, _type }`,
        { id: DROP_ID },
      )
    : [];
  console.log(`References to ${DROP_ID}:`, refs.length, refs);

  const nextSlug = [slugEntry("no", "pmos"), slugEntry("en", "pcos")];
  console.log("Set keep slug →", JSON.stringify(nextSlug, null, 2));

  if (!DRY_RUN) {
    await sanityClient.patch(KEEP_ID).set({ slug: nextSlug }).commit();
    try {
      await sanityClient.delete(`drafts.${KEEP_ID}`);
    } catch {
      /* none */
    }

    // Retarget strong refs from drop → keep where possible (array of refs)
    for (const ref of refs as Array<{ _id: string; _type: string }>) {
      const id = ref._id.startsWith("drafts.") ? ref._id : ref._id;
      console.log("Note: manual check may be needed for ref", id, ref._type);
    }

    if (drop) {
      try {
        await sanityClient.delete(`drafts.${DROP_ID}`);
      } catch {
        /* none */
      }
      await sanityClient.delete(DROP_ID);
      console.log("Deleted", DROP_ID);
    }
  } else {
    console.log("(dry run — no writes)");
  }

  const verify = await sanityClient.fetch(
    `*{
      "keep": *[_id==$keep][0]{
        _id,
        "slugNo": slug[_key=="no"][0].value.current,
        "slugEn": slug[_key=="en"][0].value.current,
        "heroTitle": heroTitle[_key=="no"][0].value
      },
      "dropGone": !defined(*[_id==$drop][0]._id),
      "byPmos": *[_type=="treatment" && slug[_key=="no"][0].value.current=="pmos"][]._id,
      "byPcos": *[_type=="treatment" && (
        slug[_key=="no"][0].value.current=="pcos" ||
        slug[_key=="en"][0].value.current=="pcos"
      )][]._id
    }[0]`,
    { keep: KEEP_ID, drop: DROP_ID },
  );
  console.log("\nVerify:", JSON.stringify(verify, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
