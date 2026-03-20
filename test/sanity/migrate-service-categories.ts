/**
 * Migration script: Push static serviceCategories data into Sanity
 * as treatmentCategory + treatment documents.
 *
 * Run with:
 *   npx tsx test/sanity/migrate-service-categories.ts
 */

import { sanityClient as client } from "./config";
import * as fs from "fs";
import * as path from "path";

// ── Image Upload Helpers ──

const ASSETS_DIR = path.resolve(__dirname, "../../src/assets");
const imageCache = new Map<string, string>();

async function uploadImage(
  relativePath: string,
  label?: string
): Promise<{ _type: "image"; asset: { _type: "reference"; _ref: string } } | null> {
  const fullPath = path.join(ASSETS_DIR, relativePath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`  ⚠ Image not found: ${relativePath}`);
    return null;
  }

  if (imageCache.has(relativePath)) {
    const cachedRef = imageCache.get(relativePath)!;
    return { _type: "image", asset: { _type: "reference", _ref: cachedRef } };
  }

  const fileBuffer = fs.readFileSync(fullPath);
  const ext = path.extname(fullPath).slice(1).toLowerCase();
  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
  };
  const contentType = mimeTypes[ext] || "application/octet-stream";
  const filename = label ? `${label}.${ext}` : path.basename(fullPath);

  const res = await fetch(
    `https://${client.config().projectId}.api.sanity.io/v2024-01-01/assets/images/${client.config().dataset}?filename=${encodeURIComponent(filename)}&label=${encodeURIComponent(label || "")}`,
    {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        Authorization: `Bearer ${client.config().token}`,
      },
      body: fileBuffer,
    }
  );

  if (!res.ok) {
    console.error(`  ❌ Failed to upload ${relativePath}: ${res.status}`);
    return null;
  }

  const result = await res.json();
  const assetId = result.document._id;
  imageCache.set(relativePath, assetId);
  console.log(`  📸 Uploaded: ${relativePath} → ${assetId}`);
  return { _type: "image", asset: { _type: "reference", _ref: assetId } };
}

// Category hero images mapping
const categoryImages: Record<string, string> = {
  gynekologi: "categories/gynekologi-real.jpg",
  fertilitet: "categories/fertilitet-real.jpg",
  urologi: "categories/urologi-real.jpg",
  ortopedi: "categories/ortopedi-real.jpg",
  graviditet: "categories/fertilitet-real.jpg",
  "flere-fagomrader": "categories/flere-fagomrader.jpg",
};

// ── Static data (mirrored from src/data/serviceCategories.ts) ──

interface SubItem {
  label: string;
  anchor?: string;
  path?: string;
}

interface SubCategory {
  label: string;
  path: string;
  items?: SubItem[];
}

interface ServiceCategory {
  id: string;
  label: string;
  path: string;
  subcategories: SubCategory[];
}

