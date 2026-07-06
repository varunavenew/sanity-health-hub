import type { Specialist, SpecialistClinicRef, SpecialistFaq, SpecialistPatientReview, SpecialistRelatedSection, SpecialistSanityCategory } from "@/lib/sanity/specialist-types";
import { resolveSpecialistPrimaryCategory } from "@/lib/sanity/category-keys";
import { sortBySortOrder } from "@/lib/sortAlphabetical";

function normalizeBookingCategoryIds(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id): id is number => typeof id === "number" && id > 0))].sort(
    (a, b) => a - b,
  );
}

const SPECIALIST_EN_KEYWORD_MAP: Array<[string, string]> = [
  ["Gynekologisk kirurg", "Gynecological surgeon"],
  ["Fostermedisiner", "Fetal medicine specialist"],
  ["Fødselslege", "Obstetrician"],
  ["Gastrokirurg", "Gastrointestinal surgeon"],
  ["Robotkirurg", "Robotic surgeon"],
  ["Overvektskirurgi", "Obesity surgery"],
  ["Embryolog", "Embryologist"],
  ["Uroterapeut", "Urotherapist"],
  ["Urologi", "Urology"],
  ["Urolog", "Urologist"],
  ["Ortopedi", "Orthopedics"],
  ["Ortoped", "Orthopedic surgeon"],
  ["Gynekologi", "Gynecology"],
  ["Gynekolog", "Gynecologist"],
  ["Spesialist", "Specialist"],
  ["Kirurg", "Surgeon"],
  ["Fertilitet", "Fertility"],
  ["Endoskopi", "Endoscopy"],
  ["Androlog", "Andrologist"],
  ["Seksolog", "Sexologist"],
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function translateSpecialistKeywordsForEn(value: string, lang: SanityLang): string {
  if (lang !== "en" || !value) return value;
  let result = value;
  const sorted = [...SPECIALIST_EN_KEYWORD_MAP].sort((a, b) => b[0].length - a[0].length);
  for (const [no, en] of sorted) {
    result = result.replace(new RegExp(`\\b${escapeRegExp(no)}\\b`, "gi"), en);
  }
  return result;
}

type SanityLang = "no" | "en";

type I18nValueItem = { language?: string; _key?: string; value?: unknown };

export type RawSanitySpecialist = {
  _id?: string;
  _createdAt?: string;
  name?: string;
  slug?: string;
  image?: string;
  role?: unknown;
  subtitle?: unknown;
  specialties?: unknown;
  shortBio?: unknown;
  education?: unknown;
  languages?: string[];
  clinics?: string[];
  clinicRefs?: Array<{ label?: string; slug?: string }>;
  bio?: unknown;
  categories?: Array<{
    categoryId?: string;
    slug?: string;
    title?: unknown;
    categoryNumericId?: number;
    description?: string;
    quickInfoItems?: Array<{ text?: string }>;
    heroImage?: string;
  }>;
  bookingCategoryIds?: number[];
  sortOrder?: number;
  faqSectionTitle?: unknown;
  faqs?: Array<{
    question?: string;
    answer?: string;
    category?: string;
    sortOrder?: number;
  }>;
  patientReviews?: Array<{
    _id?: string;
    author?: string;
    rating?: number;
    text?: string;
    date?: string;
  }>;
  relatedSpecialistsSection?: {
    eyebrow?: string;
    heading?: string;
    ctaLabel?: string;
    ctaPath?: string;
    specialists?: RawSanitySpecialist[];
  };
  seo?: {
    metaTitle?: unknown;
    metaDescription?: unknown;
    ogImage?: unknown;
    noIndex?: boolean;
  };
  geoSummary?: unknown;
};

function pickNo(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (!Array.isArray(value)) return "";
  const entry =
    value.find((e) => (e as I18nValueItem).language === "no" || (e as I18nValueItem)._key === "no") ||
    value[0];
  if (!entry || typeof entry !== "object") return "";
  const raw = (entry as I18nValueItem).value;
  if (raw == null) return "";
  if (typeof raw === "object" && raw !== null && "current" in raw) {
    const current = (raw as { current?: unknown }).current;
    return typeof current === "string" ? current.trim() : "";
  }
  return String(raw).trim();
}

function readLocalizedString(value: unknown, lang: SanityLang): string {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return lang === "en" ? translateSpecialistKeywordsForEn(trimmed, lang) : trimmed;
  }
  if (!Array.isArray(value)) return "";
  const entries = value as I18nValueItem[];
  const matchLang = entries.find((v) => (v.language || v._key) === lang)?.value;
  if (typeof matchLang === "string" && matchLang.trim()) return matchLang.trim();
  const matchNo = entries.find((v) => (v.language || v._key) === "no")?.value;
  if (typeof matchNo === "string" && matchNo.trim()) {
    return translateSpecialistKeywordsForEn(matchNo.trim(), lang);
  }
  const first = entries[0]?.value;
  return typeof first === "string" ? translateSpecialistKeywordsForEn(first.trim(), lang) : "";
}

