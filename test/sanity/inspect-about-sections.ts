import { sanityClient as client, DATASET, PROJECT_ID } from "./config";

async function main() {
  console.log("project", PROJECT_ID, "dataset", DATASET);
  if (DATASET !== "developer") throw new Error(`Refuse: ${DATASET}`);

  const ps = await client.fetch(
    `*[_id=="aboutPage"][0]{
      pageSections[]{
        _key,_type,title,description,eyebrow,displayMode,limit,variant,seeAllLabel,
        "specCount": count(specialists)
      }
    }`,
  );
  console.log("pageSections", JSON.stringify(ps, null, 2));

  const heroes = await client.fetch(
    `*[_type=="sanity.imageAsset" && (
      originalFilename match "*hero-family*" ||
      originalFilename match "*about-hero*" ||
      originalFilename match "*familie*"
    )]{_id, originalFilename, url, "w": metadata.dimensions.width, "h": metadata.dimensions.height}`,
  );
  console.log("hero candidates", JSON.stringify(heroes, null, 2));

  // Also search by dimensions matching family photo ~ common sizes
  const byHash = await client.fetch(
    `*[_type=="sanity.imageAsset" && _id match "image-*family*"][0...5]{_id,originalFilename}`,
  );
  console.log("family id match", byHash);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
