#!/usr/bin/env npx tsx
/**
 * Developer-only: set showBookingButton + showCallButton on every specialist.
 * Unset fields behave as "on" on the site, but Studio shows them unchecked until patched.
 *
 *   cd test && npx tsx sanity/patch-specialist-cta-toggles-developer.ts
 *   cd test && DRY_RUN=1 npx tsx sanity/patch-specialist-cta-toggles-developer.ts
 */
import { sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";

type Row = { _id: string; name?: string; showBookingButton?: boolean; showCallButton?: boolean };

async function main() {
  const rows = await sanityClient.fetch<Row[]>(
    `*[_type == "specialist" && !(_id in path("drafts.**"))]{
      _id,
      name,
      showBookingButton,
      showCallButton
    } | order(name asc)`,
  );

  const toPatch = rows.filter(
    (row) => row.showBookingButton !== true || row.showCallButton !== true,
  );

  console.log(`Specialists total: ${rows.length}`);
  console.log(`Need patch: ${toPatch.length}`);

  if (toPatch.length === 0) {
    console.log("All specialists already have both CTA toggles enabled.");
    return;
  }

  for (const row of toPatch) {
    console.log(
      `- ${row.name ?? row._id}: booking=${String(row.showBookingButton)} call=${String(row.showCallButton)}`,
    );
  }

  if (DRY_RUN) {
    console.log("\nDRY_RUN=1 — no writes.");
    return;
  }

  let tx = sanityClient.transaction();
  for (const row of toPatch) {
    tx = tx.patch(row._id, {
      set: {
        showBookingButton: true,
        showCallButton: true,
      },
    });
  }
  await tx.commit();

  console.log(`\nPatched ${toPatch.length} specialist(s) on developer.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
