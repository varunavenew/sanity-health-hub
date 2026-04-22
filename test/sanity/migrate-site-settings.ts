/**
 * Migrate site settings (navigation, contact info, 404 page) to Sanity
 *
 * Usage:
 *   npx ts-node --esm test/sanity/migrate-site-settings.ts
 */
import { sanityClient as client } from "./config";
import * as fs from "fs";
import * as path from "path";

const SETTINGS_ID = "siteSettings";

// Helper: upload image asset
async function uploadImage(filePath: string, label: string) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) {
    console.warn(`  ⚠ Image not found: ${abs}`);
    return null;
  }
  const buffer = fs.readFileSync(abs);
  const ext = path.extname(abs).replace(".", "");
  const asset = await client.assets.upload("image", buffer, {
    filename: `${label}.${ext}`,
    contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
  });
  console.log(`  ✔ Uploaded image: ${label}`);
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

async function migrate() {
  console.log("🚀 Migrating site settings...\n");

  // Upload 404 image if available
  let notFoundImage = null;
  const notFoundImagePath = path.resolve("src/assets/hero/cmedical-hero-1.jpg");
  if (fs.existsSync(notFoundImagePath)) {
    notFoundImage = await uploadImage(notFoundImagePath, "not-found-page");
  }

  const doc: any = {
    _id: SETTINGS_ID,
    _type: "siteSettings",
    title: "CMedical",
    phone: "+47 22 60 00 50",
    email: "info@cmedical.no",
    address: "Oslo · Bekkestua · Ski · Moss · Moelv",
    mainNavigation: [
      {
        _key: "nav-tjenester",
        _type: "navItem",
        label: "Tjenester",
        path: "/tjenester",
        isServicesDropdown: true,
      },
      {
        _key: "nav-priser",
        _type: "navItem",
        label: "Priser",
        path: "/priser",
        isServicesDropdown: false,
      },
      {
        _key: "nav-forsikring",
        _type: "navItem",
        label: "Forsikring",
        path: "/forsikring",
        isServicesDropdown: false,
      },
      {
        _key: "nav-aktuelt",
        _type: "navItem",
        label: "Aktuelt",
        path: "/aktuelt",
        isServicesDropdown: false,
      },
      {
        _key: "nav-om-oss",
        _type: "navItem",
        label: "Om oss",
        path: "/om-oss",
        isServicesDropdown: false,
      },
      {
        _key: "nav-kontakt",
        _type: "navItem",
        label: "Kontakt",
        path: "/kontakt",
        isServicesDropdown: false,
      },
    ],
    ctaButton: {
      label: "Bestill time",
      path: "/booking",
    },
    footerNavigation: [
      {
        _key: "col-tjenester",
        _type: "footerColumn",
        heading: "Tjenester",
        links: [
          { _key: "fl-gyn", _type: "footerLink", label: "Gynekologi", path: "/gynekologi" },
          { _key: "fl-grav", _type: "footerLink", label: "Graviditet", path: "/graviditet" },
          { _key: "fl-fert", _type: "footerLink", label: "Fertilitet", path: "/fertilitet" },
          { _key: "fl-uro", _type: "footerLink", label: "Urologi", path: "/urologi" },
          { _key: "fl-ort", _type: "footerLink", label: "Ortopedi", path: "/ortopedi" },
          { _key: "fl-flere", _type: "footerLink", label: "Flere fagområder", path: "/flere-fagomrader" },
        ],
      },
      {
        _key: "col-om",
        _type: "footerColumn",
        heading: "Om CMedical",
        links: [
          { _key: "fl-omoss", _type: "footerLink", label: "Om oss", path: "/om-oss" },
          { _key: "fl-spes", _type: "footerLink", label: "Spesialister", path: "/spesialister" },
          { _key: "fl-pris", _type: "footerLink", label: "Priser", path: "/priser" },
          { _key: "fl-fors", _type: "footerLink", label: "Forsikring", path: "/forsikring" },
          { _key: "fl-akt", _type: "footerLink", label: "Aktuelt", path: "/aktuelt" },
          { _key: "fl-kar", _type: "footerLink", label: "Karriere", path: "/karriere" },
        ],
      },
    ],
    footerBottomLinks: [
      { _key: "fbl-pers", _type: "footerLink", label: "Personvern", path: "/personvern" },
    ],
    footerCopyright: "Alle rettigheter reservert.",
    socialMedia: {
      instagram: "https://www.instagram.com/cmedical.no",
      facebook: "https://www.facebook.com/cmedical.no",
      linkedin: "https://www.linkedin.com/company/cmedical",
    },
    notFoundTitle: "Siden ble ikke funnet",
    notFoundText:
      "Beklager, vi finner ikke siden du leter etter. Den kan ha blitt flyttet eller slettet.",
    notFoundCtaLabel: "Tilbake til forsiden",
    notFoundCtaPath: "/",
    ...(notFoundImage ? { notFoundImage } : {}),
  };

  await client.createOrReplace(doc);
  console.log("\n✅ Site settings migrated successfully!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