const serviceCategories: ServiceCategory[] = [
  {
    id: "gynekologi",
    label: "Gynekologi",
    path: "/gynekologi",
    subcategories: [
      {
        label: "Tverrfaglig team",
        path: "/behandlinger/gynekologi/tverrfaglig",
        items: [
          { label: "Osteopat", path: "/behandlinger/flere-fagomrader/osteopati" },
          { label: "Sexolog", path: "/behandlinger/flere-fagomrader/sexologi" },
          { label: "Psykolog", path: "/behandlinger/flere-fagomrader/psykologi" },
          { label: "Ernæringsfysiolog", path: "/behandlinger/flere-fagomrader/ernaringsfysiolog" },
        ],
      },
      { label: "Gynekologisk undersøkelse", path: "/behandlinger/gynekologi/undersokelse" },
      {
        label: "Urinlekkasje",
        path: "/behandlinger/gynekologi/urinlekkasje",
        items: [
          { label: "Stressinkontinens" },
          { label: "Tranginkontinens" },
          { label: "Blandingsinkontinens" },
        ],
      },
      {
        label: "Endometriose",
        path: "/behandlinger/gynekologi/endometriose",
        items: [{ label: "Symptomer" }, { label: "Kirurgi" }],
      },
      {
        label: "Overgangsalder",
        path: "/behandlinger/gynekologi/overgangsalder",
        items: [{ label: "Symptomer" }, { label: "Hormonbehandling" }],
      },
      { label: "Vaginale fremfall", path: "/behandlinger/gynekologi/vaginale-fremfall" },
      { label: "Blødningsforstyrrelser", path: "/behandlinger/gynekologi/blodningsforstyrrelser" },
      {
        label: "Celleforandringer",
        path: "/behandlinger/gynekologi/celleforandringer",
        items: [{ label: "HPV og celleforandring" }, { label: "Konisering" }],
      },
      {
        label: "Cyster på eggstokkene",
        path: "/behandlinger/gynekologi/cyster",
        items: [{ label: "Former for cyste" }, { label: "Behandling" }],
      },
      { label: "Fjerne livmor", path: "/behandlinger/gynekologi/fjerne-livmor" },
      {
        label: "Graviditet",
        path: "/behandlinger/gynekologi/graviditet",
        items: [{ label: "Ultralyd" }, { label: "NIPT" }, { label: "Svangerskapsteam" }],
      },
      {
        label: "Gynekologisk kirurgi",
        path: "/behandlinger/gynekologi/kirurgi",
        items: [
          { label: "Fremfalloperasjoner" },
          { label: "Urinlekkasjeoperasjoner" },
          { label: "Hysterektomi" },
          { label: "Polypper og muskelknuter" },
          { label: "Endometriosebehandling" },
        ],
      },
      {
        label: "Hormonforstyrrelser",
        path: "/behandlinger/gynekologi/hormonforstyrrelser",
        items: [{ label: "PCOS" }],
      },
      {
        label: "Hysteroskopi",
        path: "/behandlinger/gynekologi/hysteroskopi",
        items: [{ label: "Office-hysteroskopi" }],
      },
      { label: "Labiaplastikk", path: "/behandlinger/gynekologi/labiaplastikk" },
      {
        label: "Robotkirurgi",
        path: "/behandlinger/gynekologi/robotkirurgi",
        items: [{ label: "Muskelknuter" }, { label: "Dyp endometriose" }, { label: "Hysterektomi" }],
      },
      { label: "Spontanabort", path: "/behandlinger/gynekologi/spontanabort" },
      { label: "Vulvalidelser", path: "/behandlinger/gynekologi/vulvalidelser" },
    ],
  },
  {
    id: "graviditet",
    label: "Graviditet",
    path: "/graviditet",
    subcategories: [
      { label: "Ultralyd", path: "/behandlinger/graviditet/ultralyd" },
      { label: "NIPT", path: "/behandlinger/graviditet/nipt" },
      { label: "Svangerskapsteam", path: "/behandlinger/graviditet/svangerskapsteam" },
      { label: "Fosterdiagnostikk", path: "/behandlinger/graviditet/fosterdiagnostikk" },
    ],
  },
  {
    id: "urologi",
    label: "Urologi",
    path: "/urologi",
    subcategories: [
      {
        label: "Blære og urinveier",
        path: "/behandlinger/urologi/blaere",
        items: [
          { label: "Blod i urinen" },
          { label: "Vannlatningsproblemer" },
          { label: "TUR-P og TUR-B" },
          { label: "Innsnevring i urinrøret" },
        ],
      },
      {
        label: "Forhud",
        path: "/behandlinger/urologi/forhud",
        items: [{ label: "Trang forhud" }],
      },
      {
        label: "Mannlig infertilitet",
        path: "/behandlinger/urologi/infertilitet",
        items: [{ label: "Sædanalyse" }],
      },
      {
        label: "Nyrer",
        path: "/behandlinger/urologi/nyrer",
        items: [
          { label: "Nyrecyster" },
          { label: "Tumor" },
          { label: "Robotkirurgi for nyrekreft" },
          { label: "Nyrestein" },
        ],
      },
      {
        label: "Prostata",
        path: "/behandlinger/urologi/prostata",
        items: [{ label: "Prostataundersøkelse" }, { label: "Robotkirurgi" }],
      },
      { label: "Refertilisering", path: "/behandlinger/urologi/refertilisering" },
      {
        label: "Robotkirurgi",
        path: "/behandlinger/urologi/robotkirurgi",
        items: [
          { label: "Prostatakreft (RALP)" },
          { label: "Godartet forstørret prostata (RASP)" },
          { label: "Brokk" },
        ],
      },
      { label: "Sterilisering", path: "/behandlinger/urologi/sterilisering" },
      {
        label: "Testikler og pung",
        path: "/behandlinger/urologi/testikler",
        items: [{ label: "Testikkelkreft" }, { label: "Kul i pungen" }],
      },
    ],
  },
  {
    id: "fertilitet",
    label: "Fertilitet",
    path: "/fertilitet",
    subcategories: [
      { label: "Infertilitet", path: "/behandlinger/fertilitet/infertilitet" },
      { label: "Assistert befruktning", path: "/behandlinger/fertilitet/assistert-befruktning" },
      {
        label: "IVF",
        path: "/behandlinger/fertilitet/ivf",
        items: [{ label: "Det første møtet" }, { label: "Fertilitetssjekk" }, { label: "Behandling" }],
      },
      { label: "Eggfrys", path: "/behandlinger/fertilitet/eggfrys" },
      { label: "Donorbehandling", path: "/behandlinger/fertilitet/donorbehandling" },
      { label: "Hysteroskopi", path: "/behandlinger/fertilitet/hysteroskopi" },
      { label: "Sædanalyse", path: "/behandlinger/fertilitet/saedanalyse" },
      { label: "Fertilitetsteamet", path: "/behandlinger/fertilitet/teamet" },
    ],
  },
  {
    id: "ortopedi",
    label: "Ortopedi",
    path: "/ortopedi",
    subcategories: [
      { label: "Fot og ankel", path: "/behandlinger/ortopedi/fot-ankel" },
      { label: "Hofte", path: "/behandlinger/ortopedi/hofte" },
      { label: "Hånd og albue", path: "/behandlinger/ortopedi/hand-albue" },
      { label: "Kne", path: "/behandlinger/ortopedi/kne" },
      { label: "Skulder", path: "/behandlinger/ortopedi/skulder" },
    ],
  },
  {
    id: "flere-fagomrader",
    label: "Flere fagområder",
    path: "/flere-fagomrader",
    subcategories: [
      {
        label: "Endokrinologi",
        path: "/behandlinger/flere-fagomrader/endokrinologi",
        items: [{ label: "Stoffskifte" }, { label: "Diabetes" }, { label: "Hormonsykdommer" }],
      },
      {
        label: "Hudlege",
        path: "/behandlinger/flere-fagomrader/hudlege",
        items: [
          { label: "Akne" },
          { label: "Eksem" },
          { label: "Rosacea" },
          { label: "Psoriasis" },
          { label: "Føflekksjekk" },
          { label: "Hudkreft" },
        ],
      },
      {
        label: "Hudhelse",
        path: "/behandlinger/flere-fagomrader/hudhelse",
        items: [{ label: "Hudpleie" }, { label: "Hudforyngelse" }],
      },
      { label: "Ernæringsfysiolog", path: "/behandlinger/flere-fagomrader/ernaringsfysiolog" },
      {
        label: "Gastrokirurgi",
        path: "/behandlinger/flere-fagomrader/gastrokirurgi",
        items: [
          { label: "Bariatrisk kirurgi" },
          { label: "Sleeve gastrektomi" },
          { label: "Gallestein" },
          { label: "Brokk" },
        ],
      },
      { label: "Osteopati", path: "/behandlinger/flere-fagomrader/osteopati" },
      {
        label: "Overvektskirurgi",
        path: "/behandlinger/flere-fagomrader/overvektskirurgi",
        items: [{ label: "Gastrisk bypass" }, { label: "Sleeve gastrektomi" }, { label: "Utredning" }],
      },
      { label: "Plastikkirurgi", path: "/behandlinger/flere-fagomrader/plastikkirurgi" },
      { label: "Psykologi", path: "/behandlinger/flere-fagomrader/psykologi" },
      {
        label: "Revmatologi",
        path: "/behandlinger/flere-fagomrader/revmatologi",
        items: [{ label: "Utredning" }, { label: "Revmatoid artritt" }, { label: "Lupus" }],
      },
      {
        label: "Robotkirurgi",
        path: "/behandlinger/flere-fagomrader/robotkirurgi",
        items: [
          { label: "Muskelknuter" },
          { label: "Dyp endometriose" },
          { label: "Hysterektomi" },
          { label: "Brokk" },
          { label: "Prostatakreft (RALP)" },
          { label: "Godartet forstørret prostata (RASP)" },
        ],
      },
      { label: "Sexologi", path: "/behandlinger/flere-fagomrader/sexologi" },
      {
        label: "Åreknutebehandling",
        path: "/behandlinger/flere-fagomrader/areknuter",
        items: [{ label: "Symptomer" }, { label: "Behandling" }, { label: "Ultralydundersøkelse" }],
      },
    ],
  },
];

