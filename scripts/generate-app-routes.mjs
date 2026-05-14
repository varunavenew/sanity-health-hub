import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "src/app/[locale]");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writePage(outDir, importPath, exportName, props = `isChatOpen={false}`) {
  const dir = path.join(root, outDir);
  ensureDir(dir);
  const body =
    exportName === "Godkjenning"
      ? `'use client'\n\nimport ${exportName} from '${importPath}'\n\nexport default function Page() {\n  return <${exportName} />\n}\n`
      : exportName === "BookingDemo" || exportName === "IconPreview"
        ? `'use client'\n\nimport ${exportName} from '${importPath}'\n\nexport default function Page() {\n  return <${exportName} />\n}\n`
        : `'use client'\n\nimport ${exportName} from '${importPath}'\n\nexport default function Page() {\n  return <${exportName} ${props} />\n}\n`;
  fs.writeFileSync(path.join(dir, "page.tsx"), body, "utf8");
}

function writeCategoryNew(outDir, categoryId) {
  const dir = path.join(root, outDir);
  ensureDir(dir);
  fs.writeFileSync(
    path.join(dir, "page.tsx"),
    `'use client'\n\nimport CategoryPageNew from '@/site-pages/treatments/CategoryPageNew'\n\nexport default function Page() {\n  return <CategoryPageNew categoryId="${categoryId}" isChatOpen={false} />\n}\n`,
    "utf8",
  );
}

function writeTreatmentPage(outDir, categoryId) {
  const dir = path.join(root, outDir);
  ensureDir(dir);
  fs.writeFileSync(
    path.join(dir, "page.tsx"),
    `'use client'\n\nimport TreatmentPage from '@/site-pages/treatments/TreatmentPage'\n\nexport default function Page() {\n  return <TreatmentPage categoryId="${categoryId}" isChatOpen={false} />\n}\n`,
    "utf8",
  );
}

