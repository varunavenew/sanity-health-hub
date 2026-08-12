import { sanityClient } from "./config";
import fs from "fs";
import path from "path";

async function run() {
  const imgPath = path.join(process.cwd(), "..", "src", "assets", "clinics", "majorstuen.jpg");
  console.log("Reading image file from:", imgPath);
  const fileData = fs.readFileSync(imgPath);

  console.log("Uploading image to Sanity...");
  const asset = await sanityClient.assets.upload("image", fileData, {
    filename: "majorstuen-hero.jpg",
  });
  console.log("✓ Uploaded. Asset ID:", asset._id);

  console.log("Patching clinicsPage document in Sanity...");
  const result = await sanityClient
    .patch("clinicsPage")
    .set({
      heroImage: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
      },
    })
    .commit();

  console.log("✓ Patched clinicsPage document successfully in Sanity!", JSON.stringify(result, null, 2));
}

run().catch(console.error);
