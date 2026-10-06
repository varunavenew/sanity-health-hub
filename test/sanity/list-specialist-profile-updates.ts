import { config as loadEnv } from "dotenv";
import path from "path";
import { createClient } from "@sanity/client";

loadEnv({ path: path.join(process.cwd(), ".env.local") });
loadEnv({ path: path.join(process.cwd(), "..", ".env.local") });

const token = process.env.SANITY_TOKEN?.trim();
const dataset =
  process.env.SANITY_DATASET_FORCE?.trim() ||
  process.env.SANITY_DATASET?.trim() ||
  "developer";
const projectId = process.env.SANITY_PROJECT_ID?.trim() || "9jhqpk3a";

if (!token) {
  console.error("Missing SANITY_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

async function main() {
  console.log(`Project: ${projectId}, dataset: ${dataset}\n`);

  const profileUpdated = await client.fetch<
    Array<{
      name: string;
      slug: string;
      profileCount: number;
      hasFeatured: boolean;
      featuredCategoryId?: string;
    }>
  >(
    `*[_type == "specialist" && !(_id in path("drafts.**")) && (count(profileTreatments) > 0 || defined(featuredCategory))]{
      name,
      "slug": coalesce(slug[language == "no"][0].value.current, slug[_key == "no"][0].value.current, slug[0].value.current),
      "profileCount": count(profileTreatments),
      "hasFeatured": defined(featuredCategory),
      "featuredCategoryId": featuredCategory->categoryId
    } | order(name asc)`,
  );

  console.log("=== Profile cards / highlighted category (NEW fields) ===");
  if (!profileUpdated.length) {
    console.log("(none)");
  } else {
    for (const s of profileUpdated) {
      console.log(
        `- ${s.name} (${s.slug}): ${s.profileCount} card(s)${s.hasFeatured ? `, featured=${s.featuredCategoryId ?? "?"}` : ""}`,
      );
    }
  }

  const approved = [
    "alenka-bindas",
    "ane-gerda-z-eriksson",
    "are-haukaen-stodle",
    "ashi-ahmad",
    "birgitte-aspenes",
    "birgitte-mitlid-mork",
    "bjorn-brennhovd",
    "bjorn-robstad",
    "endre-soreide",
    "hannah-russell",
    "ida-waagsbo-bjorntvedt",
    "istvan-zoltan-rigo",
    "jackson-tok",
    "jan-ragnar-haugstvedt",
    "jeanette-follestad",
    "jonas-rydinge",
    "jorgen-perminow",
    "kristian-marstrand-warholm",
    "madeleine-engen",
    "marc-jacob-strauss",
    "morten-andersen",
    "nabeel-yousaf-khan",
    "nicolai-wessel",
    "siri-klokstad",
    "stig-hegna",
    "tea-berge",
    "thomas-fredrik-thaulow",
    "tom-henry-sundoen",
    "trond-jorgensen",
  ];

  const slugsWithProfile = new Set(profileUpdated.map((s) => s.slug));
  const pending = approved.filter((slug) => !slugsWithProfile.has(slug));

  console.log("\n=== Mansoor approved list (29) — NOT yet profile-synced ===");
  if (!pending.length) console.log("(all have profileTreatments or featuredCategory)");
  else console.log(pending.map((s) => `- ${s}`).join("\n"));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
