import { sanityClient } from "./config";
import { randomUUID } from "crypto";

async function run() {
  const categories = await sanityClient.fetch(`*[_type == "treatmentCategory" && !(_id in path("drafts.**"))]`);
  console.log(`Found ${categories.length} categories in Sanity.`);

  for (const cat of categories) {
    const existing = cat.pageSections || [];
    const hasArticles = existing.some((s: any) => s._type === "pageSectionArticles");

    if (hasArticles) {
      console.log(`⏭ Category "${cat.categoryId || cat._id}" already has pageSectionArticles. Skipping.`);
      continue;
    }

    // Create the articles section
    const articlesSection = {
      _type: "pageSectionArticles",
      _key: randomUUID(),
      eyebrow: [
        { _key: "no", _type: "internationalizedArrayStringValue", language: "no", value: "Aktuelt" },
        { _key: "en", _type: "internationalizedArrayStringValue", language: "en", value: "News & Articles" }
      ],
      title: [
        { _key: "no", _type: "internationalizedArrayStringValue", language: "no", value: "Siste artikler og pasienthistorier" },
        { _key: "en", _type: "internationalizedArrayStringValue", language: "en", value: "Latest articles and stories" }
      ],
      description: [
        { _key: "no", _type: "internationalizedArrayTextValue", language: "no", value: "Les mer om behandlinger, råd fra våre spesialister og pasienthistorier." },
        { _key: "en", _type: "internationalizedArrayTextValue", language: "en", value: "Read more about treatments, advice from our specialists, and patient stories." }
      ],
      displayMode: "latest",
      limit: 3,
      variant: "grid",
      ctaLabel: [
        { _key: "no", _type: "internationalizedArrayStringValue", language: "no", value: "Se alle artikler" },
        { _key: "en", _type: "internationalizedArrayStringValue", language: "en", value: "See all articles" }
      ],
      ctaPath: "/aktuelt"
    };

    const newSections = [];
    const specialistsIdx = existing.findIndex((s: any) => s._type === "pageSectionSpecialists");
    
    if (specialistsIdx >= 0) {
      newSections.push(...existing.slice(0, specialistsIdx + 1));
      newSections.push(articlesSection);
      newSections.push(...existing.slice(specialistsIdx + 1));
    } else {
      newSections.push(articlesSection, ...existing);
    }

    console.log(`✎ Patching "${cat.categoryId || cat._id}" to insert pageSectionArticles block.`);
    const result = await sanityClient.patch(cat._id).set({ pageSections: newSections }).commit();
    console.log(`✓ Patched successfully!`);
  }

  console.log("Migration complete!");
}

run().catch(console.error);