function readSpecialtyLabel(entry: unknown): unknown {
  if (entry && typeof entry === "object" && "label" in entry) {
    return (entry as { label?: unknown }).label;
  }
  return entry;
}

function pickSpecialtyNo(entry: unknown): string {
  return pickNo(readSpecialtyLabel(entry));
}

function readLocalizedStringArray(value: unknown, lang: SanityLang): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => readLocalizedString(readSpecialtyLabel(entry), lang))
    .filter((entry): entry is string => Boolean(entry));
}

function readEducation(value: unknown, lang: SanityLang): string | undefined {
  if (!Array.isArray(value) || value.length === 0) return undefined;
  const parts = value
    .map((entry) => readLocalizedString(readSpecialtyLabel(entry), lang))
    .filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : undefined;
}

function formatReviewDate(value: unknown, lang: SanityLang): string {
  if (value == null) return "";
  const locale = lang === "en" ? "en-GB" : "nb-NO";
  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return value;
  }
  return "";
}

function mapPatientReviews(
  reviews: RawSanitySpecialist["patientReviews"],
  lang: SanityLang,
): SpecialistPatientReview[] | undefined {
  if (!Array.isArray(reviews) || reviews.length === 0) return undefined;
  const mapped = reviews
    .map((review): SpecialistPatientReview | null => {
      const text = typeof review.text === "string" ? review.text.trim() : "";
      const name = typeof review.author === "string" ? review.author.trim() : "";
      if (!text || !name) return null;
      const formattedDate = formatReviewDate(review.date, lang);
      return {
        id: typeof review._id === "string" ? review._id : name,
        name,
        text,
        rating:
          typeof review.rating === "number" && review.rating >= 1 && review.rating <= 5
            ? review.rating
            : 5,
        ...(formattedDate ? { date: formattedDate } : {}),
      };
    })
    .filter((review): review is SpecialistPatientReview => review !== null);
  return mapped.length > 0 ? mapped : undefined;
}

function mapSpecialistFaqs(
  faqs: RawSanitySpecialist["faqs"],
): SpecialistFaq[] | undefined {
  if (!Array.isArray(faqs) || faqs.length === 0) return undefined;
  const mapped = faqs
    .map((faq) => ({
      question: typeof faq.question === "string" ? faq.question.trim() : "",
      answer: typeof faq.answer === "string" ? faq.answer.trim() : "",
      category: typeof faq.category === "string" ? faq.category : undefined,
      sortOrder: typeof faq.sortOrder === "number" ? faq.sortOrder : undefined,
    }))
    .filter((faq) => faq.question && faq.answer)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  return mapped.length > 0 ? mapped.map(({ question, answer, category }) => ({ question, answer, category })) : undefined;
}

function mapClinicRefs(
  refs: RawSanitySpecialist["clinicRefs"],
): SpecialistClinicRef[] | undefined {
  if (!Array.isArray(refs)) return undefined;
  const mapped = refs
    .map((ref) => ({
      label: typeof ref?.label === "string" ? ref.label.trim() : "",
      slug: typeof ref?.slug === "string" ? ref.slug.trim() : "",
    }))
    .filter((ref) => ref.label && ref.slug);
  return mapped.length > 0 ? mapped : undefined;
}

function mapBioBody(value: unknown): unknown[] | undefined {
  return Array.isArray(value) && value.length > 0 ? value : undefined;
}

function mapSanitySpecialistCategories(
  categories: RawSanitySpecialist["categories"],
  lang: SanityLang,
): SpecialistSanityCategory[] {
  if (!Array.isArray(categories)) return [];
  return categories
    .filter((c) => c?.categoryId && c?.slug)
    .map((c) => ({
      categoryId: c.categoryId!,
      slug: c.slug!,
      title: readLocalizedString(c.title, lang),
      categoryNumericId: c.categoryNumericId,
      heroImage: typeof c.heroImage === "string" ? c.heroImage : undefined,
    }));
}

