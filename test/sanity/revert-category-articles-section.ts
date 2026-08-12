import { sanityClient } from "./config";

async function run() {
  const categories = await sanityClient.fetch(`*[_type == "treatmentCategory" && !(_id in path("drafts.**"))]`);
  console.log(`Found ${categories.length} categories in Sanity.`);

  for (const cat of categories) {
    const existing = cat.pageSections || [];
    const hasArticles = existing.some((s: any) => s._type === "pageSectionArticles");

    if (!hasArticles) {
      console.log(`⏭ Category "${cat.categoryId || cat._id}" does not have pageSectionArticles. Skipping.`);
      continue;
    }

    const filtered = existing.filter((s: any) => s._type !== "pageSectionArticles");

    console.log(`✎ Reverting "${cat.categoryId || cat._id}" to remove pageSectionArticles block.`);
    await sanityClient.patch(cat._id).set({ pageSections: filtered }).commit();
    console.log(`✓ Reverted successfully!`);
  }

  console.log("Revert complete!");
}

run().catch(console.error);
