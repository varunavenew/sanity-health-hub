/**
 * English Services dropdown labels (canonical NO slug → EN).
 * Used when CMS EN title is missing or still Norwegian.
 */
import { FLERE_FAGOMRADER_CATEGORY_ID } from "@/lib/sanity/category-keys";
import { resolveFertilitetTreatmentSlug } from "@/lib/sanity/fertilitet-slug-aliases";
import { resolveGynekologiTreatmentSlug } from "@/lib/sanity/gynekologi-slug-aliases";
import { resolveGraviditetTreatmentSlug } from "@/lib/sanity/graviditet-slug-aliases";
import { resolveUrologiTreatmentSlug } from "@/lib/sanity/urologi-slug-aliases";
import { resolveOrtopediTreatmentSlug } from "@/lib/sanity/ortopedi-slug-aliases";
import { resolveFlereFagomraderTreatmentSlug } from "@/lib/sanity/flere-fagomrader-slug-aliases";

export const EN_CATEGORY_NAV_LABELS: Record<string, string> = {
  fertilitet: "Fertility",
  gynekologi: "Gynecology",
  graviditet: "Pregnancy",
  urologi: "Urology",
  ortopedi: "Orthopedics",
  "flere-fagomrader": "More services",
  annet: "More services",
};

export const EN_TREATMENT_NAV_LABELS: Record<string, Record<string, string>> = {
  fertilitet: {
    infertilitet: "Infertility",
    "fertilitet-infertilitet": "Infertility",
    "assistert-befruktning": "Assisted reproduction",
    fertilitetsutredning: "Fertility assessment",
    eggfrys: "Egg freezing",
    donorbehandling: "Donor treatment",
    "assistert-befruktning-for-par-og-single":
      "Assisted reproduction for couples and singles",
    hysteroskopi: "Hysteroscopy",
    saedanalyse: "Semen analysis",
  },
  gynekologi: {
    tverrfaglig: "Multidisciplinary team",
    undersokelse: "Gynaecological examination",
    urinlekkasje: "Urinary incontinence",
    endometriose: "Endometriosis",
    overgangsalder: "Menopause",
    "vaginale-fremfall": "Vaginal prolapse",
    urogynekologi: "Urogynaecology",
    blodningsforstyrrelser: "Bleeding disorders",
    celleforandringer: "Cell changes",
    cyster: "Ovarian cysts",
    "fjerne-livmor": "Hysterectomy",
    kirurgi: "Gynaecological surgery",
    hysteroskopi: "Hysteroscopy",
    labiaplastikk: "Labiaplasty",
    pmos: "PCOS",
    pcos: "PCOS",
  },
  graviditet: {
    ultralyd: "Ultrasound",
    nipt: "NIPT",
    svangerskapsteam: "Pregnancy care team",
    fosterdiagnostikk: "Prenatal diagnostics",
    fostermedisin: "Fetal medicine",
    svangerskapsoppfolging: "Pregnancy follow-up",
    graviditetsoppfolging: "Pregnancy follow-up",
    "6-ukerskontroll": "6-week postnatal check",
    fodselsskader: "Birth injuries",
    spontanabort: "Miscarriage",
  },
  urologi: {
    blaere: "Bladder and urinary tract",
    "blaere-og-urinveier": "Bladder and urinary tract",
    forhud: "Foreskin",
    infertilitet: "Male infertility",
    "fertilitet-infertilitet": "Male infertility",
    nyrer: "Kidneys",
    prostata: "Prostate",
    refertilisering: "Vasectomy reversal",
    robotkirurgi: "Robot-assisted surgery",
    sterilisering: "Vasectomy",
    testikler: "Testicles and scrotum",
    "testikler-og-pung": "Testicles and scrotum",
  },
  ortopedi: {
    "fot-ankel": "Foot and ankle",
    "fot-og-ankel": "Foot and ankle",
    hofte: "Hip",
    "hand-albue": "Hand and elbow",
    "hand-og-albue": "Hand and elbow",
    kne: "Knee",
    skulder: "Shoulder",
  },
  "flere-fagomrader": {
    endokrinologi: "Endocrinology",
    ernaringsfysiolog: "Clinical nutritionist",
    ernaeringsfysiolog: "Clinical nutritionist",
    hudhelse: "Skin health",
    gastrokirurgi: "Gastrointestinal disorders (Gastro surgery)",
    osteopati: "Osteopathy",
    psykologi: "Psychology",
    revmatologi: "Rheumatology",
    robotkirurgi: "Robot-assisted surgery",
    sexologi: "Sexology",
    areknuter: "Varicose vein treatment",
    areknutebehandling: "Varicose vein treatment",
    overvektskirurgi: "Bariatric surgery (weight-loss surgery)",
    brokkoperasjon: "Hernia surgery",
    hemorroider: "Haemorrhoids and rectal disorders",
  },
};

function looksUntranslatedNorwegian(label: string): boolean {
  return /[æøåÆØÅ]/.test(label) || /orthopedy/i.test(label);
}

function treatmentLabelsForCategory(categoryId: string): Record<string, string> | undefined {
  if (categoryId === "annet" || categoryId === "ovrige") {
    return EN_TREATMENT_NAV_LABELS[FLERE_FAGOMRADER_CATEGORY_ID];
  }
  return EN_TREATMENT_NAV_LABELS[categoryId];
}

function resolveNavLabelSlug(categoryId: string, slug: string): string[] {
  const resolve =
    categoryId === "fertilitet"
      ? resolveFertilitetTreatmentSlug
      : categoryId === "gynekologi"
        ? resolveGynekologiTreatmentSlug
        : categoryId === "graviditet"
          ? resolveGraviditetTreatmentSlug
          : categoryId === "urologi"
            ? resolveUrologiTreatmentSlug
            : categoryId === "ortopedi"
              ? resolveOrtopediTreatmentSlug
              : categoryId === FLERE_FAGOMRADER_CATEGORY_ID ||
                  categoryId === "annet" ||
                  categoryId === "ovrige"
                ? resolveFlereFagomraderTreatmentSlug
                : (value: string) => value;
  return [...new Set([slug, resolve(slug)].filter(Boolean))];
}

export function englishCategoryNavLabel(categoryId: string, cmsLabel?: string): string {
  const mapped = EN_CATEGORY_NAV_LABELS[categoryId];
  if (mapped) return mapped;
  const trimmed = cmsLabel?.trim() ?? "";
  if (/orthopedy/i.test(trimmed)) return "Orthopedics";
  return trimmed;
}

export function englishTreatmentNavLabel(
  categoryId: string,
  slugNo: string,
  cmsLabel: string,
): string {
  const labels = treatmentLabelsForCategory(categoryId);
  if (labels) {
    for (const candidate of resolveNavLabelSlug(categoryId, slugNo)) {
      if (labels[candidate]) return labels[candidate];
    }
    for (const [key, value] of Object.entries(labels)) {
      if (resolveNavLabelSlug(categoryId, key).includes(slugNo)) return value;
    }
  }
  const trimmed = cmsLabel.trim();
  if (!trimmed || looksUntranslatedNorwegian(trimmed) || trimmed === trimmed.toUpperCase()) {
    return trimmed;
  }
  return trimmed;
}