/** Mirrors CMS publish rules — Norwegian content is required for i18n fields. */
export function isPublishableSanitySpecialist(raw: RawSanitySpecialist): boolean {
  if (!raw.name?.trim()) return false;
  if (!raw.slug?.trim()) return false;
  if (!raw.image?.trim()) return false;
  if (!pickNo(raw.role)) return false;
  if (!pickNo(raw.shortBio)) return false;
  if (!Array.isArray(raw.specialties) || raw.specialties.length === 0) return false;
  if (!raw.specialties.some((entry) => Boolean(pickSpecialtyNo(entry)))) return false;
  if (!Array.isArray(raw.categories) || raw.categories.length === 0) return false;
  if (!raw.categories.some((c) => c?.categoryId && c?.slug)) return false;
  const hasClinics =
    (Array.isArray(raw.clinics) && raw.clinics.length > 0) ||
    (Array.isArray(raw.clinicRefs) &&
      raw.clinicRefs.some((c) => typeof c?.label === "string" && c.label.trim()));
  if (!hasClinics) return false;
  const bookingIds = normalizeBookingCategoryIds(raw.bookingCategoryIds);
  if (bookingIds.length === 0) return false;
  if (!pickNo(raw.seo?.metaTitle)) return false;
  if (!pickNo(raw.seo?.metaDescription)) return false;
  return true;
}

function mapRelatedSpecialistsSection(
  section: RawSanitySpecialist["relatedSpecialistsSection"],
  lang: SanityLang,
): SpecialistRelatedSection | undefined {
  if (!section) return undefined;
  const specialists = (section.specialists || [])
    .map((row) => mapSanitySpecialistRow(row, lang))
    .filter((row): row is Specialist => row !== null);
  const eyebrow = typeof section.eyebrow === "string" ? section.eyebrow.trim() : "";
  const heading = typeof section.heading === "string" ? section.heading.trim() : "";
  const ctaLabel = typeof section.ctaLabel === "string" ? section.ctaLabel.trim() : "";
  const ctaPath = typeof section.ctaPath === "string" ? section.ctaPath.trim() : "";
  if (!eyebrow && !heading && !ctaLabel && !ctaPath && specialists.length === 0) {
    return undefined;
  }
  return {
    eyebrow: eyebrow || undefined,
    heading: heading || undefined,
    ctaLabel: ctaLabel || undefined,
    ctaPath: ctaPath || undefined,
    specialists: specialists.length > 0 ? specialists : undefined,
  };
}

export function mapSanitySpecialistRow(
  raw: RawSanitySpecialist,
  lang: SanityLang,
): Specialist | null {
  if (!isPublishableSanitySpecialist(raw)) return null;

  const bio = readLocalizedString(raw.shortBio, lang);
  const title = readLocalizedString(raw.role, lang);
  const expertise = readLocalizedStringArray(raw.specialties, lang);
  const bookingCategoryIds = normalizeBookingCategoryIds(raw.bookingCategoryIds);

  if (!bio || !title || expertise.length === 0) return null;

  const seoTitle = readLocalizedString(raw.seo?.metaTitle, lang);
  const seoDescription = readLocalizedString(raw.seo?.metaDescription, lang);

  return {
    _createdAt: raw._createdAt,
    name: raw.name!.trim(),
    slug: raw.slug!.trim(),
    image: raw.image!.trim(),
    title,
    subtitle: readLocalizedString(raw.subtitle, lang) || undefined,
    expertise,
    bio,
    bioBody: mapBioBody(raw.bio),
    education: readEducation(raw.education, lang),
    languages: raw.languages?.filter(Boolean),
    clinics: mapClinicRefs(raw.clinicRefs)?.map((c) => c.label) ?? raw.clinics?.filter(Boolean),
    clinicRefs: mapClinicRefs(raw.clinicRefs),
    category: resolveSpecialistPrimaryCategory(raw.categories) as Specialist["category"],
    sanityCategories: mapSanitySpecialistCategories(raw.categories, lang),
    bookingCategoryIds,
    sortOrder: typeof raw.sortOrder === "number" ? raw.sortOrder : undefined,
    faqSectionTitle: readLocalizedString(raw.faqSectionTitle, lang) || undefined,
    faqs: mapSpecialistFaqs(raw.faqs),
    patientReviews: mapPatientReviews(raw.patientReviews, lang),
    relatedSpecialistsSection: mapRelatedSpecialistsSection(raw.relatedSpecialistsSection, lang),
    geoSummary: readLocalizedString(raw.geoSummary, lang) || undefined,
    seo:
      seoTitle && seoDescription
        ? {
            metaTitle: seoTitle,
            metaDescription: seoDescription,
            ogImage: raw.seo?.ogImage,
            noIndex: raw.seo?.noIndex,
          }
        : undefined,
  };
}

export function mapAndSortSanitySpecialists(
  rows: RawSanitySpecialist[] | null | undefined,
  lang: SanityLang,
): Specialist[] {
  const mapped = (rows || [])
    .map((row) => mapSanitySpecialistRow(row, lang))
    .filter((row): row is Specialist => row !== null);

  return sortBySortOrder(
    mapped,
    (s) => s.sortOrder,
    (s) => s.name,
    lang,
  );
}