const simple = [
  ["", "@/site-pages/Index", "Index"],
  ["demoer", "@/site-pages/DemoOversikt", "DemoOversikt"],
  ["design-demoer", "@/site-pages/DemoOversikt", "DemoOversikt"],
  ["icon-preview", "@/site-pages/IconPreview", "IconPreview"],
  ["produkt/[id]", "@/site-pages/ProductDetail", "ProductDetail"],
  ["about", "@/site-pages/About", "About"],
  ["guide", "@/site-pages/Guide", "Guide"],
  ["contact", "@/site-pages/Contact", "Contact"],
  ["priser", "@/site-pages/Priser", "Priser"],
  ["tjenester", "@/site-pages/Services", "Services"],
  ["tjenester-og-priser", "@/site-pages/Services", "Services"],
  ["forsikring", "@/site-pages/Insurance", "Insurance"],
  ["om-oss", "@/site-pages/About", "About"],
  ["kontakt", "@/site-pages/Contact", "Contact"],
  ["gynecology", "@/site-pages/treatments/Gynecology", "Gynecology"],
  ["gynekologi", "@/site-pages/treatments/Gynecology", "Gynecology"],
  ["fertility", "@/site-pages/treatments/Fertility", "Fertility"],
  ["fertilitet", "@/site-pages/treatments/Fertility", "Fertility"],
  ["urology", "@/site-pages/treatments/UrologiPage", "UrologiPage"],
  ["urologi", "@/site-pages/treatments/UrologiPage", "UrologiPage"],
  ["ortopedi", "@/site-pages/treatments/OrtopediPage", "OrtopediPage"],
  ["flere-fagomrader", "@/site-pages/treatments/FlereFagomraderPage", "FlereFagomraderPage"],
  ["behandlinger/gynekologi", "@/site-pages/treatments/Gynecology", "Gynecology"],
  ["behandlinger/fertilitet", "@/site-pages/treatments/Fertility", "Fertility"],
  ["behandlinger/urologi", "@/site-pages/treatments/UrologiPage", "UrologiPage"],
  ["behandlinger/ortopedi", "@/site-pages/treatments/OrtopediPage", "OrtopediPage"],
  ["behandlinger/flere-fagomrader", "@/site-pages/treatments/FlereFagomraderPage", "FlereFagomraderPage"],
  ["kvinnehelse", "@/site-pages/themes/KvinnehelsePage", "KvinnehelsePage"],
  ["tverrfaglige-team", "@/site-pages/themes/TverrfagligePage", "TverrfagligePage"],
  ["robotassistert-kirurgi", "@/site-pages/themes/RobotkirurgiPage", "RobotkirurgiPage"],
  ["fastlegeveiledning-overgangsalder", "@/site-pages/FastlegeveiledningOvergangsalder", "FastlegeveiledningOvergangsalder"],
  ["personvern", "@/site-pages/Personvern", "Personvern"],
  ["karriere", "@/site-pages/Karriere", "Karriere"],
  ["karriere/[slug]", "@/site-pages/KarriereDetail", "KarriereDetail"],
  ["aktuelt", "@/site-pages/Aktuelt", "Aktuelt"],
  ["aktuelt/[slug]", "@/site-pages/ArticlePage", "ArticlePage"],
  ["om-spesialister", "@/site-pages/AboutSpecialists", "AboutSpecialists"],
  ["spesialister", "@/site-pages/Specialists", "Specialists"],
  ["spesialister/[slug]", "@/site-pages/SpecialistProfile", "SpecialistProfile"],
  ["klinikker", "@/site-pages/Clinics", "Clinics"],
  ["klinikker/[slug]", "@/site-pages/ClinicDetailPage", "ClinicDetailPage"],
  ["gynekologi-design", "@/site-pages/gynekologi-design/DesignHub", "DesignHub"],
  ["gynekologi-design/editorial", "@/site-pages/gynekologi-design/EditorialVariant", "EditorialVariant"],
  ["gynekologi-design/journey", "@/site-pages/gynekologi-design/JourneyVariant", "JourneyVariant"],
  ["gynekologi-design/atelier", "@/site-pages/gynekologi-design/AtelierVariant", "AtelierVariant"],
  ["gynekologi-design/index", "@/site-pages/gynekologi-design/IndexVariant", "IndexVariant"],
  ["gynekologi-design/klassisk-plus", "@/site-pages/gynekologi-design/ClassicPlusVariant", "ClassicPlusVariant"],
  ["fertilitet-design", "@/site-pages/fertilitet-design/DesignHub", "DesignHub"],
  ["fertilitet-design/fertilitet/editorial", "@/site-pages/fertilitet-design/FertilitetEditorial", "FertilitetEditorial"],
  ["fertilitet-design/fertilitet/journey", "@/site-pages/fertilitet-design/FertilitetJourney", "FertilitetJourney"],
  ["fertilitet-design/fertilitetssjekk/editorial", "@/site-pages/fertilitet-design/SjekkEditorial", "SjekkEditorial"],
  ["fertilitet-design/fertilitetssjekk/journey", "@/site-pages/fertilitet-design/SjekkJourney", "SjekkJourney"],
  ["fertilitet-design/fertilitet/atelier", "@/site-pages/fertilitet-design/FertilitetAtelier", "FertilitetAtelier"],
  ["fertilitet-design/fertilitetssjekk/atelier", "@/site-pages/fertilitet-design/SjekkAtelier", "SjekkAtelier"],
  ["fertilitet-design/fertilitet/dialog", "@/site-pages/fertilitet-design/FertilitetDialog", "FertilitetDialog"],
  ["fertilitet-design/fertilitet/magasin", "@/site-pages/fertilitet-design/FertilitetMagasin", "FertilitetMagasin"],
  ["fertilitet-design/fertilitet/klinikk", "@/site-pages/fertilitet-design/FertilitetKlinikk", "FertilitetKlinikk"],
  ["fertilitet-design/fertilitetssjekk/dialog", "@/site-pages/fertilitet-design/SjekkDialog", "SjekkDialog"],
  ["fertilitet-design/fertilitetssjekk/magasin", "@/site-pages/fertilitet-design/SjekkMagasin", "SjekkMagasin"],
  ["fertilitet-design/fertilitetssjekk/klinikk", "@/site-pages/fertilitet-design/SjekkKlinikk", "SjekkKlinikk"],
];

for (const [out, imp, name] of simple) {
  if (name === "BookingDemo") continue;
  writePage(out, imp, name);
}

writePage("booking", "@/site-pages/BookingDemo", "BookingDemo");
writePage("bestill-time", "@/site-pages/BookingDemo", "BookingDemo");
writePage("godkjenning", "@/site-pages/Godkjenning", "Godkjenning");

writeCategoryNew("graviditet", "graviditet");
writeCategoryNew("behandlinger/graviditet", "graviditet");

ensureDir(path.join(root, "behandlinger/gynekologi/[subId]"));
fs.writeFileSync(
  path.join(root, "behandlinger/gynekologi/[subId]/page.tsx"),
  `'use client'\n\nimport GynekologiSubPage from '@/site-pages/treatments/GynekologiSubPage'\n\nexport default function Page() {\n  return <GynekologiSubPage isChatOpen={false} />\n}\n`,
  "utf8",
);

ensureDir(path.join(root, "behandlinger/fertilitet/[subId]"));
fs.writeFileSync(
  path.join(root, "behandlinger/fertilitet/[subId]/page.tsx"),
  `'use client'\n\nimport FertilitetSubPage from '@/site-pages/treatments/FertilitetSubPage'\n\nexport default function Page() {\n  return <FertilitetSubPage isChatOpen={false} />\n}\n`,
  "utf8",
);

writeTreatmentPage("behandlinger/urologi/[subId]", "urologi");
writeTreatmentPage("behandlinger/ortopedi/[subId]", "ortopedi");
writeTreatmentPage("behandlinger/graviditet/[subId]", "graviditet");
writeTreatmentPage("behandlinger/flere-fagomrader/[subId]", "flere-fagomrader");

console.log("Generated routes under", root);
