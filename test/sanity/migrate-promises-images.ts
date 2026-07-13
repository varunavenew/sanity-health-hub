import * as fs from "fs";
import * as path from "path";
import { sanityClient } from "./config";

const ASSETS_DIR = path.resolve(__dirname, "../../src/assets/promises");
const HOST =
  process.env.LOVABLE_ASSET_HOST ||
  "https://id-preview--3dcc4aff-3deb-44f0-b035-de0201b2a94e.lovable.app";

async function fetchWithRetry(url: string, attempts = 4): Promise<Response | null> {
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
      if (res.ok) return res;
      console.warn(`  … attempt ${i} HTTP ${res.status} for ${url}`);
    } catch (err: any) {
      console.warn(`  … attempt ${i} failed: ${err?.code || err?.message || err}`);
    }
    await new Promise((r) => setTimeout(r, 1000 * i));
  }
  return null;
}

async function loadBuffer(rel: string): Promise<{ buf: Buffer; filename: string; contentType: string } | null> {
  const abs = path.join(ASSETS_DIR, rel);
  if (rel.endsWith(".asset.json")) {
    const pointer = JSON.parse(fs.readFileSync(abs, "utf-8"));
    const url = pointer.url?.startsWith("http") ? pointer.url : `${HOST}${pointer.url}`;
    const res = await fetchWithRetry(url);
    if (!res) return null;
    return {
      buf: Buffer.from(await res.arrayBuffer()),
      filename: pointer.original_filename || path.basename(rel).replace(".asset.json", ""),
      contentType: pointer.content_type || "image/jpeg",
    };
  }
  return {
    buf: fs.readFileSync(abs),
    filename: path.basename(rel),
    contentType: rel.endsWith(".png")
      ? "image/png"
      : rel.endsWith(".webp")
        ? "image/webp"
        : "image/jpeg",
  };
}

async function uploadAsset(rel: string): Promise<string | null> {
  const loaded = await loadBuffer(rel);
  if (!loaded) {
    console.warn(`  ✗ could not load ${rel}`);
    return null;
  }
  const asset = await sanityClient.assets.upload("image", loaded.buf, {
    filename: loaded.filename,
    contentType: loaded.contentType,
  });
  return asset._id;
}

async function run() {
  console.log("Uploading promise images to Sanity...");
  
  const img1Ref = await uploadAsset("promises-1.webp");
  const img2Ref = await uploadAsset("promises-2.jpg");
  const img3Ref = await uploadAsset("promises-3.jpg");

  if (!img1Ref || !img2Ref || !img3Ref) {
    console.error("Failed to upload all promise images. img1:", img1Ref, "img2:", img2Ref, "img3:", img3Ref);
    return;
  }

  console.log("Uploaded assets references successfully:");
  console.log(`- Promise 1 (Family): ${img1Ref}`);
  console.log(`- Promise 2 (Specialist): ${img2Ref}`);
  console.log(`- Promise 3 (Alt under): ${img3Ref}`);

  const docs = await sanityClient.fetch(`*[_type == "treatment" && defined(promises)]`);
  console.log(`Found ${docs.length} treatments to update.`);

  let updatedCount = 0;

  for (const doc of docs) {
    let promisesChanged = false;

    const promises = (doc.promises as any[] || []).map(p => {
      const titleVal = (p.title as any[] || []).find(t => t.language === "no" || t._key === "no")?.value || "";
      const enTitleVal = (p.title as any[] || []).find(t => t.language === "en" || t._key === "en")?.value || "";
      const cleanTitleNo = titleVal.trim().toLowerCase().replace(/[\u00A0\s]+/g, " ");
      const cleanTitleEn = enTitleVal.trim().toLowerCase().replace(/[\u00A0\s]+/g, " ");

      let targetRef = "";

      if (cleanTitleNo.includes("du bestemmer") || cleanTitleEn.includes("you decide")) {
        targetRef = img1Ref;
      } else if (cleanTitleNo.includes("spesialister med dybde") || cleanTitleEn.includes("specialists with depth")) {
        targetRef = img2Ref;
      } else if (cleanTitleNo.includes("alt under samme tak") || cleanTitleEn.includes("everything under one roof")) {
        targetRef = img3Ref;
      }

      if (targetRef) {
        if (p.image?.asset?._ref !== targetRef) {
          promisesChanged = true;
          return {
            ...p,
            image: {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: targetRef
              }
            }
          };
        }
      }

      return p;
    });

    if (promisesChanged) {
      console.log(`Updating promise images for treatment: ${doc._id}`);
      await sanityClient.patch(doc._id).set({ promises }).commit();
      updatedCount++;
    }
  }

  console.log(`Successfully migrated promise images for ${updatedCount} treatments in Sanity!`);
}

run().catch(console.error);
