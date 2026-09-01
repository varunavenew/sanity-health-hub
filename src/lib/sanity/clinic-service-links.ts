import { bookingCategoryHrefForClinicService } from "@/lib/bookingLinks";
import {
  behandlingerCategorySegment,
  normalizeCategoryFilterKey,
} from "@/lib/sanity/category-keys";

type CategoryRow = {
  categoryId?: string;
  slug?: string;
  title?: string;
  treatments?: Array<{ slug?: string; title?: string }>;
};

export type ClinicServiceLink = { label: string; path?: string };

export type ClinicServiceRow = { id: string; label: string; path?: string };

type ClinicServicesSection = {
  items?: Array<{ serviceId?: string; label?: string; href?: string }>;
};

/**
 * Prefer CMS `servicesSection.items` (label + href, including external URLs).
 * Fall back to Advanced `services[]` IDs looked up in the category catalogue.
 */
export function resolveClinicServiceRows(
  servicesSection: ClinicServicesSection | undefined,
  serviceIds: string[] | undefined,
  catalogue: Record<string, ClinicServiceLink>,
): ClinicServiceRow[] {
  const items = servicesSection?.items;
  if (Array.isArray(items) && items.length > 0) {
    return items.map((item, index) => {
      const id = (item.serviceId || "").trim() || `service-${index}`;
      const fromCatalogue = catalogue[id];
      const href = (item.href || "").trim() || fromCatalogue?.path;
      const label = (item.label || "").trim() || fromCatalogue?.label || id;
      return { id, label, ...(href ? { path: href } : {}) };
    });
  }

  return (serviceIds ?? []).map((id) => {
    const fromCatalogue = catalogue[id];
    return {
      id,
      label: fromCatalogue?.label || id,
      ...(fromCatalogue?.path ? { path: fromCatalogue.path } : {}),
    };
  });
}

/** Metodika clinic `services` IDs → CMS categoryId or treatment slug. */
const SERVICE_ID_ALIASES: Record<string, string> = {
  gynekolog: "gynekologi",
  ortoped: "ortopedi",
  urolog: "urologi",
  gastrokirurg: "gastrokirurgi",
  psykolog: "psykologi",
  sexolog: "sexologi",
  revmatolog: "revmatologi",
  endokrinolog: "endokrinologi",
  ernaringsfysiolog: "ernaeringsfysiolog",
  hudlege: "hudhelse",
  fostermedisiner: "fostermedisin",
  areknuter: "areknutebehandling",
};

/** Display labels when CMS title is missing (clinic Metodika IDs). */
const CLINIC_SERVICE_LABELS: Record<string, { no: string; en: string }> = {
  fertilitet: { no: "Fertilitet", en: "Fertility" },
  fostermedisiner: { no: "Fostermedisin", en: "Fetal medicine" },
  gynekolog: { no: "Gynekologi", en: "Gynaecology" },
  ernaringsfysiolog: { no: "Ernæringsfysiolog", en: "Clinical nutritionist" },
  psykolog: { no: "Psykolog", en: "Psychologist" },
  sexolog: { no: "Sexolog", en: "Sexologist" },
  gastrokirurg: { no: "Mage- og tarmlidelser (Gastrokirurgi)", en: "Gastrointestinal surgery" },
  ortoped: { no: "Ortopedi", en: "Orthopaedics" },
  handterapeut: { no: "Håndterapeut", en: "Hand therapist" },
  revmatolog: { no: "Revmatolog", en: "Rheumatologist" },
  urolog: { no: "Urologi", en: "Urology" },
  hudhelse: { no: "Hudhelse", en: "Skin health" },
  hudlege: { no: "Hudlege", en: "Dermatologist" },
  areknuter: { no: "Åreknutebehandling", en: "Varicose vein treatment" },
  "sprengte-blodkar": { no: "Sprengte blodkar", en: "Broken capillaries" },
  fysioterapeut: { no: "Fysioterapeut", en: "Physiotherapist" },
  uroterapi: { no: "Uroterapi", en: "Urotherapy" },
  osteopati: { no: "Osteopati", en: "Osteopathy" },
  robotkirurgi: { no: "Robotassistert kirurgi", en: "Robot-assisted surgery" },
  endokrinolog: { no: "Endokrinolog", en: "Endocrinologist" },
  overvektskirurgi: { no: "Overvektskirurgi (slankeoperasjon)", en: "Bariatric surgery" },
  plastikkirurgi: { no: "Plastikkirurgi", en: "Plastic surgery" },
  karkirurgi: { no: "Karkirurgi", en: "Vascular surgery" },
  hjertespesialist: { no: "Hjertespesialist", en: "Cardiologist" },
  almennlege: { no: "Allmennlege", en: "General practitioner" },
};

function categorySegment(cat: CategoryRow, lang: "no" | "en"): string {
  const slug = (cat.slug || "").trim();
  if (slug) return slug;
  const categoryId = (cat.categoryId || "").trim();
  return categoryId ? behandlingerCategorySegment(categoryId, lang) : "";
}

function treatmentPath(categorySegment: string, treatmentSlug: string): string {
  return `/${categorySegment}/${treatmentSlug}`;
}

function applyAlias(map: Record<string, ClinicServiceLink>, alias: string, target: string) {
  if (map[alias]?.path) return;
  if (map[target]) {
    map[alias] = map[target];
    return;
  }
  const normalized = normalizeCategoryFilterKey(target);
  if (map[normalized]) map[alias] = map[normalized];
}

function applyFallbacks(map: Record<string, ClinicServiceLink>, lang: "no" | "en") {
  for (const [serviceId, labels] of Object.entries(CLINIC_SERVICE_LABELS)) {
    const existing = map[serviceId];
    const fallbackPath = bookingCategoryHrefForClinicService(serviceId);
    const label = existing?.label || labels[lang] || serviceId;

    if (existing?.path) {
      if (!existing.label || existing.label === serviceId) {
        map[serviceId] = { ...existing, label };
      }
      continue;
    }

    if (fallbackPath) {
      map[serviceId] = { label, path: fallbackPath };
    } else if (!existing) {
      map[serviceId] = { label };
    }
  }
}

/**
 * Map clinic service IDs to localized labels and category/treatment paths from CMS categories.
 */
export function buildClinicServiceLinks(
  categories: CategoryRow[] | undefined,
  lang: "no" | "en",
): Record<string, ClinicServiceLink> {
  const map: Record<string, ClinicServiceLink> = {};

  for (const cat of categories || []) {
    const categoryId = (cat.categoryId || cat.slug || "").trim();
    if (!categoryId) continue;

    const segment = categorySegment(cat, lang);
    if (!segment) continue;

    const categoryLabel = (cat.title || "").trim() || categoryId;
    const categoryPath = `/${segment}`;

    map[categoryId] = { label: categoryLabel, path: categoryPath };
    map[normalizeCategoryFilterKey(categoryId)] = map[categoryId];

    const catSlug = (cat.slug || "").trim();
    if (catSlug && catSlug !== categoryId) {
      map[catSlug] = map[categoryId];
    }

    for (const treatment of cat.treatments || []) {
      const slug = (treatment.slug || "").trim();
      if (!slug) continue;
      const label = (treatment.title || "").trim() || slug;
      map[slug] = { label, path: treatmentPath(segment, slug) };
    }
  }

  for (const [alias, target] of Object.entries(SERVICE_ID_ALIASES)) {
    applyAlias(map, alias, target);
  }

  applyFallbacks(map, lang);

  return map;
}
