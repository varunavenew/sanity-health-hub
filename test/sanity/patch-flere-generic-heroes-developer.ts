/**
 * Replace placeholder `flere-fagomrader-hero.jpg` on child pages with a
 * sensible parent hero so related carousels don't show the wrong image.
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";

const COPIES: { source: string; targets: string[] }[] = [
  {
    source: "treatment-flere-fagomrader-hudhelse",
    targets: [
      "treatment-flere-fagomrader-hudbehandlinger",
      "treatment-flere-fagomrader-hudbehandlinger-foflekksjekk",
      "treatment-flere-fagomrader-hudbehandlinger-kosmetisk-dermatologi",
      "treatment-flere-fagomrader-hudbehandlinger-elastisitet-og-volum",
      "treatment-flere-fagomrader-hudbehandlinger-forbedring-av-hudstruktur",
      "treatment-flere-fagomrader-hudbehandlinger-pigmentforandringer-og-solskader",
      "treatment-flere-fagomrader-hudbehandlinger-rodhet-og-synlige-blodkar",
      "treatment-flere-fagomrader-hudpleieprodukter",
      "treatment-flere-fagomrader-behandlingsutstyr",
    ],
  },
  {
    source: "treatment-flere-fagomrader-gastrokirurgi",
    targets: [
      "treatment-flere-fagomrader-gastrokirurgi-hemorroider-og-endetarmsplager",
    ],
  },
];

async function main() {
  if (PROJECT_ID !== "9jhqpk3a" || DATASET !== "developer") {
    throw new Error("Developer dataset only");
  }

  for (const group of COPIES) {
    const src = await sanityClient.fetch<{
      heroImage?: unknown;
      heroMedia?: unknown;
      file?: string;
    }>(
      `*[_id==$id][0]{
        heroImage,
        heroMedia,
        "file": heroImage.asset->originalFilename
      }`,
      { id: group.source },
    );
    if (!src?.heroImage) throw new Error(`Missing hero on ${group.source}`);
    console.log(`\nSource ${group.source}: ${src.file}`);

    for (const id of group.targets) {
      const cur = await sanityClient.fetch<{ file?: string }>(
        `*[_id==$id][0]{"file": heroImage.asset->originalFilename}`,
        { id },
      );
      if (
        cur?.file &&
        cur.file !== "flere-fagomrader-hero.jpg" &&
        cur.file !== "flere-hudhelse.jpg"
      ) {
        // Allow re-run for gastro targets wrongly set to hudhelse
        if (
          group.source.includes("gastro") &&
          cur.file === "flere-hudhelse.jpg"
        ) {
          // fall through
        } else {
          console.log(`  skip ${id} (${cur.file})`);
          continue;
        }
      }
      const patch: Record<string, unknown> = { heroImage: src.heroImage };
      if (src.heroMedia) patch.heroMedia = src.heroMedia;
      console.log(`  patch ${id}`);
      if (!DRY_RUN) await sanityClient.patch(id).set(patch).commit();
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
