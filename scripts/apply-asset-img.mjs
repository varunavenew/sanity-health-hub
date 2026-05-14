import fs from "node:fs";
import path from "node:path";

const files = [
  "src/components/BeforeAfterSection.tsx",
  "src/components/BundlePackages.tsx",
  "src/components/ExpertiseSection.tsx",
  "src/components/HeroSlider.tsx",
  "src/components/homepage/Footer.tsx",
  "src/components/homepage/HeroBanner.tsx",
  "src/components/homepage/HeroSectionSplit.tsx",
  "src/components/homepage/HeroSection.tsx",
  "src/components/homepage/SpecialistsSection.tsx",
  "src/components/homepage/VisualStorytelling.tsx",
  "src/components/homepage/WhyCMedicalSection.tsx",
  "src/components/IdaGuide.tsx",
  "src/components/layout/PageLayout.tsx",
  "src/components/layout/SubTreatmentLayout.tsx",
  "src/components/SkinConcernCategories.tsx",
  "src/components/specialist/RelatedSpecialists.tsx",
  "src/components/specialist/SpecialistHero.tsx",
  "src/components/treatments/SpecialistsScroller.tsx",
  "src/site-pages/About.tsx",
  "src/site-pages/BookingDemo.tsx",
  "src/site-pages/Clinics.tsx",
  "src/site-pages/Contact.tsx",
  "src/site-pages/fertilitet-design/DemoSpecialistCard.tsx",
  "src/site-pages/fertilitet-design/DesignHub.tsx",
  "src/site-pages/fertilitet-design/FertilitetAtelier.tsx",
  "src/site-pages/fertilitet-design/FertilitetDialog.tsx",
  "src/site-pages/fertilitet-design/FertilitetEditorial.tsx",
  "src/site-pages/fertilitet-design/FertilitetJourney.tsx",
  "src/site-pages/fertilitet-design/FertilitetKlinikk.tsx",
  "src/site-pages/fertilitet-design/FertilitetMagasin.tsx",
  "src/site-pages/fertilitet-design/SjekkAtelier.tsx",
  "src/site-pages/fertilitet-design/SjekkDialog.tsx",
  "src/site-pages/fertilitet-design/SjekkEditorial.tsx",
  "src/site-pages/fertilitet-design/SjekkJourney.tsx",
  "src/site-pages/fertilitet-design/SjekkKlinikk.tsx",
  "src/site-pages/fertilitet-design/SjekkMagasin.tsx",
  "src/site-pages/gynekologi-design/AtelierVariant.tsx",
  "src/site-pages/gynekologi-design/ClassicPlusVariant.tsx",
  "src/site-pages/gynekologi-design/DemoSpecialistCard.tsx",
  "src/site-pages/gynekologi-design/DesignHub.tsx",
  "src/site-pages/gynekologi-design/EditorialVariant.tsx",
  "src/site-pages/gynekologi-design/IndexVariant.tsx",
  "src/site-pages/gynekologi-design/JourneyVariant.tsx",
  "src/site-pages/Pricing.tsx",
  "src/site-pages/Priser.tsx",
  "src/site-pages/ProductDetail.tsx",
  "src/site-pages/Specialists.tsx",
  "src/site-pages/themes/RobotkirurgiPage.tsx",
  "src/site-pages/themes/TverrfagligePage.tsx",
  "src/site-pages/treatments/CategoryPageNew.tsx",
  "src/site-pages/treatments/CategoryPage.tsx",
  "src/site-pages/treatments/Fertility.tsx",
  "src/site-pages/treatments/FlereFagomraderPage.tsx",
  "src/site-pages/treatments/FlereFagomrader.tsx",
  "src/site-pages/treatments/Gynecology.tsx",
  "src/site-pages/treatments/OrtopediPage.tsx",
  "src/site-pages/treatments/Ortopedi.tsx",
  "src/site-pages/treatments/TreatmentPage.tsx",
  "src/site-pages/treatments/UrologiPage.tsx",
  "src/site-pages/treatments/Urology.tsx",
];

const IMPORT_LINE = 'import { AssetImg } from "@/components/AssetImg";\n';

for (const rel of files) {
  const p = path.join(process.cwd(), rel);
  if (!fs.existsSync(p)) continue;
  let s = fs.readFileSync(p, "utf8");
  if (!s.includes("<img")) continue;
  if (!s.includes('from "@/components/AssetImg"') && !s.includes("from '@/components/AssetImg'")) {
    s = IMPORT_LINE + s;
  }
  s = s.replaceAll("<img", "<AssetImg");
  fs.writeFileSync(p, s, "utf8");
  console.log("patched", rel);
}