// ── Helpers ──

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Deterministic ID — aligned with migrate-content.ts to avoid duplicates
function catId(categoryId: string): string {
  return `category-${categoryId}`;
}

function treatmentId(categoryId: string, slug: string): string {
  return `treatment-${categoryId}-${slug}`;
}

// ── Build transaction ──

async function migrate() {
  console.log("🚀 Migrating service categories to Sanity (with images)...\n");

  const tx = client.transaction();

  for (const cat of serviceCategories) {
    const categoryDocId = catId(cat.id);

    // Upload hero image for this category
    const imagePath = categoryImages[cat.id];
    let heroImage = null;
    if (imagePath) {
      console.log(`  🖼 Uploading hero image for ${cat.label}...`);
      heroImage = await uploadImage(imagePath, `category-${cat.id}`);
    }

    // Collect treatment references
    const treatmentRefs: { _type: string; _ref: string; _key: string }[] = [];

    for (const sub of cat.subcategories) {
      const pathParts = sub.path.split("/");
      const slug = pathParts[pathParts.length - 1];
      const docId = treatmentId(cat.id, slug);

      treatmentRefs.push({
        _type: "reference",
        _ref: docId,
        _key: slug,
      });

      const subItems = (sub.items || []).map((item, idx) => ({
        _key: `item-${idx}`,
        _type: "object",
        label: item.label,
        anchor: item.anchor || undefined,
        path: item.path || undefined,
      }));

      tx.createOrReplace({
        _id: docId,
        _type: "treatment",
        title: sub.label,
        slug: { _type: "slug", current: slug },
        category: { _type: "reference", _ref: categoryDocId },
        parentCategoryLabel: cat.label,
        subItems: subItems.length > 0 ? subItems : undefined,
      });

      console.log(`  📄 Treatment: ${sub.label} (${docId})`);
    }

    // Create category document WITH hero image
    tx.createOrReplace({
      _id: categoryDocId,
      _type: "treatmentCategory",
      title: cat.label,
      slug: { _type: "slug", current: cat.id === "flere" ? "flere-fagomrader" : cat.id },
      categoryId: cat.id === "flere" ? "flere-fagomrader" : cat.id,
      treatments: treatmentRefs,
      ...(heroImage ? { heroImage } : {}),
    });

    console.log(`📁 Category: ${cat.label} (${categoryDocId})`);
    console.log("");
  }

  console.log("⏳ Committing transaction...");
  const result = await tx.commit();
  console.log(`✅ Done! ${result.results.length} documents created/updated.`);
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err.message);
  process.exit(1);
});
